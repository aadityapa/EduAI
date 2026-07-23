import { NestFactory } from '@nestjs/core';
import { configureNestApp, initObservability } from '@eduai/nest-common';
import { AppModule } from './app.module';

async function bootstrap() {
  await initObservability({ serviceName: 'ai-service' });
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? 3004);

  configureNestApp(app, {
    serviceName: 'ai-service',
    port,
    swagger: {
      title: 'EduAI AI Service',
      description: 'Tutor, homework assist, planner, QPG / mock tests (metering deep work in Phase 7)',
      tags: [
        { name: 'tutor', description: 'AI tutor chat' },
        { name: 'homework', description: 'Homework analysis' },
        { name: 'planner', description: 'Study planner' },
        { name: 'generators', description: 'Question paper / mock test generation' },
        { name: 'conversations', description: 'Conversation history' },
        { name: 'analytics', description: 'AI usage analytics' },
        { name: 'health', description: 'Liveness / readiness' },
      ],
    },
  });

  await app.listen(port);
  console.log(`AI service running on http://localhost:${port}`);
  if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_SWAGGER === 'true') {
    console.log(`OpenAPI docs at http://localhost:${port}/api/docs`);
  }
}

bootstrap();
