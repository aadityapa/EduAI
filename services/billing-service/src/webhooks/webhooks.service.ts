import {
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async handleStripeWebhook(
    rawBody: string,
    payload: Record<string, unknown>,
    signature: string,
  ) {
    const secret = this.config.get<string>('STRIPE_WEBHOOK_SECRET');
    const isProd = this.config.get<string>('NODE_ENV') === 'production';

    if (!secret) {
      if (isProd) {
        throw new UnauthorizedException('Stripe webhook secret not configured');
      }
      this.logger.warn('Stripe webhook secret not configured — accepting in dev mode');
    } else {
      if (!signature) {
        throw new UnauthorizedException('Missing stripe-signature header');
      }
      const stripeKey = this.config.get<string>('STRIPE_SECRET_KEY') ?? '';
      const stripe = new Stripe(stripeKey, { apiVersion: '2024-11-20.acacia' });
      try {
        stripe.webhooks.constructEvent(rawBody, signature, secret);
      } catch {
        throw new UnauthorizedException('Invalid Stripe webhook signature');
      }
    }

    const eventType = payload.type as string;
    this.logger.log(`Stripe webhook: ${eventType}`);

    if (eventType === 'invoice.paid') {
      const data = payload.data as {
        object?: { id?: string; amount_paid?: number };
      };
      await this.markInvoicePaid('stripe', data.object?.id, data.object?.amount_paid);
    }

    return { received: true, provider: 'stripe', eventType };
  }

  async handleRazorpayWebhook(
    rawBody: string,
    payload: Record<string, unknown>,
    signature: string,
  ) {
    const secret = this.config.get<string>('RAZORPAY_WEBHOOK_SECRET');
    const isProd = this.config.get<string>('NODE_ENV') === 'production';

    if (!secret) {
      if (isProd) {
        throw new UnauthorizedException('Razorpay webhook secret not configured');
      }
      this.logger.warn('Razorpay webhook secret not configured — accepting in dev mode');
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

    const event = payload.event as string;
    this.logger.log(`Razorpay webhook: ${event}`);

    if (event === 'payment.captured') {
      const payment = payload.payload as {
        payment?: { entity?: { id?: string; amount?: number } };
      };
      const amount = payment.payment?.entity?.amount
        ? payment.payment.entity.amount / 100
        : undefined;
      await this.markInvoicePaid('razorpay', payment.payment?.entity?.id, amount);
    }

    return { received: true, provider: 'razorpay', event };
  }

  private async markInvoicePaid(
    provider: 'stripe' | 'razorpay',
    externalId?: string,
    amountPaid?: number,
  ) {
    if (!externalId) return;

    const invoice = await this.prisma.billingInvoice.findFirst({
      where: { externalId },
    });
    if (!invoice) {
      this.logger.warn(`No invoice found for externalId=${externalId}`);
      return;
    }
    if (invoice.status === 'paid') {
      this.logger.log(`Invoice ${invoice.id} already paid — idempotent skip`);
      return;
    }
    if (amountPaid != null) {
      const expected = Number(invoice.amount) + Number(invoice.gstAmount);
      if (Math.abs(expected - amountPaid) > 0.01) {
        this.logger.error(
          `Amount mismatch for invoice ${invoice.id}: expected ${expected}, got ${amountPaid}`,
        );
        return;
      }
    }

    await this.prisma.billingInvoice.update({
      where: { id: invoice.id },
      data: { status: 'paid', paidAt: new Date(), provider },
    });
  }
}
