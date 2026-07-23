'use client';

import { useEffect } from 'react';
import { initClientSentry } from '@/lib/sentry';

export function SentryInit() {
  useEffect(() => {
    void initClientSentry('admin');
  }, []);
  return null;
}
