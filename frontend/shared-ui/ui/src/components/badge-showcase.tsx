import * as React from 'react';
import { Award, Lock } from 'lucide-react';
import { cn } from '../lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

export interface ShowcaseBadge {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  earned?: boolean;
  earnedAt?: string;
}

export interface BadgeShowcaseProps extends React.HTMLAttributes<HTMLDivElement> {
  badges: ShowcaseBadge[];
  emptyLabel?: string;
  columns?: 3 | 4 | 5 | 6;
}

/** Grid of earned / locked achievement badges. */
export function BadgeShowcase({
  badges,
  emptyLabel = 'No badges yet',
  columns = 4,
  className,
  ...props
}: BadgeShowcaseProps) {
  const cols =
    columns === 3
      ? 'grid-cols-3'
      : columns === 5
        ? 'grid-cols-5'
        : columns === 6
          ? 'grid-cols-6'
          : 'grid-cols-4';

  if (badges.length === 0) {
    return (
      <div
        className={cn(
          'rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground',
          className,
        )}
        {...props}
      >
        {emptyLabel}
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className={cn('grid gap-3', cols, className)} {...props}>
        {badges.map((badge) => {
          const earned = badge.earned !== false;
          return (
            <Tooltip key={badge.id}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    'flex w-full flex-col items-center gap-2 rounded-xl border p-3 text-center transition-colors',
                    earned
                      ? 'border-achievement/30 bg-achievement/5'
                      : 'border-border bg-muted/40 opacity-60',
                  )}
                  aria-label={`${badge.name}${earned ? '' : ' (locked)'}`}
                >
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-full',
                      earned ? 'bg-achievement/15 text-achievement' : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {badge.iconUrl ? (
                      <img src={badge.iconUrl} alt="" className="h-7 w-7 object-contain" />
                    ) : earned ? (
                      <Award className="h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Lock className="h-5 w-5" aria-hidden="true" />
                    )}
                  </div>
                  <p className="line-clamp-2 text-xs font-medium">{badge.name}</p>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{badge.name}</p>
                {badge.description && <p className="text-xs opacity-90">{badge.description}</p>}
                {earned && badge.earnedAt && (
                  <p className="mt-1 text-xs opacity-70">Earned {badge.earnedAt}</p>
                )}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
