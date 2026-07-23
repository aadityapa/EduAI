import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from './invoices.service';
import { PrismaService } from '../prisma/prisma.service';
import { CouponsService } from '../coupons/coupons.service';

describe('InvoicesService', () => {
  let service: InvoicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicesService,
        {
          provide: PrismaService,
          useValue: { billingInvoice: { findMany: jest.fn(), create: jest.fn() } },
        },
        {
          provide: CouponsService,
          useValue: { applyCoupon: jest.fn(), validateCoupon: jest.fn() },
        },
      ],
    }).compile();
    service = module.get(InvoicesService);
  });

  it('calculates GST at 18%', () => {
    expect(service.calculateGst(10000)).toBe(1800);
  });

  it('calculates mid-cycle proration', () => {
    const start = new Date('2026-01-01T00:00:00Z');
    const end = new Date('2026-01-31T00:00:00Z');
    const mid = new Date('2026-01-16T00:00:00Z');
    const prorate = service.calculateProration(1000, 2000, start, end, mid);
    expect(prorate).toBeGreaterThan(400);
    expect(prorate).toBeLessThan(600);
  });
});
