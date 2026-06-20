import { NestFactory } from '@nestjs/core';
import { configureNestApp } from '@eduai/nest-common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configureNestApp(app, {
    serviceName: 'erp-service',
    swagger: {
      title: 'EduAI ERP Service',
      description: 'School ERP — attendance, classes, fees, exams, timetable, assignments',
    },
  });

  const port = process.env.PORT ?? 3005;
  await app.listen(port);
  console.log(`ERP service running on http://localhost:${port}`);
}

bootstrap();
