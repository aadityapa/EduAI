import { NotFoundException } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';

describe('SubscriptionsService', () => {
  const prisma = {
    subscriptionPlan: { findUnique: jest.fn() },
    tenantSubscription: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    tenant: { update: jest.fn() },
    billingInvoice: { create: jest.fn(), updateMany: jest.fn() },
    auditLog: { create: jest.fn().mockResolvedValue({}) },
  };

  const invoicesService = {
    calculateGst: jest.fn((n: number) => Math.round(n * 0.18 * 100) / 100),
    generateSubscriptionInvoice: jest.fn().mockResolvedValue({ id: 'inv-renew' }),
    generateProrationInvoice: jest.fn().mockResolvedValue({ id: 'inv-prorate' }),
    calculateProration: jest.fn().mockReturnValue(100),
  };

  const service = new SubscriptionsService(prisma as never, invoicesService as never);
  const user = { sub: 'u1', tenantId: 't1', permissions: ['billing:manage:tenant'] };

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.auditLog.create.mockResolvedValue({});
  });

  it('starts trial subscription scoped to tenant and audits', async () => {
    prisma.subscriptionPlan.findUnique.mockResolvedValue({ id: 'p1', code: 'starter' });
    prisma.tenantSubscription.create.mockResolvedValue({ id: 's1', status: 'trialing' });
    const result = await service.startTrial(user as never, 'starter', 14);
    expect(result.status).toBe('trialing');
    expect(prisma.tenantSubscription.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ tenantId: 't1' }),
      }),
    );
    expect(prisma.auditLog.create).toHaveBeenCalled();
  });

  it('records usage billing with server-side rate (never trusts client amount)', async () => {
    prisma.billingInvoice.create.mockResolvedValue({ id: 'inv-1', amount: 0.5, gstAmount: 0.09 });
    await service.recordUsageBilling(user as never, 1000);
    expect(prisma.billingInvoice.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tenantId: 't1',
          amount: 0.5,
          metadata: expect.objectContaining({ tokensUsed: 1000 }),
        }),
      }),
    );
  });

  it('listAllSubscriptions scopes non-global actors to tenant', async () => {
    prisma.tenantSubscription.findMany.mockResolvedValue([]);
    await service.listAllSubscriptions(user as never);
    expect(prisma.tenantSubscription.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { tenantId: 't1' },
      }),
    );
  });

  it('listAllSubscriptions allows global platform admin unscoped', async () => {
    const global = {
      ...user,
      permissions: ['tenants:manage:global'],
    };
    prisma.tenantSubscription.findMany.mockResolvedValue([]);
    await service.listAllSubscriptions(global as never);
    expect(prisma.tenantSubscription.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: undefined,
      }),
    );
  });

  it('getTenantSubscription 404 when none for tenant', async () => {
    prisma.tenantSubscription.findFirst.mockResolvedValue(null);
    await expect(service.getTenantSubscription(user as never)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('cancels at period end by default', async () => {
    prisma.tenantSubscription.findFirst.mockResolvedValue({ id: 's1', tenantId: 't1' });
    prisma.tenantSubscription.update.mockResolvedValue({
      id: 's1',
      cancelAtPeriodEnd: true,
      plan: {},
    });
    const result = await service.cancelSubscription(user as never, false);
    expect(result.cancelAtPeriodEnd).toBe(true);
  });
});
