import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AllExceptionsFilter } from '../filters/all-exceptions.filter.js';

export interface SwaggerConfig {
  title: string;
  description: string;
}

export interface ConfigureAppOptions {
  serviceName: string;
  swagger?: SwaggerConfig;
  disableSwaggerInProd?: boolean;
}

export function configureNestApp(app: INestApplication, options: ConfigureAppOptions) {
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
  app.useGlobalFilters(new AllExceptionsFilter());

  const isProd = process.env.NODE_ENV === 'production';
  const swaggerDisabled =
    options.disableSwaggerInProd !== false && isProd && process.env.ENABLE_SWAGGER !== 'true';

  if (options.swagger && !swaggerDisabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(options.swagger.title)
      .setDescription(options.swagger.description)
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }
}
