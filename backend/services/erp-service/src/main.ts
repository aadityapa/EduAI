import { NestFactory } from '@nestjs/core';
import { configureNestApp, initObservability } from '@eduai/nest-common';
import { AppModule } from './app.module';

async function bootstrap() {
  await initObservability({ serviceName: 'erp-service' });
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? 3005);

  configureNestApp(app, {
    serviceName: 'erp-service',
    port,
    swagger: {
      title: 'EduAI ERP Service',
      description: 'Attendance, timetable, fees, exams, assignments, notifications',
      tags: [
        { name: 'attendance', description: 'Class / student attendance' },
        { name: 'classes', description: 'Class roster' },
        { name: 'timetable', description: 'School timetable' },
        { name: 'fees', description: 'Fee invoices' },
        { name: 'exams', description: 'Exams' },
        { name: 'assignments', description: 'Teacher assignments' },
        { name: 'teacher', description: 'Teacher dashboard helpers' },
        { name: 'parent-erp', description: 'Parent ERP views' },
        { name: 'notifications', description: 'In-app notifications' },
        { name: 'schools', description: 'School directory' },
        { name: 'analytics', description: 'ERP KPIs' },
        { name: 'health', description: 'Liveness / readiness' },
      ],
    },
  });

  await app.listen(port);
  console.log(`ERP service running on http://localhost:${port}`);
  if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_SWAGGER === 'true') {
    console.log(`OpenAPI docs at http://localhost:${port}/api/docs`);
  }
}

bootstrap();
