'use client';

import * as React from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';
import { Card, CardContent } from './card';
import { Skeleton } from './skeleton';

export interface KpiCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  description?: string;
  trend?: { value: number; label?: string };
  loading?: boolean;
}

export function KpiCard({
  icon,
  label,
  value,
  description,
  trend,
  loading,
  className,
  ...props
}: KpiCardProps) {
  if (loading) {
    return (
      <Card className={cn('overflow-hidden', className)} {...props}>
        <CardContent className="p-6">
          <Skeleton className="mb-4 h-10 w-10 rounded-lg" />
          <Skeleton className="mb-2 h-4 w-24" />
          <Skeleton className="h-8 w-32" />
        </CardContent>
      </Card>
    );
  }

  const trendPositive = trend && trend.value >= 0;

  return (
    <Card className={cn('stitch-card group overflow-hidden transition-shadow hover:shadow-md', className)} {...props}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
            {icon}
          </div>
          {trend && (
            <div
              className={cn(
                'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                trendPositive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive',
              )}
            >
              {trendPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        <div className="mt-4 space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
          {trend?.label && <p className="text-xs text-muted-foreground">{trend.label}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export { StatCard } from './stat-card';
export type { StatCardProps } from './stat-card';
