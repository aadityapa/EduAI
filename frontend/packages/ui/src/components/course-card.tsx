import * as React from 'react';
import { BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './card';
import { ProgressBar } from './progress-bar';

export type CourseStatus = 'not_started' | 'in_progress' | 'completed';

export interface CourseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  subject?: string;
  lessonCount?: number;
  progress?: number;
  status?: CourseStatus;
  imageUrl?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const statusLabels: Record<CourseStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  completed: 'Completed',
};

const statusVariants: Record<CourseStatus, 'secondary' | 'warning' | 'success'> = {
  not_started: 'secondary',
  in_progress: 'warning',
  completed: 'success',
};

export function CourseCard({
  title,
  description,
  subject,
  lessonCount,
  progress = 0,
  status = 'not_started',
  imageUrl,
  actionLabel = 'Start',
  onAction,
  className,
  ...props
}: CourseCardProps) {
  return (
    <Card className={cn('flex h-full flex-col overflow-hidden', className)} {...props}>
      <div className="relative aspect-[16/9] w-full bg-muted">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <BookOpen className="h-10 w-10" aria-hidden="true" />
          </div>
        )}
        <Badge
          variant={statusVariants[status]}
          className="absolute right-3 top-3"
        >
          {statusLabels[status]}
        </Badge>
      </div>

      <CardHeader className="space-y-2 pb-3">
        {subject && <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{subject}</p>}
        <CardTitle className="line-clamp-2 text-lg">{title}</CardTitle>
        {description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>

      <CardContent className="flex-1 space-y-3 pb-3">
        {lessonCount != null && (
          <p className="text-xs text-muted-foreground">{lessonCount} lessons</p>
        )}
        {status !== 'not_started' && (
          <ProgressBar value={progress} label="Progress" showPercentage variant="lesson" size="sm" />
        )}
      </CardContent>

      {onAction && (
        <CardFooter className="pt-0">
          <Button className="w-full" onClick={onAction}>
            {actionLabel}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
