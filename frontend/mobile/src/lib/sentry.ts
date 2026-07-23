/**
 * Mobile Sentry scaffolding — env-gated via EXPO_PUBLIC_SENTRY_DSN.
 * Install @sentry/react-native when enabling in EAS builds.
 */
export async function initMobileSentry(): Promise<void> {
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
  if (!dsn) return;

  try {
    const mod = await import(/* webpackIgnore: true */ '@sentry/react-native' as string).catch(
      () => null,
    );
    if (!mod) {
      console.info('[sentry] EXPO_PUBLIC_SENTRY_DSN set but @sentry/react-native not installed');
      return;
    }
    const Sentry = mod as { init: (opts: Record<string, unknown>) => void };
    Sentry.init({
      dsn,
      environment: process.env.EXPO_PUBLIC_SENTRY_ENVIRONMENT ?? 'development',
      tracesSampleRate: Number(process.env.EXPO_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
    });
  } catch {
    // soft-fail
  }
}
