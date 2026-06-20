import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { UserContext } from '../common/decorators';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTenantSubscription(user: UserContext) {
    const sub = await this.prisma.tenantSubscription.findFirst({
      where: { tenantId: user.tenantId },
      include: { plan: true },
      orderBy: { createdAt: 'desc' },
    });
    if (!sub) throw new NotFoundException('No subscription found');
    return sub;
  }

  async listAllSubscriptions(user: UserContext) {
    const isGlobal = user.permissions.includes('tenants:manage:global');
    return this.prisma.tenantSubscription.findMany({
      where: isGlobal ? undefined : { tenantId: user.tenantId },
      include: {
        plan: true,
        tenant: { select: { id: true, slug: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async startTrial(user: UserContext, planCode: string, trialDays = 14) {
    const plan = await this.prisma.subscriptionPlan.findUnique({ where: { code: planCode } });
    if (!plan) throw new NotFoundException('Plan not found');

    const now = new Date();
    const periodEnd = new Date(now.getTime() + trialDays * 24 * 60 * 60 * 1000);

    return this.prisma.tenantSubscription.create({
      data: {
        tenantId: user.tenantId,
        planId: plan.id,
        status: 'trialing',
        provider: 'manual',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
      },
      include: { plan: true },
    });
  }

  async renewSubscription(user: UserContext) {
    const sub = await this.getTenantSubscription(user);
    const now = new Date();
    const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return this.prisma.tenantSubscription.update({
      where: { id: sub.id },
      data: {
        status: 'active',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
      },
      include: { plan: true },
    });
  }

  async recordUsageBilling(user: UserContext, tokensUsed: number, ratePer1k = 0.5) {
    const amount = Math.round((tokensUsed / 1000) * ratePer1k * 100) / 100;
    const gst = Math.round(amount * 0.18 * 100) / 100;
    const invoiceNumber = `USAGE-${Date.now()}`;

    return this.prisma.billingInvoice.create({
      data: {
        tenantId: user.tenantId,
        invoiceNumber,
        amount,
        gstAmount: gst,
        status: 'issued',
        provider: 'manual',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }
}
