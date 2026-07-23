import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AllExceptionsFilter } from '../filters/all-exceptions.filter.js';
import { IdempotencyInterceptor } from '../interceptors/idempotency.interceptor.js';
import {
  TraceIdMiddleware,
  type RequestWithTrace,
} from '../middleware/trace-id.middleware.js';
import { createHttpMetricsMiddleware } from '../observability/http-metrics.middleware.js';
import { createMetricsEndpoint } from '../observability/metrics-endpoint.js';
import { getStructuredLogger } from '../observability/structured-logger.js';
import { loadFeatureFlags } from '../feature-flags/feature-flags.js';
import type { NextFunction, Response } from 'express';

export interface SwaggerConfig {
  title: string;
  description: string;
  /** Extra OpenAPI tags (name + description) */
  tags?: Array<{ name: string; description: string }>;
}

export interface ConfigureAppOptions {
  serviceName: string;
  swagger?: SwaggerConfig;
  disableSwaggerInProd?: boolean;
  /** Port advertised in OpenAPI servers (docs only) */
  port?: number;
  /** When false, skip Prometheus /metrics endpoint (default true) */
  enableMetrics?: boolean;
}

function collectCorsOrigins(): string[] {
  const webUrl = process.env.NEXT_PUBLIC_WEB_URL ?? 'http://localhost:3000';
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL ?? 'http://localhost:3002';
  const lanHost = process.env.DEV_LAN_HOST;
  const extra = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const corsOrigins = new Set([
    webUrl,
    adminUrl,
    'http://localhost:3000',
    'http://localhost:3002',
    ...extra,
    ...(lanHost ? [`http://${lanHost}:3000`, `http://${lanHost}:3002`] : []),
  ]);
  return [...corsOrigins];
}

export function configureNestApp(app: INestApplication, options: ConfigureAppOptions) {
  const isProd = process.env.NODE_ENV === 'production';
  const log = getStructuredLogger(options.serviceName);
  loadFeatureFlags();

  // Graceful shutdown for K8s SIGTERM (pairs with readiness/liveness probes)
  app.enableShutdownHooks();

  if (options.enableMetrics !== false) {
    app.use(createMetricsEndpoint(options.serviceName));
  }

  app.use(
    helmet({
      contentSecurityPolicy: isProd
        ? {
            useDefaults: true,
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              imgSrc: ["'self'", 'data:', 'https:'],
              connectSrc: ["'self'"],
              frameAncestors: ["'none'"],
            },
          }
        : false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      referrerPolicy: { policy: 'no-referrer' },
      hsts: isProd ? { maxAge: 15552000, includeSubDomains: true } : false,
    }),
  );

  app.enableCors({
    origin: collectCorsOrigins(),
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Tenant-Id',
      'X-Request-Id',
      'X-Trace-Id',
      'traceparent',
      'tracestate',
      'Idempotency-Key',
      'X-Internal-Api-Key',
      'stripe-signature',
      'x-razorpay-signature',
    ],
    exposedHeaders: [
      'X-Request-Id',
      'X-Trace-Id',
      'traceparent',
      'Idempotency-Replayed',
      'Retry-After',
    ],
    maxAge: 86400,
  });

  const trace = new TraceIdMiddleware();
  app.use((req: RequestWithTrace, res: Response, next: NextFunction) =>
    trace.use(req, res, next),
  );

  if (options.enableMetrics !== false) {
    app.use(createHttpMetricsMiddleware(options.serviceName));
  }

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      validateCustomDecorators: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter(options.serviceName));
  app.useGlobalInterceptors(new IdempotencyInterceptor());
  log.info('Nest app configured', { serviceName: options.serviceName });

  const swaggerDisabled =
    options.disableSwaggerInProd !== false && isProd && process.env.ENABLE_SWAGGER !== 'true';

  if (options.swagger && !swaggerDisabled) {
    const port = options.port ?? Number(process.env.PORT) ?? 3000;
    const builder = new DocumentBuilder()
      .setTitle(options.swagger.title)
      .setDescription(
        [
          options.swagger.description,
          '',
          '## Conventions',
          '- Base path: `/api/v1`',
          '- Success: `{ data, meta: { request_id, timestamp, pagination? } }`',
          '- Errors: `{ code, message, details?, traceId, error: { … } }`',
          '- Mutating calls may send `Idempotency-Key` (≤128 chars)',
          '- Auth: Bearer JWT (15m access) + rotating refresh via identity `/auth/refresh`',
        ].join('\n'),
      )
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
        'bearer',
      )
      .addApiKey(
        { type: 'apiKey', name: 'Idempotency-Key', in: 'header' },
        'idempotency',
      )
      .addApiKey({ type: 'apiKey', name: 'X-Tenant-Id', in: 'header' }, 'tenant')
      .addServer(`http://localhost:${port}`, 'Local')
      .addServer(`http://localhost:${port}/api/v1`, 'Local (with prefix note — use paths without double prefix)');

    for (const tag of options.swagger.tags ?? []) {
      builder.addTag(tag.name, tag.description);
    }

    const swaggerConfig = builder.build();
    const document = SwaggerModule.createDocument(app, swaggerConfig, {
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        `${controllerKey.replace(/Controller$/, '')}_${methodKey}`,
    });
    SwaggerModule.setup('api/docs', app, document, {
      jsonDocumentUrl: 'api/docs-json',
      yamlDocumentUrl: 'api/docs-yaml',
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });
  }
}
