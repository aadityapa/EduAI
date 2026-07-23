import { CostService } from './cost.service';

describe('CostService', () => {
  const prisma = {
    aiQuotaUsage: { findUnique: jest.fn() },
    tenant: { findUnique: jest.fn() },
    tenantSubscription: { findFirst: jest.fn() },
  };

  let service: CostService;

  beforeEach(() => {
    prisma.aiQuotaUsage.findUnique.mockResolvedValue({ tokensUsed: 100 });
    prisma.tenant.findUnique.mockResolvedValue({
      aiMonthlyTokenBudget: 3000000,
      subscriptionTier: 'starter',
    });
    prisma.tenantSubscription.findFirst.mockResolvedValue(null);
    service = new CostService(prisma as never);
  });

  it('allows requests within daily budget', async () => {
    await expect(service.checkQuota('t1', 'u1', 500)).resolves.toMatchObject({
      allowed: true,
    });
  });

  it('rejects requests exceeding daily budget with upsell payload', async () => {
    prisma.aiQuotaUsage.findUnique.mockResolvedValue({ tokensUsed: 99000 });
    prisma.tenant.findUnique.mockResolvedValue({
      aiMonthlyTokenBudget: 3000000,
      subscriptionTier: 'starter',
    });
    try {
      await service.checkQuota('t1', 'u1', 2000);
      fail('expected quota exceed');
    } catch (error: unknown) {
      const err = error as { getStatus?: () => number; getResponse?: () => unknown };
      expect(err.getStatus?.()).toBe(429);
      expect(err.getResponse?.()).toEqual(
        expect.objectContaining({
          code: 'AI_QUOTA_EXCEEDED',
          details: expect.objectContaining({
            action: 'upsell',
            queueSuggested: true,
          }),
        }),
      );
    }
  });
});
