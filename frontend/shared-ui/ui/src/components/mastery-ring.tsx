import * as React from 'react';
import { cn } from '../lib/utils';

export interface MasteryRingProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'primary' | 'success' | 'xp' | 'streak' | 'achievement';
  label?: string;
  sublabel?: string;
}

const variantStroke = {
  primary: 'stroke-primary',
  success: 'stroke-success',
  xp: 'stroke-xp',
  streak: 'stroke-streak',
  achievement: 'stroke-achievement',
} as const;

/** Signature EduAI progress ring — visualizes mastery, streak momentum, or XP level fill. */
export function MasteryRing({
  value,
  max = 100,
  size = 96,
  strokeWidth = 8,
  variant = 'primary',
  label,
  sublabel,
  className,
  ...props
}: MasteryRingProps) {
  const pct = Math.min(100, Math.max(0, (value / (max || 100)) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div
      className={cn('inline-flex flex-col items-center gap-2', className)}
      role="img"
      aria-label={`${label ? `${label}: ` : ''}${Math.round(pct)}%`}
      {...props}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className="fill-none stroke-muted"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className={cn('fill-none transition-[stroke-dashoffset] duration-700 ease-out', variantStroke[variant])}
            style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold tabular-nums">{Math.round(pct)}%</span>
        </div>
      </div>
      {(label || sublabel) && (
        <div className="text-center">
          {label && <p className="text-sm font-semibold text-foreground">{label}</p>}
          {sublabel && <p className="text-xs text-muted-foreground">{sublabel}</p>}
        </div>
      )}
    </div>
  );
}
