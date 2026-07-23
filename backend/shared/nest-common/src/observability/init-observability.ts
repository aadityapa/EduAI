import { getStructuredLogger } from './structured-logger.js';
import { initOpenTelemetry } from './otel.js';
import { initSentry } from './sentry.js';

export interface InitObservabilityOptions {
  serviceName: string;
}

/**
 * Call **before** `NestFactory.create` in each service `main.ts`.
 * Initializes structured logger context, optional OTel SDK, optional Sentry.
 */
export async function initObservability(options: InitObservabilityOptions): Promise<void> {
  process.env.OTEL_SERVICE_NAME = options.serviceName;
  const log = getStructuredLogger(options.serviceName);
  log.info('Observability bootstrap starting', {
    nodeEnv: process.env.NODE_ENV ?? 'development',
  });

  await initOpenTelemetry({ serviceName: options.serviceName });
  await initSentry({ serviceName: options.serviceName });
}
