import { NestFactory } from '@nestjs/core';
import { configureNestApp } from '@eduai/nest-common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configureNestApp(app, {
    serviceName: 'learning-service',
    swagger: {
      title: 'EduAI Learning Service',
      description: 'Courses, progress, quizzes, gamification, and parent reporting API',
    },
  });

  const port = process.env.PORT ?? 3003;
  await app.listen(port);
  console.log(`Learning service running on http://localhost:${port}`);
}

bootstrap();
