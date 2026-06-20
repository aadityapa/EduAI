import { NestFactory } from '@nestjs/core';
import { configureNestApp } from '@eduai/nest-common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configureNestApp(app, {
    serviceName: 'billing-service',
    swagger: {
      title: 'EduAI Billing Service',
      description: 'Subscriptions, invoices, Stripe/Razorpay webhooks, coupons',
    },
  });

  const port = process.env.PORT ?? 3006;
  await app.listen(port);
  console.log(`Billing service running on http://localhost:${port}`);
}

bootstrap();
