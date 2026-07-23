'use client';

import { useEffect } from 'react';
import { initClientSentry } from '@/lib/sentry';

/** Mount-once Sentry bootstrap (no-op without NEXT_PUBLIC_SENTRY_DSN). */
export function SentryInit({ app }: { app: 'web' | 'admin' }) {
  useEffect(() => {
    void initClientSentry(app);
  }, [app]);
  return null;
}
