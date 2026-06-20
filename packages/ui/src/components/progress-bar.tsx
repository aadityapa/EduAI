import * as React from 'react';
import { cn } from '../lib/utils';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'xp' | 'lesson';
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
} as const;

const variantClasses = {
  default: 'bg-primary',
  xp: 'bg-xp',
  lesson: 'bg-accent',
} as const;

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = false,
  size = 'md',
  variant = 'default',
  className,
  ...props
}: ProgressBarProps) {
  const clampedMax = max > 0 ? max : 100;
  const percentage = Math.min(100, Math.max(0, (value / clampedMax) * 100));

  return (
    <div className={cn('w-full space-y-1.5', className)} {...props}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {label ? <span>{label}</span> : <span />}
          {showPercentage && <span>{Math.round(percentage)}%</span>}
        </div>
      )}
      <div
        className={cn('w-full overflow-hidden rounded-full bg-muted', sizeClasses[size])}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={clampedMax}
        aria-label={label}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-300', variantClasses[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
