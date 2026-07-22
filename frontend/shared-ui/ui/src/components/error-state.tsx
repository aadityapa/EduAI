import * as React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';
import { Card, CardContent } from './card';
import { Button } from './button';

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

/** Semantic error panel for failed data fetches — pairs with EmptyState/Skeleton. */
export function ErrorState({
  title = 'Something went wrong',
  message = 'We could not load this content right now. Please try again.',
  onRetry,
  retryLabel = 'Try again',
  className,
  ...props
}: ErrorStateProps) {
  return (
    <Card className={cn('border-destructive/30 bg-destructive/5', className)} {...props}>
      <CardContent className="flex items-start gap-3 p-6">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
        <div className="flex-1 space-y-1">
          <p className="font-medium text-destructive">{title}</p>
          <p className="text-sm text-muted-foreground">{message}</p>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              {retryLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
