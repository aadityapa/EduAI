import { NestFactory } from '@nestjs/core';
import { configureNestApp } from '@eduai/nest-common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configureNestApp(app, {
    serviceName: 'ai-service',
    swagger: {
      title: 'EduAI AI Service',
      description: 'AI tutor, homework, planner, generators, and usage analytics API',
    },
  });

  const port = process.env.PORT ?? 3004;
  await app.listen(port);
  console.log(`AI service running on http://localhost:${port}`);
}

bootstrap();
