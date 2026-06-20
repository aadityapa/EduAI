import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors({
    origin: [
      process.env.NEXT_PUBLIC_WEB_URL ?? 'http://localhost:3000',
      process.env.NEXT_PUBLIC_ADMIN_URL ?? 'http://localhost:3002',
    ],
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('EduAI ERP Service')
    .setDescription('School ERP — attendance, classes, fees, exams, timetable, assignments')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3005;
  await app.listen(port);
  console.log(`ERP service running on http://localhost:${port}`);
  console.log(`OpenAPI docs at http://localhost:${port}/api/docs`);
}

bootstrap();
