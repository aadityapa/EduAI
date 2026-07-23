import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InvoicesService } from '../invoices/invoices.service';
import type { UserContext } from '../common/decorators';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly invoicesService: InvoicesService,
  ) {}

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

    const sub = await this.prisma.tenantSubscription.create({
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

    await this.prisma.auditLog.create({
      data: {
        tenantId: user.tenantId,
        actorId: user.sub,
        action: 'billing:manage:tenant',
        resourceType: 'tenant_subscription',
        resourceId: sub.id,
        metadata: { planCode, trialDays, action: 'start_trial' },
      },
    });

    return sub;
  }

  async renewSubscription(user: UserContext, couponCode?: string) {
    const sub = await this.getTenantSubscription(user);
    const now = new Date();
    const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const invoice = await this.invoicesService.generateSubscriptionInvoice({
      tenantId: user.tenantId,
      subscriptionId: sub.id,
      planId: sub.planId,
      actorId: user.sub,
      couponCode: couponCode ?? sub.couponCode ?? undefined,
      billingPeriodStart: now,
      billingPeriodEnd: periodEnd,
    });

    const updated = await this.prisma.tenantSubscription.update({
      where: { id: sub.id },
      data: {
        status: 'active',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
        dunningAttempts: 0,
        lastDunningAt: null,
        ...(couponCode ? { couponCode: couponCode.toUpperCase() } : {}),
      },
      include: { plan: true },
    });

    await this.prisma.auditLog.create({
      data: {
        tenantId: user.tenantId,
        actorId: user.sub,
        action: 'billing:manage:tenant',
        resourceType: 'tenant_subscription',
        resourceId: updated.id,
        metadata: { action: 'renew', invoiceId: invoice.id },
      },
    });

    return { subscription: updated, invoice };
  }

  async cancelSubscription(user: UserContext, immediate = false) {
    const sub = await this.getTenantSubscription(user);
    const updated = await this.prisma.tenantSubscription.update({
      where: { id: sub.id },
      data: immediate
        ? { status: 'cancelled', cancelAtPeriodEnd: false }
        : { cancelAtPeriodEnd: true },
      include: { plan: true },
    });

    await this.prisma.auditLog.create({
      data: {
        tenantId: user.tenantId,
        actorId: user.sub,
        action: 'billing:manage:tenant',
        resourceType: 'tenant_subscription',
        resourceId: updated.id,
        metadata: { action: immediate ? 'cancel_immediate' : 'cancel_at_period_end' },
      },
    });

    return updated;
  }

  /**
   * Change plan with server-side proration. Client never supplies amounts.
   */
  async changePlan(user: UserContext, newPlanCode: string, couponCode?: string) {
    const sub = await this.getTenantSubscription(user);
    const newPlan = await this.prisma.subscriptionPlan.findUnique({
      where: { code: newPlanCode },
    });
    if (!newPlan || !newPlan.isActive) throw new NotFoundException('Plan not found');
    if (newPlan.id === sub.planId) throw new BadRequestException('Already on this plan');

    const oldPrice = Number(sub.plan.priceMonthly);
    const newPrice = Number(newPlan.priceMonthly);
    const proration = this.invoicesService.calculateProration(
      oldPrice,
      newPrice,
      sub.currentPeriodStart,
      sub.currentPeriodEnd,
      new Date(),
    );

    const invoice =
      Math.abs(proration) > 0.01
        ? await this.invoicesService.generateProrationInvoice({
            tenantId: user.tenantId,
            subscriptionId: sub.id,
            actorId: user.sub,
            prorationAmount: proration,
            couponCode,
            metadata: {
              fromPlan: sub.plan.code,
              toPlan: newPlan.code,
              oldPrice,
              newPrice,
            },
          })
        : null;

    const updated = await this.prisma.tenantSubscription.update({
      where: { id: sub.id },
      data: {
        planId: newPlan.id,
        ...(couponCode ? { couponCode: couponCode.toUpperCase() } : {}),
      },
      include: { plan: true },
    });

    // Sync tenant AI budget from plan
    await this.prisma.tenant.update({
      where: { id: user.tenantId },
      data: {
        aiMonthlyTokenBudget: newPlan.aiTokenBudget,
        maxStudents: newPlan.maxStudents,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        tenantId: user.tenantId,
        actorId: user.sub,
        action: 'billing:manage:tenant',
        resourceType: 'tenant_subscription',
        resourceId: updated.id,
        metadata: {
          action: 'change_plan',
          fromPlan: sub.plan.code,
          toPlan: newPlan.code,
          proration,
          invoiceId: invoice?.id,
        },
      },
    });

    return { subscription: updated, proration, invoice };
  }

  /**
   * Usage billing — rate is server-side; client only reports token count.
   */
  async recordUsageBilling(user: UserContext, tokensUsed: number) {
    if (!Number.isFinite(tokensUsed) || tokensUsed < 0) {
      throw new BadRequestException('Invalid tokensUsed');
    }

    const ratePer1k = Number(process.env.AI_USAGE_RATE_PER_1K ?? '0.5');
    const amount = Math.round((tokensUsed / 1000) * ratePer1k * 100) / 100;
    const gst = this.invoicesService.calculateGst(amount);
    const invoiceNumber = `USAGE-${Date.now()}`;

    const invoice = await this.prisma.billingInvoice.create({
      data: {
        tenantId: user.tenantId,
        invoiceNumber,
        amount,
        gstAmount: gst,
        discountAmount: 0,
        status: 'issued',
        provider: 'manual',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        metadata: { tokensUsed, ratePer1k, type: 'usage' },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        tenantId: user.tenantId,
        actorId: user.sub,
        action: 'billing:manage:tenant',
        resourceType: 'billing_invoice',
        resourceId: invoice.id,
        metadata: { tokensUsed, amount, action: 'usage_billing' },
      },
    });

    return invoice;
  }

  /** Dunning sweep: past_due / overdue invoices → increment attempts, expire after max. */
  async processDunning(maxAttempts = 3) {
    const pastDue = await this.prisma.tenantSubscription.findMany({
      where: { status: 'past_due' },
      take: 100,
    });

    const results: Array<{ id: string; attempts: number; status: string }> = [];

    for (const sub of pastDue) {
      const attempts = sub.dunningAttempts + 1;
      const expired = attempts >= maxAttempts;
      const updated = await this.prisma.tenantSubscription.update({
        where: { id: sub.id },
        data: {
          dunningAttempts: attempts,
          lastDunningAt: new Date(),
          ...(expired ? { status: 'expired' } : {}),
        },
      });

      await this.prisma.billingInvoice.updateMany({
        where: {
          subscriptionId: sub.id,
          status: { in: ['issued', 'partial'] },
          dueDate: { lt: new Date() },
        },
        data: { status: 'overdue' },
      });

      results.push({ id: updated.id, attempts, status: updated.status });
    }

    return { processed: results.length, results };
  }
}
