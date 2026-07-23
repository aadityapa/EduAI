import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { assertSameTenant } from '@eduai/nest-common';
import { Prisma } from '@eduai/database';
import { PrismaService } from '../prisma/prisma.service';
import type { UserContext } from '../common/decorators';
import type { CreateDsrDto, UpdateDsrStatusDto } from './dto/privacy.dto';

const DSR_SLA_DAYS = 30;

@Injectable()
export class PrivacyService {
  constructor(private readonly prisma: PrismaService) {}

  async listMine(actor: UserContext) {
    const rows = await this.prisma.dataSubjectRequest.findMany({
      where: {
        tenantId: actor.tenantId,
        OR: [{ subjectUserId: actor.sub }, { requestedByUserId: actor.sub }],
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return rows.map((r) => this.toDto(r));
  }

  async listTenant(actor: UserContext) {
    if (!actor.permissions.includes('privacy:manage:tenant')) {
      throw new ForbiddenException();
    }
    const rows = await this.prisma.dataSubjectRequest.findMany({
      where: { tenantId: actor.tenantId },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return rows.map((r) => this.toDto(r));
  }

  async create(actor: UserContext, dto: CreateDsrDto, ip?: string) {
    const subjectId = dto.subjectUserId ?? actor.sub;
    const forSelf = subjectId === actor.sub;

    if (forSelf) {
      if (dto.type === 'access_export' && !actor.permissions.includes('privacy:export:own')) {
        throw new ForbiddenException('Missing privacy:export:own');
      }
      if (dto.type === 'erasure' && !actor.permissions.includes('privacy:delete:own')) {
        throw new ForbiddenException('Missing privacy:delete:own');
      }
      if (
        (dto.type === 'correction' || dto.type === 'restrict_processing') &&
        !actor.permissions.includes('privacy:export:own')
      ) {
        throw new ForbiddenException();
      }
    } else {
      if (!actor.permissions.includes('privacy:manage:linked')) {
        throw new ForbiddenException('Missing privacy:manage:linked');
      }
      await this.assertLinkedParent(actor, subjectId);
    }

    const subject = await this.prisma.user.findFirst({
      where: { id: subjectId, deletedAt: null },
    });
    if (!subject) throw new NotFoundException('Subject not found');
    assertSameTenant(subject.tenantId, actor.tenantId);

    const dueAt = new Date(Date.now() + DSR_SLA_DAYS * 24 * 60 * 60 * 1000);
    const record = await this.prisma.dataSubjectRequest.create({
      data: {
        tenantId: actor.tenantId,
        subjectUserId: subjectId,
        requestedByUserId: actor.sub,
        type: dto.type,
        status: 'submitted',
        purposeNote: dto.purposeNote,
        dueAt,
      },
    });

    await this.audit(actor, `privacy:dsr:${dto.type}`, record.id, ip);

    // Happy-path auto-fulfill export for demo (synchronous package)
    if (dto.type === 'access_export') {
      return this.fulfillExport(actor, record.id, ip);
    }

    return this.toDto(record);
  }

  async getExport(actor: UserContext, id: string) {
    const record = await this.prisma.dataSubjectRequest.findFirst({
      where: { id, tenantId: actor.tenantId },
    });
    if (!record) throw new NotFoundException();

    const allowed =
      record.subjectUserId === actor.sub ||
      record.requestedByUserId === actor.sub ||
      actor.permissions.includes('privacy:manage:tenant');
    if (!allowed) throw new ForbiddenException();
    if (record.type !== 'access_export') {
      throw new BadRequestException('Not an export request');
    }

    return this.buildExportPackage(record.subjectUserId, actor.tenantId);
  }

  async updateStatus(actor: UserContext, id: string, dto: UpdateDsrStatusDto, ip?: string) {
    if (!actor.permissions.includes('privacy:manage:tenant')) {
      throw new ForbiddenException();
    }
    const record = await this.prisma.dataSubjectRequest.findFirst({
      where: { id, tenantId: actor.tenantId },
    });
    if (!record) throw new NotFoundException();

    if (dto.status === 'completed' && record.type === 'erasure') {
      await this.fulfillErasure(actor, record.subjectUserId);
    }

    const updated = await this.prisma.dataSubjectRequest.update({
      where: { id: record.id },
      data: {
        status: dto.status,
        resolutionNote: dto.resolutionNote,
        completedAt: dto.status === 'completed' ? new Date() : record.completedAt,
      },
    });

    await this.audit(actor, `privacy:dsr:status:${dto.status}`, record.id, ip);
    return this.toDto(updated);
  }

  private async fulfillExport(actor: UserContext, id: string, ip?: string) {
    const record = await this.prisma.dataSubjectRequest.findFirst({
      where: { id, tenantId: actor.tenantId },
    });
    if (!record) throw new NotFoundException();

    const pkg = await this.buildExportPackage(record.subjectUserId, actor.tenantId);
    const artifactRef = `memory://dsr-export/${record.id}`;

    const updated = await this.prisma.dataSubjectRequest.update({
      where: { id: record.id },
      data: {
        status: 'completed',
        exportArtifactRef: artifactRef,
        completedAt: new Date(),
        resolutionNote: 'Auto-fulfilled export package (Phase 9)',
      },
    });

    await this.audit(actor, 'privacy:dsr:export_completed', record.id, ip);
    return { ...this.toDto(updated), export: pkg };
  }

  private async buildExportPackage(subjectUserId: string, tenantId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: subjectUserId, tenantId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        locale: true,
        classLevel: true,
        dateOfBirth: true,
        createdAt: true,
        status: true,
      },
    });
    if (!user) throw new NotFoundException();

    const [consents, sessions, roles] = await Promise.all([
      this.prisma.consentRecord.findMany({
        where: { tenantId, subjectUserId },
        select: {
          id: true,
          purpose: true,
          status: true,
          policyVersion: true,
          createdAt: true,
          withdrawnAt: true,
        },
      }),
      this.prisma.userSession.findMany({
        where: { tenantId, userId: subjectUserId },
        select: { id: true, createdAt: true, expiresAt: true, ipAddress: true },
        take: 50,
      }),
      this.prisma.userRole.findMany({
        where: { tenantId, userId: subjectUserId },
        include: { role: { select: { code: true } } },
      }),
    ]);

    return {
      schema_version: 'eduai-dsr-export-1',
      generated_at: new Date().toISOString(),
      residency_region: process.env.DATA_RESIDENCY_REGION ?? 'ap-south-1',
      data_principal: {
        id: user.id,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        phone: user.phone,
        locale: user.locale,
        class_level: user.classLevel,
        date_of_birth: user.dateOfBirth?.toISOString().slice(0, 10) ?? null,
        status: user.status,
        created_at: user.createdAt.toISOString(),
        roles: roles.map((r) => r.role.code),
      },
      consents: consents.map((c) => ({
        id: c.id,
        purpose: c.purpose,
        status: c.status,
        policy_version: c.policyVersion,
        created_at: c.createdAt.toISOString(),
        withdrawn_at: c.withdrawnAt?.toISOString() ?? null,
      })),
      sessions: sessions.map((s) => ({
        id: s.id,
        created_at: s.createdAt.toISOString(),
        expires_at: s.expiresAt.toISOString(),
        ip_address: s.ipAddress,
      })),
      minimization_note:
        'Export excludes payment card data, password hashes, and third-party provider secrets.',
    };
  }

  private async fulfillErasure(actor: UserContext, subjectUserId: string) {
    const anon = `deleted+${subjectUserId.slice(0, 8)}@anonymized.invalid`;
    await this.prisma.$transaction([
      this.prisma.userSession.deleteMany({
        where: { tenantId: actor.tenantId, userId: subjectUserId },
      }),
      this.prisma.user.update({
        where: { id: subjectUserId },
        data: {
          email: anon,
          firstName: 'Deleted',
          lastName: 'User',
          phone: null,
          avatarUrl: null,
          dateOfBirth: null,
          passwordHash: null,
          status: 'inactive',
          deletedAt: new Date(),
          metadata: { anonymized: true, at: new Date().toISOString() },
        },
      }),
    ]);
  }

  private async assertLinkedParent(actor: UserContext, studentId: string) {
    const link = await this.prisma.parentStudentLink.findFirst({
      where: {
        tenantId: actor.tenantId,
        parentId: actor.sub,
        studentId,
        status: 'verified',
        deletedAt: null,
      },
    });
    if (!link) {
      throw new ForbiddenException('Not a verified parent of this student');
    }
  }

  private toDto(r: {
    id: string;
    tenantId: string;
    subjectUserId: string;
    requestedByUserId: string;
    type: string;
    status: string;
    purposeNote: string | null;
    exportArtifactRef: string | null;
    resolutionNote: string | null;
    dueAt: Date;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: r.id,
      tenant_id: r.tenantId,
      subject_user_id: r.subjectUserId,
      requested_by_user_id: r.requestedByUserId,
      type: r.type,
      status: r.status,
      purpose_note: r.purposeNote,
      export_artifact_ref: r.exportArtifactRef,
      resolution_note: r.resolutionNote,
      due_at: r.dueAt.toISOString(),
      completed_at: r.completedAt?.toISOString() ?? null,
      created_at: r.createdAt.toISOString(),
      updated_at: r.updatedAt.toISOString(),
    };
  }

  private async audit(
    actor: UserContext,
    action: string,
    resourceId: string,
    ip?: string,
    metadata?: Record<string, unknown>,
  ) {
    await this.prisma.auditLog.create({
      data: {
        tenantId: actor.tenantId,
        actorId: actor.sub,
        action,
        resourceType: 'dsr',
        resourceId,
        ipAddress: ip,
        metadata: (metadata ?? {}) as Prisma.InputJsonValue,
      },
    });
  }
}
