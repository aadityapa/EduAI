import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BillingAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getRevenueMetrics() {
    const [paidInvoices, activeSubs, cancelledSubs, plans, pastDue] = await Promise.all([
      this.prisma.billingInvoice.findMany({
        where: { status: 'paid' },
        select: { amount: true, gstAmount: true, discountAmount: true, paidAt: true },
      }),
      this.prisma.tenantSubscription.count({ where: { status: 'active' } }),
      this.prisma.tenantSubscription.count({
        where: { status: { in: ['cancelled', 'expired'] } },
      }),
      this.prisma.subscriptionPlan.findMany({ where: { isActive: true } }),
      this.prisma.tenantSubscription.count({ where: { status: 'past_due' } }),
    ]);

    const avgPlanPrice =
      plans.length > 0
        ? plans.reduce((s, p) => s + p.priceMonthly.toNumber(), 0) / plans.length
        : 0;

    const activeWithPlans = await this.prisma.tenantSubscription.findMany({
      where: { status: 'active' },
      include: { plan: true },
      take: 500,
    });
    const mrr = activeWithPlans.reduce((sum, s) => sum + Number(s.plan.priceMonthly), 0);

    const totalRevenue = paidInvoices.reduce(
      (sum, i) =>
        sum + i.amount.toNumber() + i.gstAmount.toNumber() - Number(i.discountAmount ?? 0),
      0,
    );

    const denom = activeSubs + cancelledSubs;
    const churnRate = denom > 0 ? cancelledSubs / denom : 0;

    return {
      mrr: mrr || activeSubs * avgPlanPrice,
      arr: (mrr || activeSubs * avgPlanPrice) * 12,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      activeSubscriptions: activeSubs,
      pastDueSubscriptions: pastDue,
      cancelledSubscriptions: cancelledSubs,
      paidInvoiceCount: paidInvoices.length,
      churnRate: Math.round(churnRate * 1000) / 1000,
    };
  }
}
