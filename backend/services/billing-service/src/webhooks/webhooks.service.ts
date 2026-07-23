import {
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

type BillingProviderName = 'stripe' | 'razorpay';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  /** Dev/test may accept without secret; staging/production/any other env must verify. */
  private isDevLikeEnv(): boolean {
    const env = (this.config.get<string>('NODE_ENV') ?? 'development').toLowerCase();
    return env === 'development' || env === 'test';
  }

  private hashPayload(rawBody: string): string {
    return crypto.createHash('sha256').update(rawBody).digest('hex');
  }

  /**
   * Idempotent event intake. Returns false if already processed.
   */
  private async claimWebhookEvent(
    provider: BillingProviderName,
    eventId: string,
    eventType: string,
    rawBody: string,
    tenantId?: string,
  ): Promise<boolean> {
    try {
      await this.prisma.billingWebhookEvent.create({
        data: {
          provider,
          eventId,
          eventType,
          payloadHash: this.hashPayload(rawBody),
          status: 'processed',
          ...(tenantId ? { tenantId } : {}),
        },
      });
      return true;
    } catch (error: unknown) {
      const code =
        error && typeof error === 'object' && 'code' in error
          ? String((error as { code: string }).code)
          : '';
      if (code === 'P2002') {
        this.logger.log(`Duplicate ${provider} webhook ${eventId} — idempotent skip`);
        return false;
      }
      throw error;
    }
  }

  async handleStripeWebhook(
    rawBody: string,
    payload: Record<string, unknown>,
    signature: string,
  ) {
    const secret = this.config.get<string>('STRIPE_WEBHOOK_SECRET');
    const requireSig = !this.isDevLikeEnv();

    if (!secret) {
      if (requireSig) {
        throw new UnauthorizedException('Stripe webhook secret not configured');
      }
      this.logger.warn('Stripe webhook secret not configured — accepting in development only');
    } else {
      if (!signature) {
        throw new UnauthorizedException('Missing stripe-signature header');
      }
      const stripeKey = this.config.get<string>('STRIPE_SECRET_KEY') ?? '';
      const stripe = new Stripe(stripeKey || 'sk_test_placeholder', {
        apiVersion: '2025-02-24.acacia',
      });
      try {
        stripe.webhooks.constructEvent(rawBody, signature, secret);
      } catch {
        throw new UnauthorizedException('Invalid Stripe webhook signature');
      }
    }

    const eventType = String(payload.type ?? 'unknown');
    const eventId = String(payload.id ?? `stripe-${this.hashPayload(rawBody).slice(0, 24)}`);
    this.logger.log(`Stripe webhook: ${eventType} (${eventId})`);

    const claimed = await this.claimWebhookEvent('stripe', eventId, eventType, rawBody);
    if (!claimed) {
      return { received: true, provider: 'stripe', eventType, duplicate: true };
    }

    await this.dispatchStripeEvent(eventType, payload);
    return { received: true, provider: 'stripe', eventType, duplicate: false };
  }

  async handleRazorpayWebhook(
    rawBody: string,
    payload: Record<string, unknown>,
    signature: string,
  ) {
    const secret = this.config.get<string>('RAZORPAY_WEBHOOK_SECRET');
    const requireSig = !this.isDevLikeEnv();

    // Close the “accept without secret outside production” gap — staging/prod/preview all require secret
    if (!secret) {
      if (requireSig) {
        throw new UnauthorizedException('Razorpay webhook secret not configured');
      }
      this.logger.warn('Razorpay webhook secret not configured — accepting in development only');
    } else {
      if (!signature) {
        throw new UnauthorizedException('Missing x-razorpay-signature header');
      }
      const expected = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');
      if (expected !== signature) {
        throw new UnauthorizedException('Invalid Razorpay webhook signature');
      }
    }

    const event = String(payload.event ?? 'unknown');
    const eventId = this.extractRazorpayEventId(payload, rawBody);
    this.logger.log(`Razorpay webhook: ${event} (${eventId})`);

    const claimed = await this.claimWebhookEvent('razorpay', eventId, event, rawBody);
    if (!claimed) {
      return { received: true, provider: 'razorpay', event, duplicate: true };
    }

    await this.dispatchRazorpayEvent(event, payload);
    return { received: true, provider: 'razorpay', event, duplicate: false };
  }

  private extractRazorpayEventId(payload: Record<string, unknown>, rawBody: string): string {
    const nested = payload.payload as Record<string, { entity?: { id?: string } }> | undefined;
    const paymentId = nested?.payment?.entity?.id;
    const subscriptionId = nested?.subscription?.entity?.id;
    const invoiceId = nested?.invoice?.entity?.id;
    if (paymentId) return `rzp_pay_${paymentId}_${String(payload.event ?? '')}`;
    if (subscriptionId) return `rzp_sub_${subscriptionId}_${String(payload.event ?? '')}`;
    if (invoiceId) return `rzp_inv_${invoiceId}_${String(payload.event ?? '')}`;
    return `rzp-${this.hashPayload(rawBody).slice(0, 24)}`;
  }

  private async dispatchStripeEvent(eventType: string, payload: Record<string, unknown>) {
    const data = payload.data as { object?: Record<string, unknown> } | undefined;
    const obj = data?.object ?? {};

    switch (eventType) {
      case 'invoice.paid':
      case 'invoice.payment_succeeded':
        await this.markInvoicePaid(
          'stripe',
          typeof obj.id === 'string' ? obj.id : undefined,
          typeof obj.amount_paid === 'number' ? obj.amount_paid / 100 : undefined,
        );
        await this.activateSubscriptionFromExternal(
          'stripe',
          typeof obj.subscription === 'string' ? obj.subscription : undefined,
        );
        break;
      case 'invoice.payment_failed':
        await this.markSubscriptionPastDue(
          'stripe',
          typeof obj.subscription === 'string' ? obj.subscription : undefined,
        );
        break;
      case 'customer.subscription.updated':
        await this.syncSubscriptionStatus(
          'stripe',
          typeof obj.id === 'string' ? obj.id : undefined,
          typeof obj.status === 'string' ? obj.status : undefined,
          Boolean(obj.cancel_at_period_end),
        );
        break;
      case 'customer.subscription.deleted':
        await this.cancelSubscriptionExternal(
          'stripe',
          typeof obj.id === 'string' ? obj.id : undefined,
        );
        break;
      default:
        this.logger.debug(`Unhandled Stripe event ${eventType}`);
    }
  }

  private async dispatchRazorpayEvent(event: string, payload: Record<string, unknown>) {
    const nested = payload.payload as
      | {
          payment?: { entity?: { id?: string; amount?: number; notes?: Record<string, string> } };
          subscription?: { entity?: { id?: string; status?: string } };
          invoice?: { entity?: { id?: string; amount?: number; status?: string } };
        }
      | undefined;

    switch (event) {
      case 'payment.captured':
      case 'invoice.paid': {
        const payment = nested?.payment?.entity;
        const invoice = nested?.invoice?.entity;
        const externalId = invoice?.id ?? payment?.id;
        const amountPaise = invoice?.amount ?? payment?.amount;
        const amount = amountPaise != null ? amountPaise / 100 : undefined;
        await this.markInvoicePaid('razorpay', externalId, amount);
        break;
      }
      case 'subscription.charged':
      case 'subscription.activated':
        await this.activateSubscriptionFromExternal(
          'razorpay',
          nested?.subscription?.entity?.id,
        );
        break;
      case 'subscription.pending':
      case 'subscription.halted':
      case 'payment.failed':
        await this.markSubscriptionPastDue('razorpay', nested?.subscription?.entity?.id);
        break;
      case 'subscription.cancelled':
        await this.cancelSubscriptionExternal('razorpay', nested?.subscription?.entity?.id);
        break;
      default:
        this.logger.debug(`Unhandled Razorpay event ${event}`);
    }
  }

  private async markInvoicePaid(
    provider: BillingProviderName,
    externalId?: string,
    amountPaid?: number,
  ) {
    if (!externalId) return;

    const invoice = await this.prisma.billingInvoice.findFirst({
      where: {
        OR: [{ externalId }, { externalId: externalId.replace(/^inv_/, '') }],
        provider: { in: [provider, 'manual'] },
      },
    });
    if (!invoice) {
      this.logger.warn(`No invoice found for externalId=${externalId}`);
      return;
    }
    if (invoice.status === 'paid') {
      this.logger.log(`Invoice ${invoice.id} already paid — idempotent skip`);
      return;
    }

    // Never trust client-side amounts — reconcile against BillingInvoice server totals
    if (amountPaid != null) {
      const expected =
        Number(invoice.amount) + Number(invoice.gstAmount) - Number(invoice.discountAmount ?? 0);
      if (Math.abs(expected - amountPaid) > 0.05) {
        this.logger.error(
          `Amount mismatch for invoice ${invoice.id}: expected ${expected}, got ${amountPaid} — leaving unpaid`,
        );
        await this.prisma.billingWebhookEvent.updateMany({
          where: { provider, eventId: { contains: externalId } },
          data: { status: 'amount_mismatch' },
        });
        return;
      }
    }

    await this.prisma.billingInvoice.update({
      where: { id: invoice.id },
      data: { status: 'paid', paidAt: new Date(), provider },
    });

    if (invoice.subscriptionId) {
      await this.prisma.tenantSubscription.update({
        where: { id: invoice.subscriptionId },
        data: {
          status: 'active',
          dunningAttempts: 0,
          lastDunningAt: null,
        },
      });
    }
  }

  private async activateSubscriptionFromExternal(
    provider: BillingProviderName,
    externalSubscriptionId?: string,
  ) {
    if (!externalSubscriptionId) return;
    const sub = await this.prisma.tenantSubscription.findFirst({
      where: { externalSubscriptionId, provider },
    });
    if (!sub) return;
    await this.prisma.tenantSubscription.update({
      where: { id: sub.id },
      data: { status: 'active', dunningAttempts: 0, lastDunningAt: null },
    });
  }

  private async markSubscriptionPastDue(
    provider: BillingProviderName,
    externalSubscriptionId?: string,
  ) {
    if (!externalSubscriptionId) return;
    const sub = await this.prisma.tenantSubscription.findFirst({
      where: { externalSubscriptionId, provider },
    });
    if (!sub) return;
    await this.prisma.tenantSubscription.update({
      where: { id: sub.id },
      data: {
        status: 'past_due',
        dunningAttempts: { increment: 1 },
        lastDunningAt: new Date(),
      },
    });
  }

  private async syncSubscriptionStatus(
    provider: BillingProviderName,
    externalSubscriptionId: string | undefined,
    stripeStatus: string | undefined,
    cancelAtPeriodEnd: boolean,
  ) {
    if (!externalSubscriptionId) return;
    const mapped =
      stripeStatus === 'active' || stripeStatus === 'trialing'
        ? (stripeStatus as 'active' | 'trialing')
        : stripeStatus === 'past_due'
          ? 'past_due'
          : stripeStatus === 'canceled' || stripeStatus === 'cancelled'
            ? 'cancelled'
            : undefined;
    if (!mapped) return;

    await this.prisma.tenantSubscription.updateMany({
      where: { externalSubscriptionId, provider },
      data: { status: mapped, cancelAtPeriodEnd },
    });
  }

  private async cancelSubscriptionExternal(
    provider: BillingProviderName,
    externalSubscriptionId?: string,
  ) {
    if (!externalSubscriptionId) return;
    await this.prisma.tenantSubscription.updateMany({
      where: { externalSubscriptionId, provider },
      data: { status: 'cancelled', cancelAtPeriodEnd: false },
    });
  }
}
