import { Test, TestingModule } from '@nestjs/testing';
import { CouponsService } from './coupons.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CouponsService', () => {
  let service: CouponsService;
  const mockPrisma = {
    coupon: { findUnique: jest.fn(), findMany: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CouponsService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();
    service = module.get(CouponsService);
    jest.clearAllMocks();
  });

  it('validates active coupon', async () => {
    mockPrisma.coupon.findUnique.mockResolvedValue({
      code: 'EDUAI20',
      isActive: true,
      validFrom: new Date('2025-01-01'),
      validUntil: new Date('2026-12-31'),
      usedCount: 0,
      maxUses: 100,
      discountPct: { toNumber: () => 20 },
    });

    const result = await service.validateCoupon('eduai20');
    expect(result.discountPct).toBe(20);
  });

  it('rejects invalid coupon', async () => {
    mockPrisma.coupon.findUnique.mockResolvedValue(null);
    await expect(service.validateCoupon('INVALID')).rejects.toThrow('Invalid coupon');
  });
});
