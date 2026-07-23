import { Test, TestingModule } from '@nestjs/testing';
import { CouponsService } from './coupons.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CouponsService', () => {
  let service: CouponsService;
  const mockPrisma = {
    coupon: { findUnique: jest.fn(), findMany: jest.fn(), update: jest.fn() },
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
      id: 'c1',
      code: 'EDUAI20',
      isActive: true,
      validFrom: new Date('2025-01-01'),
      validUntil: new Date('2027-12-31'),
      usedCount: 0,
      maxUses: 100,
      tenantId: null,
      discountPct: { toNumber: () => 20 },
    });

    const result = await service.validateCoupon('eduai20');
    expect(result.discountPct).toBe(20);
  });

  it('rejects invalid coupon', async () => {
    mockPrisma.coupon.findUnique.mockResolvedValue(null);
    await expect(service.validateCoupon('INVALID')).rejects.toThrow('Invalid coupon');
  });

  it('applies coupon discount server-side and increments use count', async () => {
    mockPrisma.coupon.findUnique.mockResolvedValue({
      id: 'c1',
      code: 'EDUAI20',
      isActive: true,
      validFrom: new Date('2025-01-01'),
      validUntil: new Date('2027-12-31'),
      usedCount: 0,
      maxUses: 100,
      tenantId: null,
      discountPct: { toNumber: () => 20 },
    });
    mockPrisma.coupon.update.mockResolvedValue({});

    const result = await service.applyCoupon('EDUAI20', 1000);
    expect(result.discountAmount).toBe(200);
    expect(result.finalAmount).toBe(800);
    expect(mockPrisma.coupon.update).toHaveBeenCalled();
  });
});
