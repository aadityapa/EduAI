import * as React from 'react';
import { cn } from '../lib/utils';
import { Card, CardContent } from './card';
import { MasteryRing } from './mastery-ring';
import { Skeleton } from './skeleton';

export interface ProgressCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: number;
  max?: number;
  sublabel?: string;
  variant?: 'primary' | 'success' | 'xp' | 'streak' | 'achievement';
  footer?: React.ReactNode;
  loading?: boolean;
}

/** Domain card pairing a MasteryRing with context — the app's signature progress visual. */
export function ProgressCard({
  title,
  value,
  max = 100,
  sublabel,
  variant = 'primary',
  footer,
  loading,
  className,
  ...props
}: ProgressCardProps) {
  if (loading) {
    return (
      <Card className={cn('overflow-hidden', className)} {...props}>
        <CardContent className="flex flex-col items-center gap-3 p-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('stitch-card overflow-hidden', className)} {...props}>
      <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
        <MasteryRing value={value} max={max} variant={variant} label={title} sublabel={sublabel} />
        {footer && <div className="w-full pt-1">{footer}</div>}
      </CardContent>
    </Card>
  );
}
