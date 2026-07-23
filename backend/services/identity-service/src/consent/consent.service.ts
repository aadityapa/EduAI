import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { assertSameTenant } from '@eduai/nest-common';
import { hashVerificationSecret } from '@eduai/shared';
import { Prisma } from '@eduai/database';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import type { UserContext } from '../common/decorators';
import type {
  GrantConsentDto,
  VerifyParentalConsentDto,
  WithdrawConsentDto,
} from './dto/consent.dto';

const MINOR_AGE_YEARS = 18;

@Injectable()
export class ConsentService {
  constructor(private readonly prisma: PrismaService) {}

  async listMine(actor: UserContext) {
    const rows = await this.prisma.consentRecord.findMany({
      where: {
        tenantId: actor.tenantId,
        OR: [{ subjectUserId: actor.sub }, { grantedByUserId: actor.sub }],
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return rows.map((r) => this.toDto(r));
  }

  async listTenant(actor: UserContext) {
    if (!actor.permissions.includes('consent:read:tenant')) {
      throw new ForbiddenException();
    }
    const rows = await this.prisma.consentRecord.findMany({
      where: { tenantId: actor.tenantId },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return rows.map((r) => this.toDto(r));
  }

  async grant(actor: UserContext, dto: GrantConsentDto, ip?: string) {
    const subjectId = dto.subjectUserId ?? actor.sub;
    const subject = await this.prisma.user.findFirst({
      where: { id: subjectId, deletedAt: null },
    });
    if (!subject) throw new NotFoundException('Subject not found');
    assertSameTenant(subject.tenantId, actor.tenantId);

    const forSelf = subjectId === actor.sub;
    if (!forSelf) {
      if (!actor.permissions.includes('consent:manage:linked')) {
        throw new ForbiddenException('Missing consent:manage:linked');
      }
      await this.assertLinkedParent(actor, subjectId);
    } else if (!actor.permissions.includes('consent:manage:own')) {
      throw new ForbiddenException('Missing consent:manage:own');
    }

    const isMinor = this.isLikelyMinor(subject.dateOfBirth);
    const needsParental = isMinor && forSelf === false;
    // Self-grant by a minor for non-core purposes stays pending until parent verifies
    const selfMinorNonCore =
      forSelf && isMinor && dto.purpose !== 'account_core';

    let status: 'granted' | 'pending_parental' = 'granted';
    let parentalMethod: 'email_otp' | 'in_person' | 'school_attestation' | 'digital_signature' | null =
      dto.parentalMethod ?? null;
    let evidence: Prisma.InputJsonValue = { purposeLimitation: true };
    let verificationCode: string | undefined;

    if (needsParental || selfMinorNonCore) {
      status = 'pending_parental';
      parentalMethod = parentalMethod ?? 'email_otp';
      verificationCode = crypto.randomInt(100000, 999999).toString();
      evidence = {
        purposeLimitation: true,
        otpHash: hashVerificationSecret(verificationCode),
        issuedAt: new Date().toISOString(),
        // Dev-only plaintext echo — never set in production responses via toDto
        _devCode: process.env.NODE_ENV === 'production' ? undefined : verificationCode,
      };
    }

    const record = await this.prisma.consentRecord.create({
      data: {
        tenantId: actor.tenantId,
        subjectUserId: subjectId,
        grantedByUserId: actor.sub,
        purpose: dto.purpose,
        status,
        policyVersion: dto.policyVersion ?? '2026.07',
        parentalMethod,
        evidence,
        parentalVerifiedAt: status === 'granted' && parentalMethod ? new Date() : null,
      },
    });

    await this.audit(actor, 'consent:grant', record.id, ip, {
      purpose: dto.purpose,
      status,
      subjectUserId: subjectId,
    });

    const dtoOut = this.toDto(record);
    if (verificationCode && process.env.NODE_ENV !== 'production') {
      return { ...dtoOut, verificationCodeHint: verificationCode };
    }
    return dtoOut;
  }

  async verifyParental(
    actor: UserContext,
    consentId: string,
    dto: VerifyParentalConsentDto,
    ip?: string,
  ) {
    const record = await this.prisma.consentRecord.findFirst({
      where: { id: consentId, tenantId: actor.tenantId },
    });
    if (!record) throw new NotFoundException();
    if (record.status !== 'pending_parental') {
      throw new BadRequestException('Consent is not awaiting parental verification');
    }

    const isGranter = record.grantedByUserId === actor.sub;
    const canLinked = actor.permissions.includes('consent:manage:linked');
    if (!isGranter && !canLinked) {
      throw new ForbiddenException();
    }
    if (canLinked && record.subjectUserId !== actor.sub) {
      await this.assertLinkedParent(actor, record.subjectUserId);
    }

    const evidence = (record.evidence ?? {}) as { otpHash?: string };
    if (!evidence.otpHash || evidence.otpHash !== hashVerificationSecret(dto.code)) {
      await this.audit(actor, 'consent:verify_failed', record.id, ip);
      throw new ForbiddenException('Invalid verification code');
    }

    const updated = await this.prisma.consentRecord.update({
      where: { id: record.id },
      data: {
        status: 'granted',
        parentalVerifiedAt: new Date(),
        evidence: {
          purposeLimitation: true,
          verifiedAt: new Date().toISOString(),
          method: record.parentalMethod,
        },
      },
    });

    await this.audit(actor, 'consent:verify', record.id, ip);
    return this.toDto(updated);
  }

  async withdraw(
    actor: UserContext,
    consentId: string,
    dto: WithdrawConsentDto,
    ip?: string,
  ) {
    const record = await this.prisma.consentRecord.findFirst({
      where: { id: consentId, tenantId: actor.tenantId },
    });
    if (!record) throw new NotFoundException();

    const isSubject = record.subjectUserId === actor.sub;
    const isGranter = record.grantedByUserId === actor.sub;
    if (!isSubject && !isGranter) {
      if (!actor.permissions.includes('consent:manage:linked')) {
        throw new ForbiddenException();
      }
      await this.assertLinkedParent(actor, record.subjectUserId);
    }

    const updated = await this.prisma.consentRecord.update({
      where: { id: record.id },
      data: {
        status: 'withdrawn',
        withdrawnAt: new Date(),
        evidence: {
          ...(typeof record.evidence === 'object' && record.evidence
            ? (record.evidence as object)
            : {}),
          withdrawReason: dto.reason ?? null,
        },
      },
    });

    await this.audit(actor, 'consent:withdraw', record.id, ip, { reason: dto.reason });
    return this.toDto(updated);
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

  private isLikelyMinor(dob: Date | null): boolean {
    if (!dob) return true; // fail closed: treat unknown DOB as needing parental path when parent grants
    const ageMs = Date.now() - dob.getTime();
    const years = ageMs / (365.25 * 24 * 60 * 60 * 1000);
    return years < MINOR_AGE_YEARS;
  }

  private toDto(r: {
    id: string;
    tenantId: string;
    subjectUserId: string;
    grantedByUserId: string;
    purpose: string;
    status: string;
    policyVersion: string;
    parentalMethod: string | null;
    parentalVerifiedAt: Date | null;
    expiresAt: Date | null;
    withdrawnAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: r.id,
      tenant_id: r.tenantId,
      subject_user_id: r.subjectUserId,
      granted_by_user_id: r.grantedByUserId,
      purpose: r.purpose,
      status: r.status,
      policy_version: r.policyVersion,
      parental_method: r.parentalMethod,
      parental_verified_at: r.parentalVerifiedAt?.toISOString() ?? null,
      expires_at: r.expiresAt?.toISOString() ?? null,
      withdrawn_at: r.withdrawnAt?.toISOString() ?? null,
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
        resourceType: 'consent',
        resourceId,
        ipAddress: ip,
        metadata: (metadata ?? {}) as Prisma.InputJsonValue,
      },
    });
  }
}
