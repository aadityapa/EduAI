/**
 * Admin Sentry scaffolding — env-gated.
 * Set NEXT_PUBLIC_SENTRY_DSN to enable; install @sentry/nextjs in this package.
 */

export async function initClientSentry(appName: 'admin' = 'admin'): Promise<void> {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;

  try {
    const mod = await import(/* webpackIgnore: true */ '@sentry/nextjs' as string).catch(
      () => null,
    );
    if (!mod) {
      if (process.env.NODE_ENV !== 'production') {
        console.info(`[sentry] DSN set for ${appName} but @sentry/nextjs is not installed`);
      }
      return;
    }
    const Sentry = mod as { init: (opts: Record<string, unknown>) => void };
    Sentry.init({
      dsn,
      environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
      tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
    });
  } catch {
    // soft-fail
  }
}
