import { NestFactory } from '@nestjs/core';
import { configureNestApp, initObservability } from '@eduai/nest-common';
import { AppModule } from './app.module';

async function bootstrap() {
  await initObservability({ serviceName: 'billing-service' });
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? 3006);

  configureNestApp(app, {
    serviceName: 'billing-service',
    port,
    swagger: {
      title: 'EduAI Billing Service',
      description: 'Plans, subscriptions, invoices, coupons, webhooks, branding, CRM',
      tags: [
        { name: 'plans', description: 'Subscription plans catalog' },
        { name: 'subscriptions', description: 'Tenant subscriptions and trials' },
        { name: 'invoices', description: 'Billing invoices' },
        { name: 'coupons', description: 'Coupon management' },
        { name: 'webhooks', description: 'Stripe / Razorpay webhooks' },
        { name: 'branding', description: 'Tenant white-label branding' },
        { name: 'crm', description: 'CRM leads / tickets / audit' },
        { name: 'analytics', description: 'Revenue analytics' },
        { name: 'health', description: 'Liveness / readiness' },
      ],
    },
  });

  await app.listen(port);
  console.log(`Billing service running on http://localhost:${port}`);
  if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_SWAGGER === 'true') {
    console.log(`OpenAPI docs at http://localhost:${port}/api/docs`);
  }
}

bootstrap();
