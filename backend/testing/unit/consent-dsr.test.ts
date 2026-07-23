import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConsentService } from '../../services/identity-service/src/consent/consent.service';
import { PrivacyService } from '../../services/identity-service/src/privacy/privacy.service';

describe('Phase 9 consent + DSR authz', () => {
  describe('ConsentService', () => {
    const actor = {
      sub: 'parent-1',
      email: 'parent@demo.local',
      tenantId: 'tenant-a',
      roles: ['parent'] as const,
      permissions: ['consent:manage:own', 'consent:manage:linked'],
    };

    let prisma: Record<string, unknown>;
    let svc: ConsentService;

    beforeEach(() => {
      prisma = {
        user: {
          findFirst: vi.fn().mockResolvedValue({
            id: 'student-1',
            tenantId: 'tenant-a',
            dateOfBirth: new Date('2014-01-01'),
            deletedAt: null,
          }),
        },
        parentStudentLink: {
          findFirst: vi.fn().mockResolvedValue({
            id: 'link-1',
            parentId: 'parent-1',
            studentId: 'student-1',
            status: 'verified',
          }),
        },
        consentRecord: {
          create: vi.fn().mockImplementation(({ data }: { data: Record<string, unknown> }) =>
            Promise.resolve({
              id: 'consent-1',
              ...data,
              parentalVerifiedAt: null,
              expiresAt: null,
              withdrawnAt: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            }),
          ),
          findFirst: vi.fn(),
          findMany: vi.fn().mockResolvedValue([]),
          update: vi.fn(),
        },
        auditLog: { create: vi.fn().mockResolvedValue({}) },
      };
      svc = new ConsentService(prisma as never);
    });

    it('grants parental consent as pending_parental for linked minor', async () => {
      const result = await svc.grant(actor as never, {
        purpose: 'ai_tutor' as never,
        subjectUserId: 'student-1',
        parentalMethod: 'email_otp' as never,
      });
      expect(result.status).toBe('pending_parental');
      expect(prisma.consentRecord.create).toHaveBeenCalled();
      expect(prisma.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ action: 'consent:grant' }),
        }),
      );
    });

    it('rejects cross-tenant subject', async () => {
      (prisma.user as { findFirst: ReturnType<typeof vi.fn> }).findFirst.mockResolvedValue({
        id: 'student-1',
        tenantId: 'tenant-b',
        dateOfBirth: new Date('2014-01-01'),
        deletedAt: null,
      });
      await expect(
        svc.grant(actor as never, {
          purpose: 'ai_tutor' as never,
          subjectUserId: 'student-1',
        }),
      ).rejects.toThrow(/not found/i);
    });

    it('rejects unlinked parent', async () => {
      (prisma.parentStudentLink as { findFirst: ReturnType<typeof vi.fn> }).findFirst.mockResolvedValue(
        null,
      );
      await expect(
        svc.grant(actor as never, {
          purpose: 'ai_tutor' as never,
          subjectUserId: 'student-1',
        }),
      ).rejects.toThrow(/verified parent/i);
    });
  });

  describe('PrivacyService', () => {
    const student = {
      sub: 'student-1',
      email: 'student@demo.local',
      tenantId: 'tenant-a',
      roles: ['student'] as const,
      permissions: ['privacy:export:own', 'privacy:delete:own'],
    };

    const admin = {
      sub: 'admin-1',
      email: 'admin@demo.local',
      tenantId: 'tenant-a',
      roles: ['tenant_admin'] as const,
      permissions: ['privacy:manage:tenant', 'privacy:export:own', 'privacy:delete:own'],
    };

    function buildPrisma() {
      return {
        user: {
          findFirst: vi.fn().mockResolvedValue({
            id: 'student-1',
            tenantId: 'tenant-a',
            email: 'student@demo.local',
            firstName: 'Demo',
            lastName: 'Student',
            phone: null,
            locale: 'en-IN',
            classLevel: 10,
            dateOfBirth: new Date('2010-01-01'),
            createdAt: new Date(),
            status: 'active',
            deletedAt: null,
          }),
          update: vi.fn().mockResolvedValue({}),
        },
        dataSubjectRequest: {
          create: vi.fn().mockImplementation(({ data }: { data: Record<string, unknown> }) =>
            Promise.resolve({
              id: 'dsr-1',
              ...data,
              exportArtifactRef: null,
              resolutionNote: null,
              completedAt: null,
              purposeNote: data.purposeNote ?? null,
              createdAt: new Date(),
              updatedAt: new Date(),
            }),
          ),
          findFirst: vi.fn().mockImplementation(({ where }: { where: { id?: string } }) =>
            Promise.resolve({
              id: where.id ?? 'dsr-1',
              tenantId: 'tenant-a',
              subjectUserId: 'student-1',
              requestedByUserId: 'student-1',
              type: 'access_export',
              status: 'submitted',
              purposeNote: null,
              exportArtifactRef: null,
              resolutionNote: null,
              dueAt: new Date(),
              completedAt: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            }),
          ),
          findMany: vi.fn().mockResolvedValue([]),
          update: vi.fn().mockImplementation(({ data }: { data: Record<string, unknown> }) =>
            Promise.resolve({
              id: 'dsr-1',
              tenantId: 'tenant-a',
              subjectUserId: 'student-1',
              requestedByUserId: 'student-1',
              type: 'access_export',
              purposeNote: null,
              exportArtifactRef: data.exportArtifactRef ?? null,
              resolutionNote: data.resolutionNote ?? null,
              dueAt: new Date(),
              completedAt: data.completedAt ?? null,
              status: data.status,
              createdAt: new Date(),
              updatedAt: new Date(),
            }),
          ),
        },
        consentRecord: { findMany: vi.fn().mockResolvedValue([]) },
        userSession: {
          findMany: vi.fn().mockResolvedValue([]),
          deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
        },
        userRole: { findMany: vi.fn().mockResolvedValue([]) },
        parentStudentLink: { findFirst: vi.fn() },
        auditLog: { create: vi.fn().mockResolvedValue({}) },
        $transaction: vi
          .fn()
          .mockImplementation((ops: unknown[]) => Promise.all(ops as Promise<unknown>[])),
      };
    }

    it('auto-fulfills access_export for self', async () => {
      const prisma = buildPrisma();
      const svc = new PrivacyService(prisma as never);
      const result = await svc.create(student as never, { type: 'access_export' as never });
      expect(result.status).toBe('completed');
      expect((result as { export?: unknown }).export).toBeDefined();
    });

    it('blocks cross-tenant erasure create', async () => {
      const prisma = buildPrisma();
      prisma.user.findFirst.mockResolvedValue({
        id: 'student-1',
        tenantId: 'other-tenant',
        deletedAt: null,
      });
      const svc = new PrivacyService(prisma as never);
      await expect(svc.create(student as never, { type: 'erasure' as never })).rejects.toThrow(
        /not found/i,
      );
    });

    it('admin can complete erasure', async () => {
      const prisma = buildPrisma();
      prisma.dataSubjectRequest.findFirst.mockResolvedValue({
        id: 'dsr-erase',
        tenantId: 'tenant-a',
        subjectUserId: 'student-1',
        requestedByUserId: 'student-1',
        type: 'erasure',
        status: 'submitted',
        purposeNote: null,
        exportArtifactRef: null,
        resolutionNote: null,
        dueAt: new Date(),
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const svc = new PrivacyService(prisma as never);
      const result = await svc.updateStatus(admin as never, 'dsr-erase', {
        status: 'completed' as never,
        resolutionNote: 'erased',
      });
      expect(result.status).toBe('completed');
      expect(prisma.user.update).toHaveBeenCalled();
    });
  });
});
