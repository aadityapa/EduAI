import { CostService } from './cost.service';

describe('CostService', () => {
  const prisma = {
    aiQuotaUsage: { findUnique: jest.fn() },
    tenant: { findUnique: jest.fn() },
    aiQuotaUsage_findMany: jest.fn(),
  };

  let service: CostService;

  beforeEach(() => {
    prisma.aiQuotaUsage.findUnique.mockResolvedValue({ tokensUsed: 100 });
    prisma.tenant.findUnique.mockResolvedValue({ aiMonthlyTokenBudget: 3000000 });
    service = new CostService(prisma as never);
  });

  it('allows requests within daily budget', async () => {
    await expect(service.checkQuota('t1', 'u1', 500)).resolves.toBeUndefined();
  });

  it('rejects requests exceeding daily budget', async () => {
    prisma.aiQuotaUsage.findUnique.mockResolvedValue({ tokensUsed: 99000 });
    prisma.tenant.findUnique.mockResolvedValue({ aiMonthlyTokenBudget: 3000000 });
    await expect(service.checkQuota('t1', 'u1', 2000)).rejects.toThrow(/quota/i);
  });
});
