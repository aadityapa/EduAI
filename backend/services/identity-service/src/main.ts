import { NestFactory } from '@nestjs/core';
import { configureNestApp, initObservability } from '@eduai/nest-common';
import { AppModule } from './app.module';

async function bootstrap() {
  await initObservability({ serviceName: 'identity-service' });
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? 3001);

  configureNestApp(app, {
    serviceName: 'identity-service',
    port,
    swagger: {
      title: 'EduAI Identity Service',
      description: 'Authentication, users, sessions, and tenant-scoped RBAC',
      tags: [
        { name: 'auth', description: 'Login, refresh, logout, registration' },
        { name: 'users', description: 'Profile and tenant user administration' },
        { name: 'health', description: 'Liveness / readiness' },
      ],
    },
  });

  await app.listen(port);
  console.log(`Identity service running on http://localhost:${port}`);
  if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_SWAGGER === 'true') {
    console.log(`OpenAPI docs at http://localhost:${port}/api/docs`);
  }
}

bootstrap();
