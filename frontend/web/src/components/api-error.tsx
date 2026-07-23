import { ErrorState } from '@eduai/ui';
import { RetryRefreshButton } from '@/components/retry-refresh-button';

interface ApiErrorProps {
  title?: string;
  message?: string;
  retryLabel?: string;
}

/** Thin wrapper around `@eduai/ui` ErrorState with route-refresh recovery. */
export function ApiError({
  title = 'Something went wrong',
  message = 'We could not load this content right now. Please try again later.',
  retryLabel = 'Try again',
}: ApiErrorProps) {
  return (
    <ErrorState
      title={title}
      message={message}
      action={<RetryRefreshButton label={retryLabel} />}
    />
  );
}
