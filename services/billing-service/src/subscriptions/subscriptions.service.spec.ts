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
    billingInvoice: { create: jest.fn() },
  };
  const service = new SubscriptionsService(prisma as never);
  const user = { tenantId: 't1', permissions: [] };

  it('starts trial subscription', async () => {
    prisma.subscriptionPlan.findUnique.mockResolvedValue({ id: 'p1', code: 'starter' });
    prisma.tenantSubscription.create.mockResolvedValue({ id: 's1', status: 'trialing' });
    const result = await service.startTrial(user as never, 'starter', 14);
    expect(result.status).toBe('trialing');
  });

  it('records usage billing with GST', async () => {
    prisma.billingInvoice.create.mockResolvedValue({ amount: 0.5, gstAmount: 0.09 });
    await service.recordUsageBilling(user as never, 1000);
    expect(prisma.billingInvoice.create).toHaveBeenCalled();
  });
});
