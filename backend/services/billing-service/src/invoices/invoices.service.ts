import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@eduai/database';
import { PrismaService } from '../prisma/prisma.service';
import { CouponsService } from '../coupons/coupons.service';
import type { UserContext } from '../common/decorators';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly couponsService: CouponsService,
  ) {}

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

  /**
   * Proration credit/charge for mid-cycle plan changes.
   * Positive = customer owes more; negative = credit.
   */
  calculateProration(
    oldMonthlyPrice: number,
    newMonthlyPrice: number,
    periodStart: Date,
    periodEnd: Date,
    now = new Date(),
  ): number {
    const totalMs = periodEnd.getTime() - periodStart.getTime();
    if (totalMs <= 0) return 0;
    const remainingMs = Math.max(0, periodEnd.getTime() - now.getTime());
    const fraction = Math.min(1, remainingMs / totalMs);
    return Math.round((newMonthlyPrice - oldMonthlyPrice) * fraction * 100) / 100;
  }

  async generateSubscriptionInvoice(params: {
    tenantId: string;
    subscriptionId: string;
    planId: string;
    actorId: string;
    couponCode?: string;
    billingPeriodStart: Date;
    billingPeriodEnd: Date;
    provider?: 'stripe' | 'razorpay' | 'manual';
    externalId?: string;
  }) {
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: params.planId },
    });
    if (!plan) throw new BadRequestException('Plan not found');

    // Server-authoritative amount — never accept client price
    let amount = Number(plan.priceMonthly);
    let discountAmount = 0;
    let appliedCoupon: string | undefined;

    if (params.couponCode) {
      const coupon = await this.couponsService.applyCoupon(
        params.couponCode,
        amount,
        params.tenantId,
      );
      discountAmount = coupon.discountAmount;
      amount = coupon.finalAmount;
      appliedCoupon = coupon.code;
    }

    const gstAmount = this.calculateGst(amount);
    const invoiceNumber = `INV-${Date.now()}`;

    const invoice = await this.prisma.billingInvoice.create({
      data: {
        tenantId: params.tenantId,
        subscriptionId: params.subscriptionId,
        invoiceNumber,
        amount,
        gstAmount,
        discountAmount,
        couponCode: appliedCoupon,
        status: 'issued',
        provider: params.provider ?? 'manual',
        externalId: params.externalId,
        dueDate: params.billingPeriodEnd,
        metadata: {
          type: 'subscription',
          planCode: plan.code,
          periodStart: params.billingPeriodStart.toISOString(),
          periodEnd: params.billingPeriodEnd.toISOString(),
          listPrice: Number(plan.priceMonthly),
        } as Prisma.InputJsonValue,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        tenantId: params.tenantId,
        actorId: params.actorId,
        action: 'billing:manage:tenant',
        resourceType: 'billing_invoice',
        resourceId: invoice.id,
        metadata: {
          action: 'generate_invoice',
          amount,
          gstAmount,
          discountAmount,
          couponCode: appliedCoupon,
        },
      },
    });

    return invoice;
  }

  async generateProrationInvoice(params: {
    tenantId: string;
    subscriptionId: string;
    actorId: string;
    prorationAmount: number;
    couponCode?: string;
    metadata?: Record<string, unknown>;
  }) {
    let amount = Math.max(0, params.prorationAmount);
    let discountAmount = 0;
    let appliedCoupon: string | undefined;

    // Credits (negative proration) become zero-amount issued notes; upgrades bill the delta
    if (params.prorationAmount < 0) {
      amount = 0;
      discountAmount = Math.abs(params.prorationAmount);
    } else if (params.couponCode && amount > 0) {
      const coupon = await this.couponsService.applyCoupon(
        params.couponCode,
        amount,
        params.tenantId,
      );
      discountAmount = coupon.discountAmount;
      amount = coupon.finalAmount;
      appliedCoupon = coupon.code;
    }

    const gstAmount = this.calculateGst(amount);
    const invoiceNumber = `PRORATE-${Date.now()}`;

    return this.prisma.billingInvoice.create({
      data: {
        tenantId: params.tenantId,
        subscriptionId: params.subscriptionId,
        invoiceNumber,
        amount,
        gstAmount,
        discountAmount,
        couponCode: appliedCoupon,
        status: amount === 0 ? 'paid' : 'issued',
        paidAt: amount === 0 ? new Date() : undefined,
        provider: 'manual',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        metadata: {
          type: 'proration',
          rawProration: params.prorationAmount,
          ...params.metadata,
        } as Prisma.InputJsonValue,
      },
    });
  }
}
