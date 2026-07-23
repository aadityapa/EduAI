'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorState, Button } from '@eduai/ui';

interface PortalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/** Shared client error boundary UI for portal route segments. */
export function PortalError({ error, reset }: PortalErrorProps) {
  const router = useRouter();

  useEffect(() => {
    console.error('[EduAI portal]', error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col justify-center p-6">
      <ErrorState
        title="This page hit a snag"
        message={
          error.message ||
          'Something unexpected happened. You can retry or go back to your dashboard.'
        }
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={reset}>
              Try again
            </Button>
            <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
              Back to dashboard
            </Button>
          </div>
        }
      />
    </div>
  );
}
