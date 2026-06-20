import { NestFactory } from '@nestjs/core';
import { configureNestApp } from '@eduai/nest-common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configureNestApp(app, {
    serviceName: 'identity-service',
    swagger: {
      title: 'EduAI Identity Service',
      description: 'Authentication and user management API',
    },
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`Identity service running on http://localhost:${port}`);
  if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_SWAGGER === 'true') {
    console.log(`OpenAPI docs at http://localhost:${port}/api/docs`);
  }
}

bootstrap();
