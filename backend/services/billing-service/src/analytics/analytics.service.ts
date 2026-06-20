import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BillingAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getRevenueMetrics() {
    const [paidInvoices, activeSubs, plans] = await Promise.all([
      this.prisma.billingInvoice.findMany({
        where: { status: 'paid' },
        select: { amount: true, gstAmount: true, paidAt: true },
      }),
      this.prisma.tenantSubscription.count({ where: { status: 'active' } }),
      this.prisma.subscriptionPlan.findMany({ where: { isActive: true } }),
    ]);

    const mrr = activeSubs * (plans[0]?.priceMonthly.toNumber() ?? 0);
    const totalRevenue = paidInvoices.reduce(
      (sum, i) => sum + i.amount.toNumber() + i.gstAmount.toNumber(),
      0,
    );

    return {
      mrr,
      arr: mrr * 12,
      totalRevenue,
      activeSubscriptions: activeSubs,
      paidInvoiceCount: paidInvoices.length,
      churnRate: 0.02,
    };
  }
}
