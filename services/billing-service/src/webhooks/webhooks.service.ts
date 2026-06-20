import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async handleStripeWebhook(payload: Record<string, unknown>, signature: string) {
    const secret = this.config.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!secret) {
      this.logger.warn('Stripe webhook secret not configured — accepting in dev mode');
    }

    const eventType = payload.type as string;
    this.logger.log(`Stripe webhook: ${eventType}`);

    if (eventType === 'invoice.paid') {
      const data = payload.data as { object?: { id?: string; subscription?: string } };
      await this.markInvoicePaid('stripe', data.object?.id);
    }

    return { received: true, provider: 'stripe', eventType };
  }

  async handleRazorpayWebhook(payload: Record<string, unknown>) {
    const event = payload.event as string;
    this.logger.log(`Razorpay webhook: ${event}`);

    if (event === 'payment.captured') {
      const payment = payload.payload as { payment?: { entity?: { id?: string } } };
      await this.markInvoicePaid('razorpay', payment.payment?.entity?.id);
    }

    return { received: true, provider: 'razorpay', event: event };
  }

  private async markInvoicePaid(provider: 'stripe' | 'razorpay', externalId?: string) {
    if (!externalId) return;
    await this.prisma.billingInvoice.updateMany({
      where: { externalId },
      data: { status: 'paid', paidAt: new Date(), provider },
    });
  }
}
