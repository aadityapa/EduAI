import * as React from 'react';
import { Flame } from 'lucide-react';
import { cn } from '../lib/utils';
import { Badge } from './badge';

export interface StreakBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  days: number;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
} as const;

const iconSizes = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
} as const;

export function StreakBadge({
  days,
  showIcon = true,
  size = 'md',
  className,
  ...props
}: StreakBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center gap-1.5 border-streak/30 bg-streak/10 font-semibold text-streak',
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {showIcon && <Flame className={iconSizes[size]} aria-hidden="true" />}
      <span>
        {days} {days === 1 ? 'day' : 'days'}
      </span>
    </Badge>
  );
}
