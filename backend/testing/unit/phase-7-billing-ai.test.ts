import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UnauthorizedException, HttpException } from '@nestjs/common';
import { createHmac } from 'node:crypto';
import { WebhooksService } from '../../services/billing-service/src/webhooks/webhooks.service';
import { InvoicesService } from '../../services/billing-service/src/invoices/invoices.service';
import { CostService } from '../../services/ai-service/src/cost/cost.service';
import { classifyIntent } from '../../shared/ai/src/intent/classifier';
import { estimateCostUsd } from '../../shared/ai/src/pricing';
import { AiRouter } from '../../shared/ai/src/router';

describe('Phase 7 AI + Billing', () => {
  describe('intent → tier routing', () => {
    it('classifies explain prompts as premium', () => {
      expect(classifyIntent('Explain step by step how gravity works').tier).toBe('premium');
    });

    it('classifies greetings as cheap', () => {
      expect(classifyIntent('Hello').tier).toBe('cheap');
    });

    it('refuses mock in production without AI_ALLOW_MOCK', () => {
      const prev = process.env.AI_ALLOW_MOCK;
      delete process.env.AI_ALLOW_MOCK;
      const router = new AiRouter({ nodeEnv: 'production' });
      expect(router.getActiveProviders()).toEqual([]);
      if (prev !== undefined) process.env.AI_ALLOW_MOCK = prev;
    });

    it('estimates model cost', () => {
      expect(estimateCostUsd('gpt-4o-mini', 1_000_000)).toBe(0.3);
    });
  });

  describe('CostService quota upsell', () => {
    const prisma = {
      aiQuotaUsage: { findUnique: vi.fn() },
      tenant: { findUnique: vi.fn() },
      tenantSubscription: { findFirst: vi.fn() },
    };
    const service = new CostService(prisma as never);

    beforeEach(() => {
      vi.clearAllMocks();
      prisma.tenantSubscription.findFirst.mockResolvedValue(null);
      prisma.tenant.findUnique.mockResolvedValue({
        aiMonthlyTokenBudget: 3_000_000,
        subscriptionTier: 'starter',
      });
    });

    it('allows within budget', async () => {
      prisma.aiQuotaUsage.findUnique.mockResolvedValue({ tokensUsed: 100 });
      await expect(service.checkQuota('t1', 'u1', 500)).resolves.toMatchObject({ allowed: true });
    });

    it('returns 429 with upsell details when exceeded', async () => {
      prisma.aiQuotaUsage.findUnique.mockResolvedValue({ tokensUsed: 99_000 });
      try {
        await service.checkQuota('t1', 'u1', 2000);
        expect.fail('should throw');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        const http = error as HttpException;
        expect(http.getStatus()).toBe(429);
        expect(http.getResponse()).toEqual(
          expect.objectContaining({
            code: 'AI_QUOTA_EXCEEDED',
            details: expect.objectContaining({ action: 'upsell', queueSuggested: true }),
          }),
        );
      }
    });
  });

  describe('InvoicesService proration', () => {
    const service = new InvoicesService(
      { billingInvoice: { findMany: vi.fn(), create: vi.fn() } } as never,
      { applyCoupon: vi.fn(), validateCoupon: vi.fn() } as never,
    );

    it('calculates GST and mid-cycle proration', () => {
      expect(service.calculateGst(10000)).toBe(1800);
      const start = new Date('2026-01-01T00:00:00Z');
      const end = new Date('2026-01-31T00:00:00Z');
      const mid = new Date('2026-01-16T00:00:00Z');
      const prorate = service.calculateProration(1000, 2000, start, end, mid);
      expect(prorate).toBeGreaterThan(400);
      expect(prorate).toBeLessThan(600);
    });
  });

  describe('WebhooksService signature + idempotency', () => {
    const prisma = {
      billingWebhookEvent: { create: vi.fn(), updateMany: vi.fn() },
      billingInvoice: { findFirst: vi.fn(), update: vi.fn() },
      tenantSubscription: { findFirst: vi.fn(), update: vi.fn(), updateMany: vi.fn() },
    };
    const configMap: Record<string, string | undefined> = {};
    const config = { get: vi.fn((key: string) => configMap[key]) };
    let service: WebhooksService;

    beforeEach(() => {
      vi.clearAllMocks();
      Object.keys(configMap).forEach((k) => delete configMap[k]);
      configMap.NODE_ENV = 'production';
      prisma.billingWebhookEvent.create.mockResolvedValue({ id: 'evt1' });
      service = new WebhooksService(prisma as never, config as never);
    });

    it('rejects Razorpay without secret outside development', async () => {
      await expect(
        service.handleRazorpayWebhook('{}', { event: 'payment.captured' }, ''),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('accepts valid Razorpay HMAC and marks invoice paid', async () => {
      configMap.NODE_ENV = 'staging';
      configMap.RAZORPAY_WEBHOOK_SECRET = 'whsec_test';
      const rawBody = JSON.stringify({
        event: 'payment.captured',
        payload: { payment: { entity: { id: 'pay_1', amount: 11800 } } },
      });
      const signature = createHmac('sha256', 'whsec_test').update(rawBody).digest('hex');
      prisma.billingInvoice.findFirst.mockResolvedValue({
        id: 'inv1',
        status: 'issued',
        amount: 100,
        gstAmount: 18,
        discountAmount: 0,
        subscriptionId: null,
      });
      prisma.billingInvoice.update.mockResolvedValue({});

      const result = await service.handleRazorpayWebhook(
        rawBody,
        JSON.parse(rawBody) as Record<string, unknown>,
        signature,
      );
      expect(result.received).toBe(true);
      expect(prisma.billingInvoice.update).toHaveBeenCalled();
    });

    it('idempotently skips duplicate events', async () => {
      configMap.NODE_ENV = 'development';
      prisma.billingWebhookEvent.create.mockRejectedValue({ code: 'P2002' });
      const result = await service.handleRazorpayWebhook(
        '{"event":"payment.captured"}',
        { event: 'payment.captured' },
        '',
      );
      expect(result.duplicate).toBe(true);
    });
  });
});
