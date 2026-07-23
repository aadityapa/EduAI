import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebhooksService } from './webhooks.service';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

describe('WebhooksService', () => {
  let service: WebhooksService;
  const prisma = {
    billingWebhookEvent: {
      create: jest.fn(),
      updateMany: jest.fn(),
    },
    billingInvoice: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    tenantSubscription: {
      findFirst: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
  };

  const configMap: Record<string, string | undefined> = {
    NODE_ENV: 'production',
    RAZORPAY_WEBHOOK_SECRET: undefined,
    STRIPE_WEBHOOK_SECRET: undefined,
  };

  const config = {
    get: jest.fn((key: string) => configMap[key]),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    configMap.NODE_ENV = 'production';
    configMap.RAZORPAY_WEBHOOK_SECRET = undefined;
    configMap.STRIPE_WEBHOOK_SECRET = undefined;
    prisma.billingWebhookEvent.create.mockResolvedValue({ id: 'evt1' });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhooksService,
        { provide: PrismaService, useValue: prisma },
        { provide: ConfigService, useValue: config },
      ],
    }).compile();
    service = module.get(WebhooksService);
  });

  it('rejects Razorpay webhooks without secret outside development', async () => {
    await expect(
      service.handleRazorpayWebhook('{}', { event: 'payment.captured' }, ''),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('accepts Razorpay in development without secret (warn path)', async () => {
    configMap.NODE_ENV = 'development';
    const result = await service.handleRazorpayWebhook(
      '{"event":"payment.captured"}',
      { event: 'payment.captured', payload: {} },
      '',
    );
    expect(result.received).toBe(true);
    expect(result.duplicate).toBe(false);
  });

  it('rejects invalid Razorpay signature when secret configured', async () => {
    configMap.NODE_ENV = 'staging';
    configMap.RAZORPAY_WEBHOOK_SECRET = 'whsec_test';
    await expect(
      service.handleRazorpayWebhook('{"event":"x"}', { event: 'x' }, 'bad-sig'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('accepts valid Razorpay signature and marks invoice paid', async () => {
    configMap.NODE_ENV = 'staging';
    configMap.RAZORPAY_WEBHOOK_SECRET = 'whsec_test';
    const rawBody = JSON.stringify({
      event: 'payment.captured',
      payload: { payment: { entity: { id: 'pay_1', amount: 11800 } } },
    });
    const signature = crypto
      .createHmac('sha256', 'whsec_test')
      .update(rawBody)
      .digest('hex');

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
    expect(prisma.billingInvoice.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'inv1' },
        data: expect.objectContaining({ status: 'paid' }),
      }),
    );
  });

  it('skips duplicate webhook events idempotently', async () => {
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
