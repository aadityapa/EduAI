import * as React from 'react';
import { Coins } from 'lucide-react';
import { cn } from '../lib/utils';
import { Badge } from './badge';

export interface CoinCounterProps extends React.HTMLAttributes<HTMLDivElement> {
  coins: number;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
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

/** Gamification coin / currency counter. */
export function CoinCounter({
  coins,
  showIcon = true,
  size = 'md',
  label = 'coins',
  className,
  ...props
}: CoinCounterProps) {
  const formatted = coins.toLocaleString();

  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center gap-1.5 border-achievement/30 bg-achievement/10 font-semibold text-achievement',
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {showIcon && <Coins className={iconSizes[size]} aria-hidden="true" />}
      <span>
        {formatted} {label}
      </span>
    </Badge>
  );
}
