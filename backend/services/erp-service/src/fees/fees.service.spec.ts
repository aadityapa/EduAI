import { Test, TestingModule } from '@nestjs/testing';
import { FeesService } from './fees.service';
import { PrismaService } from '../prisma/prisma.service';

describe('FeesService', () => {
  let service: FeesService;
  const mockPrisma = {
    feeInvoice: { findMany: jest.fn() },
    parentStudentLink: { findFirst: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeesService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();
    service = module.get(FeesService);
    jest.clearAllMocks();
  });

  it('summarizes student fees', async () => {
    mockPrisma.feeInvoice.findMany.mockResolvedValue([
      {
        id: 'inv-1',
        invoiceNumber: 'FEE-001',
        description: 'Tuition',
        amount: { toNumber: () => 10000 },
        gstAmount: { toNumber: () => 1800 },
        status: 'issued',
        dueDate: new Date(),
        paidAt: null,
        payments: [],
      },
    ]);

    const user = {
      sub: 'student-1',
      tenantId: 'tenant-1',
      permissions: ['billing:manage:own'],
    };

    const result = await service.getStudentFees(user as never, 'student-1');
    expect(result.summary.totalDue).toBe(11800);
    expect(result.invoices).toHaveLength(1);
  });
});
