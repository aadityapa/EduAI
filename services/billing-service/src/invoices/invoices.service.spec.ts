import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from './invoices.service';
import { PrismaService } from '../prisma/prisma.service';

describe('InvoicesService', () => {
  let service: InvoicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicesService,
        { provide: PrismaService, useValue: { billingInvoice: { findMany: jest.fn() } } },
      ],
    }).compile();
    service = module.get(InvoicesService);
  });

  it('calculates GST at 18%', () => {
    expect(service.calculateGst(10000)).toBe(1800);
  });
});
