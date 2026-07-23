/**
 * Frontend Sentry scaffolding — env-gated, no secrets in repo.
 * Set NEXT_PUBLIC_SENTRY_DSN (or SENTRY_DSN on server) to enable.
 */

export async function initClientSentry(appName: 'web' | 'admin' | 'mobile'): Promise<void> {
  const dsn =
    (typeof process !== 'undefined' &&
      (process.env.NEXT_PUBLIC_SENTRY_DSN ||
        process.env[`NEXT_PUBLIC_SENTRY_DSN_${appName.toUpperCase()}`])) ||
    undefined;

  if (!dsn) return;

  try {
    // Optional peer — install @sentry/nextjs (web/admin) or @sentry/react-native (mobile)
    const mod = await import(/* webpackIgnore: true */ '@sentry/nextjs' as string).catch(
      () => null,
    );
    if (!mod) {
      if (process.env.NODE_ENV !== 'production') {
        console.info(
          `[sentry] DSN set for ${appName} but @sentry/nextjs is not installed — skipping`,
        );
      }
      return;
    }
    const Sentry = mod as {
      init: (opts: Record<string, unknown>) => void;
    };
    Sentry.init({
      dsn,
      environment:
        process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ??
        process.env.SENTRY_ENVIRONMENT ??
        process.env.NODE_ENV ??
        'development',
      tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
      beforeSend(event: { request?: { headers?: Record<string, string> } }) {
        if (event.request?.headers) {
          delete event.request.headers.authorization;
          delete event.request.headers.cookie;
        }
        return event;
      },
    });
  } catch {
    // soft-fail
  }
}
