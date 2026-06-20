import * as React from 'react';
import { Crown, Medal, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { XpBadge } from './xp-badge';

export interface LeaderboardRowProps extends React.HTMLAttributes<HTMLDivElement> {
  rank: number;
  name: string;
  xp: number;
  avatarUrl?: string;
  isCurrentUser?: boolean;
  subtitle?: string;
}

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="h-4 w-4 text-xp" aria-hidden="true" />;
  if (rank === 2) return <Medal className="h-4 w-4 text-muted-foreground" aria-hidden="true" />;
  if (rank === 3) return <Trophy className="h-4 w-4 text-streak" aria-hidden="true" />;
  return null;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function LeaderboardRow({
  rank,
  name,
  xp,
  avatarUrl,
  isCurrentUser = false,
  subtitle,
  className,
  ...props
}: LeaderboardRowProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors',
        isCurrentUser ? 'border-primary/40 bg-primary/5' : 'border-border bg-card',
        className,
      )}
      {...props}
    >
      <div className="flex w-8 shrink-0 items-center justify-center gap-1 text-sm font-bold text-muted-foreground">
        <RankIcon rank={rank} />
        <span>{rank}</span>
      </div>

      <Avatar className="h-9 w-9">
        {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className={cn('truncate font-medium', isCurrentUser && 'text-primary')}>
          {name}
          {isCurrentUser && <span className="ml-1 text-xs text-muted-foreground">(You)</span>}
        </p>
        {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
      </div>

      <XpBadge xp={xp} size="sm" />
    </div>
  );
}
