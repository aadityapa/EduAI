'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@eduai/ui';

interface RetryRefreshButtonProps {
  label?: string;
}

/** Client recovery control for RSC error panels — refreshes the current route. */
export function RetryRefreshButton({ label = 'Try again' }: RetryRefreshButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() => startTransition(() => router.refresh())}
    >
      <RotateCcw className={`h-3.5 w-3.5 ${pending ? 'animate-spin' : ''}`} aria-hidden="true" />
      {pending ? 'Refreshing…' : label}
    </Button>
  );
}
