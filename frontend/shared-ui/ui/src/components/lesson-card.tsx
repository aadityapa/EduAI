import * as React from 'react';
import { Clock, PlayCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './card';
import { ProgressBar } from './progress-bar';

export type LessonStatus = 'locked' | 'available' | 'in_progress' | 'completed';

export interface LessonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  subject?: string;
  durationMinutes?: number;
  progress?: number;
  status?: LessonStatus;
  thumbnailUrl?: string;
  actionLabel?: string;
  onAction?: () => void;
  statusLabels?: Partial<Record<LessonStatus, string>>;
}

const defaultStatusLabels: Record<LessonStatus, string> = {
  locked: 'Locked',
  available: 'Available',
  in_progress: 'In progress',
  completed: 'Completed',
};

const statusVariants: Record<LessonStatus, 'secondary' | 'info' | 'warning' | 'success'> = {
  locked: 'secondary',
  available: 'info',
  in_progress: 'warning',
  completed: 'success',
};

/** Compact lesson tile for student course / hub surfaces. */
export function LessonCard({
  title,
  description,
  subject,
  durationMinutes,
  progress = 0,
  status = 'available',
  thumbnailUrl,
  actionLabel,
  onAction,
  statusLabels,
  className,
  ...props
}: LessonCardProps) {
  const labels = { ...defaultStatusLabels, ...statusLabels };
  const resolvedAction =
    actionLabel ??
    (status === 'completed' ? 'Review' : status === 'in_progress' ? 'Continue' : 'Start');

  return (
    <Card className={cn('flex h-full flex-col overflow-hidden', className)} {...props}>
      <div className="relative aspect-[16/9] w-full bg-muted">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <PlayCircle className="h-10 w-10" aria-hidden="true" />
          </div>
        )}
        <Badge variant={statusVariants[status]} className="absolute end-3 top-3">
          {labels[status]}
        </Badge>
      </div>

      <CardHeader className="space-y-2 pb-3">
        {subject && (
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {subject}
          </p>
        )}
        <CardTitle className="line-clamp-2 text-base">{title}</CardTitle>
        {description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>

      <CardContent className="flex-1 space-y-3 pb-3">
        {durationMinutes != null && (
          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {durationMinutes} min
          </p>
        )}
        {(status === 'in_progress' || status === 'completed') && (
          <ProgressBar value={progress} label="Progress" showPercentage variant="lesson" size="sm" />
        )}
      </CardContent>

      {onAction && status !== 'locked' && (
        <CardFooter className="pt-0">
          <Button className="w-full" onClick={onAction}>
            {resolvedAction}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
