import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { UserContext } from '../common/decorators';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  async listTenantInvoices(user: UserContext) {
    return this.prisma.billingInvoice.findMany({
      where: { tenantId: user.tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async listAllInvoices(user: UserContext) {
    const isGlobal = user.permissions.includes('tenants:manage:global');
    return this.prisma.billingInvoice.findMany({
      where: isGlobal ? undefined : { tenantId: user.tenantId },
      include: { tenant: { select: { slug: true, name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  calculateGst(amount: number, rate = 0.18): number {
    return Math.round(amount * rate * 100) / 100;
  }
}
