'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export interface ActivityItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  icon?: React.ReactNode;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export interface ActivityFeedProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ActivityItem[];
  emptyMessage?: string;
}

const typeStyles = {
  info: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-destructive/10 text-destructive',
};

export function ActivityFeed({ items, emptyMessage = 'No activity yet', className, ...props }: ActivityFeedProps) {
  if (!items.length) {
    return (
      <p className={cn('py-8 text-center text-sm text-muted-foreground', className)} {...props}>
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className={cn('relative space-y-0', className)} role="feed" aria-label="Activity feed" {...props}>
      {items.map((item, index) => (
        <div key={item.id} className="relative flex gap-4 pb-8 last:pb-0">
          {index < items.length - 1 && (
            <span className="absolute left-5 top-10 h-full w-px bg-border" aria-hidden="true" />
          )}
          <div
            className={cn(
              'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
              typeStyles[item.type ?? 'info'],
            )}
          >
            {item.icon ?? (
              <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
            )}
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <p className="text-sm font-medium">{item.title}</p>
            {item.description && (
              <p className="mt-0.5 text-sm text-muted-foreground">{item.description}</p>
            )}
            <time className="mt-1 block text-xs text-muted-foreground">{item.timestamp}</time>
          </div>
        </div>
      ))}
    </div>
  );
}
