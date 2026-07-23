import { getStructuredLogger } from './structured-logger.js';

export interface SentryInitOptions {
  serviceName: string;
}

/**
 * Env-gated Sentry init. No-op without SENTRY_DSN.
 * Dynamically loads `@sentry/node` when present — never embeds secrets.
 *
 * Scrubbing: beforeSend strips Authorization and cookie headers (DPDP-minded).
 */
export async function initSentry(options: SentryInitOptions): Promise<void> {
  const dsn =
    process.env[`SENTRY_DSN_${options.serviceName.replace(/-/g, '_').toUpperCase()}`] ??
    process.env.SENTRY_DSN;

  const log = getStructuredLogger(options.serviceName);

  if (!dsn) {
    log.debug('Sentry: SENTRY_DSN not set — error tracking disabled');
    return;
  }

  try {
    const dynImport = new Function('s', 'return import(s)') as (
      s: string,
    ) => Promise<Record<string, unknown>>;
    const sentry = await dynImport('@sentry/node').catch(() => null);
    if (!sentry) {
      log.warn(
        'Sentry DSN set but @sentry/node is not installed. Add the dependency to enable reporting.',
      );
      return;
    }

    const Sentry = sentry as {
      init: (opts: Record<string, unknown>) => void;
      setTag: (k: string, v: string) => void;
    };

    Sentry.init({
      dsn,
      environment: process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV ?? 'development',
      release: process.env.SENTRY_RELEASE,
      tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
      profilesSampleRate: Number(process.env.SENTRY_PROFILES_SAMPLE_RATE ?? 0),
      beforeSend(event: {
        request?: { headers?: Record<string, string> };
        user?: { email?: string; ip_address?: string };
      }) {
        if (event.request?.headers) {
          delete event.request.headers.authorization;
          delete event.request.headers.cookie;
          delete event.request.headers['x-internal-api-key'];
        }
        if (event.user) {
          delete event.user.email;
          delete event.user.ip_address;
        }
        return event;
      },
    });
    Sentry.setTag('service', options.serviceName);
    log.info('Sentry initialized', { environment: process.env.SENTRY_ENVIRONMENT ?? 'development' });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log.warn('Sentry init failed (soft)', { err: { message } });
  }
}

/** Capture exception when Sentry is loaded; otherwise no-op. */
export async function captureException(err: unknown, extra?: Record<string, unknown>): Promise<void> {
  try {
    if (!process.env.SENTRY_DSN) return;
    const dynImport = new Function('s', 'return import(s)') as (
      s: string,
    ) => Promise<Record<string, unknown>>;
    const sentry = await dynImport('@sentry/node').catch(() => null);
    if (!sentry) return;
    const Sentry = sentry as {
      captureException: (e: unknown, hint?: { extra?: Record<string, unknown> }) => void;
    };
    Sentry.captureException(err, { extra });
  } catch {
    // ignore
  }
}
