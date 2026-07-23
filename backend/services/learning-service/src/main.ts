import { NestFactory } from '@nestjs/core';
import { configureNestApp, initObservability } from '@eduai/nest-common';
import { AppModule } from './app.module';

async function bootstrap() {
  await initObservability({ serviceName: 'learning-service' });
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? 3003);

  configureNestApp(app, {
    serviceName: 'learning-service',
    port,
    swagger: {
      title: 'EduAI Learning Service',
      description: 'Courses, lessons, progress, quizzes, gamification, parent links',
      tags: [
        { name: 'courses', description: 'Curriculum catalog' },
        { name: 'enrollments', description: 'Student enrollments' },
        { name: 'progress', description: 'Lesson progress' },
        { name: 'quizzes', description: 'Assessments' },
        { name: 'gamification', description: 'XP, streaks, leaderboard' },
        { name: 'hub', description: 'Student learning hub' },
        { name: 'parent', description: 'Parent–child linking and reports' },
        { name: 'health', description: 'Liveness / readiness' },
      ],
    },
  });

  await app.listen(port);
  console.log(`Learning service running on http://localhost:${port}`);
  if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_SWAGGER === 'true') {
    console.log(`OpenAPI docs at http://localhost:${port}/api/docs`);
  }
}

bootstrap();
