import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import type { RoleCode } from '@eduai/shared';
import { UsersService } from '../../services/identity-service/src/users/users.service';
import { SubscriptionsService } from '../../services/billing-service/src/subscriptions/subscriptions.service';
import { AttendanceService } from '../../services/erp-service/src/attendance/attendance.service';
import { assertSameTenant, tenantWhere } from '../../shared/nest-common/src/utils/tenant';

describe('Phase 6 tenant isolation', () => {
  describe('assertSameTenant / tenantWhere helpers', () => {
    it('404s cross-tenant by default', () => {
      expect(() => assertSameTenant('b', 'a')).toThrow(NotFoundException);
    });
    it('always scopes where clauses', () => {
      expect(tenantWhere('t1', { id: 'x' })).toEqual({ id: 'x', tenantId: 't1' });
    });
  });

  describe('UsersService', () => {
    const actor = {
      sub: 'admin-1',
      email: 'admin@demo.eduai.in',
      tenantId: 'tenant-a',
      roles: ['tenant_admin'] as RoleCode[],
      permissions: ['users:read:tenant', 'users:delete:tenant', 'users:create:tenant'],
    };

    let findFirst: ReturnType<typeof vi.fn>;
    let findMany: ReturnType<typeof vi.fn>;
    let count: ReturnType<typeof vi.fn>;
    let update: ReturnType<typeof vi.fn>;
    let auditCreate: ReturnType<typeof vi.fn>;
    let service: UsersService;

    beforeEach(() => {
      findFirst = vi.fn();
      findMany = vi.fn().mockResolvedValue([]);
      count = vi.fn().mockResolvedValue(0);
      update = vi.fn();
      auditCreate = vi.fn().mockResolvedValue({});
      service = new UsersService({
        user: { findFirst, findMany, count, update },
        auditLog: { create: auditCreate },
      } as never);
    });

    it('getUser returns 404 for cross-tenant user id', async () => {
      findFirst.mockResolvedValue({
        id: 'user-other',
        tenantId: 'tenant-b',
        deletedAt: null,
        email: 'x@y.com',
        firstName: 'X',
        lastName: null,
        phone: null,
        schoolId: null,
        locale: 'en',
        classLevel: null,
        avatarUrl: null,
        status: 'active',
        createdAt: new Date(),
        userRoles: [{ role: { code: 'student' } }],
      });
      await expect(service.getUser(actor, 'user-other')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('softDelete refuses cross-tenant ids', async () => {
      findFirst.mockResolvedValue(null);
      await expect(service.softDelete(actor, 'user-other')).rejects.toBeInstanceOf(NotFoundException);
      expect(update).not.toHaveBeenCalled();
    });

    it('listUsers always scopes where.tenantId to actor', async () => {
      await service.listUsers(actor, { page: 1, page_size: 10 });
      expect(findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ tenantId: 'tenant-a' }),
        }),
      );
    });
  });

  describe('SubscriptionsService', () => {
    const prisma = {
      subscriptionPlan: { findUnique: vi.fn() },
      tenantSubscription: {
        findFirst: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        findMany: vi.fn(),
      },
      billingInvoice: { create: vi.fn() },
      auditLog: { create: vi.fn().mockResolvedValue({}) },
    };
    const invoicesService = {
      calculateGst: vi.fn((n: number) => Math.round(n * 0.18 * 100) / 100),
      generateSubscriptionInvoice: vi.fn(),
      generateProrationInvoice: vi.fn(),
      calculateProration: vi.fn(),
    };
    const service = new SubscriptionsService(prisma as never, invoicesService as never);
    const user = { sub: 'u1', tenantId: 't1', permissions: ['billing:manage:tenant'] };

    beforeEach(() => {
      vi.clearAllMocks();
      prisma.auditLog.create.mockResolvedValue({});
    });

    it('scopes trial create to tenant', async () => {
      prisma.subscriptionPlan.findUnique.mockResolvedValue({ id: 'p1', code: 'starter' });
      prisma.tenantSubscription.create.mockResolvedValue({ id: 's1', status: 'trialing' });
      await service.startTrial(user as never, 'starter', 14);
      expect(prisma.tenantSubscription.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ tenantId: 't1' }),
        }),
      );
    });

    it('listAllSubscriptions scopes non-global actors', async () => {
      prisma.tenantSubscription.findMany.mockResolvedValue([]);
      await service.listAllSubscriptions(user as never);
      expect(prisma.tenantSubscription.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { tenantId: 't1' } }),
      );
    });
  });

  describe('AttendanceService', () => {
    const mockPrisma = {
      academicClass: { findFirst: vi.fn() },
      attendanceRecord: { upsert: vi.fn(), findMany: vi.fn() },
      parentStudentLink: { findFirst: vi.fn() },
      logActivity: vi.fn(),
    };
    const user = {
      sub: 'teacher-1',
      email: 'teacher@test.in',
      tenantId: 'tenant-1',
      roles: ['teacher'] as const,
      permissions: ['attendance:write:class'],
    };
    const service = new AttendanceService(mockPrisma as never);

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('refuses markAttendance for class outside tenant', async () => {
      mockPrisma.academicClass.findFirst.mockResolvedValue(null);
      await expect(
        service.markAttendance(user as never, {
          classId: 'other-tenant-class',
          date: '2025-06-21',
          entries: [{ studentId: 'student-1', status: 'present' }],
        }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(mockPrisma.attendanceRecord.upsert).not.toHaveBeenCalled();
    });

    it('scopes class lookup to caller tenantId', async () => {
      mockPrisma.academicClass.findFirst.mockResolvedValue({ id: 'class-1' });
      mockPrisma.attendanceRecord.upsert.mockResolvedValue({ id: 'rec-1', status: 'present' });
      mockPrisma.logActivity.mockResolvedValue(undefined);
      await service.markAttendance(user as never, {
        classId: 'class-1',
        date: '2025-06-21',
        entries: [{ studentId: 'student-1', status: 'present' }],
      });
      expect(mockPrisma.academicClass.findFirst).toHaveBeenCalledWith({
        where: { id: 'class-1', tenantId: 'tenant-1' },
      });
    });
  });
});
