import * as React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { Badge } from './badge';

export interface XpBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  xp: number;
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

export function XpBadge({ xp, showIcon = true, size = 'md', className, ...props }: XpBadgeProps) {
  const formatted = xp.toLocaleString();

  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center gap-1.5 border-xp/30 bg-xp/10 font-semibold text-xp',
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {showIcon && <Sparkles className={iconSizes[size]} aria-hidden="true" />}
      <span>{formatted} XP</span>
    </Badge>
  );
}
