import { cn } from '../lib/utils';
import type { ReactNode } from 'react';
import { AlertTriangle, Calendar, CheckCircle2, FileText } from 'lucide-react';

export interface StitchTaskItem {
  id: string;
  title: string;
  due: string;
  href?: string;
  variant?: 'error' | 'primary';
}

export function StitchTaskList({
  title = 'Upcoming Tasks',
  tasks,
  className,
}: {
  title?: string;
  tasks: StitchTaskItem[];
  className?: string;
}) {
  return (
    <div className={cn('rounded-2xl border border-dashed border-border bg-muted/30 p-6', className)}>
      <h4 className="mb-4 text-lg font-semibold">{title}</h4>
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-sm">
            {task.variant === 'error' ? (
              <Calendar className="h-5 w-5 shrink-0 text-destructive" />
            ) : (
              <FileText className="h-5 w-5 shrink-0 text-primary" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">{task.title}</p>
              <p className="text-xs text-muted-foreground">{task.due}</p>
            </div>
            {task.href ? (
              <a href={task.href} className="text-xs font-bold text-primary hover:underline">
                Open
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export interface StitchInsightItem {
  id: string;
  content: ReactNode;
  accent?: 'default' | 'warning';
}

export function StitchInsightPanel({
  title = 'Learning Insights',
  insights,
  className,
}: {
  title?: string;
  insights: StitchInsightItem[];
  className?: string;
}) {
  return (
    <div className={cn('rounded-2xl border border-primary/20 bg-primary/5 p-6', className)}>
      <h4 className="mb-4 text-lg font-semibold">{title}</h4>
      <div className="space-y-3">
        {insights.map((item) => (
          <div
            key={item.id}
            className={cn(
              'rounded-xl bg-card p-4 text-sm text-muted-foreground',
              item.accent === 'warning' && 'border-l-4 border-destructive',
            )}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}

export function StitchPageHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mb-6 flex flex-wrap items-end justify-between gap-4', className)}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description && <p className="mt-1 text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function StitchSlaBanner({
  message,
  actionLabel,
  actionHref,
  className,
}: {
  message: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
        <p className="text-sm font-medium text-destructive">{message}</p>
      </div>
      {actionLabel && actionHref ? (
        <a
          href={actionHref}
          className="rounded-full bg-destructive px-4 py-1.5 text-xs font-bold text-destructive-foreground"
        >
          {actionLabel}
        </a>
      ) : null}
    </div>
  );
}

export interface StitchScheduleItem {
  id: string;
  time: string;
  title: string;
  location: string;
  accent?: 'primary' | 'secondary' | 'muted';
  status?: 'active' | 'scheduled';
  href?: string;
}

export function StitchScheduleCarousel({ items, className }: { items: StitchScheduleItem[]; className?: string }) {
  const borderClass = {
    primary: 'border-l-primary',
    secondary: 'border-l-success',
    muted: 'border-l-border',
  } as const;

  return (
    <div className={cn('flex gap-4 overflow-x-auto pb-2 snap-x', className)}>
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            'stitch-card min-w-[240px] snap-start border-l-4 p-5',
            borderClass[item.accent ?? 'primary'],
          )}
        >
          <p className={cn('mb-1 text-xs font-bold uppercase', item.accent === 'secondary' ? 'text-success' : 'text-primary')}>
            {item.time}
          </p>
          <h4 className="mb-2 font-semibold">{item.title}</h4>
          <p className="mb-4 text-sm text-muted-foreground">{item.location}</p>
          {item.href ? (
            <a
              href={item.href}
              className="block w-full rounded-lg bg-muted py-2 text-center text-sm font-bold hover:bg-muted/80"
            >
              {item.status === 'scheduled' ? 'Scheduled' : 'Start Session'}
            </a>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export interface StitchGradeItem {
  id: string;
  title: string;
  meta: string;
  href?: string;
}

export function StitchToGradeList({ items, activeCount, className }: { items: StitchGradeItem[]; activeCount?: number; className?: string }) {
  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">To Grade</h3>
        {activeCount != null && (
          <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-bold text-destructive">
            {activeCount} Active
          </span>
        )}
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="stitch-card flex items-center justify-between gap-3 p-4">
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.meta}</p>
            </div>
            {item.href ? (
              <a href={item.href} className="text-sm font-bold text-primary hover:underline">
                Grade
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StitchTeacherAiPromo({ href, className }: { href: string; className?: string }) {
  return (
    <div
      className={cn(
        'stitch-card relative flex min-h-[240px] flex-col justify-between overflow-hidden border border-[#9334E6]/10 p-6',
        className,
      )}
    >
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#9334E6]/5 blur-3xl" />
      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#9334E6]/20">
            <CheckCircle2 className="h-5 w-5 text-[#9334E6]" />
          </div>
          <span className="font-semibold text-[#9334E6]">AI Question Generator</span>
        </div>
        <p className="max-w-md text-muted-foreground">
          Instantly create high-quality multiple choice, short answer, and essay questions from any textbook page or PDF.
        </p>
      </div>
      <a
        href={href}
        className="relative z-10 mt-6 inline-flex w-fit rounded-full bg-[#9334E6] px-8 py-2 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5"
      >
        Try Now
      </a>
    </div>
  );
}

export function StitchParentKpiCard({
  label,
  value,
  description,
  trend,
  icon,
  accent = 'primary',
  className,
}: {
  label: string;
  value: ReactNode;
  description?: string;
  trend?: string;
  icon: ReactNode;
  accent?: 'primary' | 'tertiary' | 'secondary';
  className?: string;
}) {
  const iconBg = {
    primary: 'bg-primary/10 text-primary',
    tertiary: 'bg-[#9334E6]/10 text-[#9334E6]',
    secondary: 'bg-success/10 text-success',
  } as const;

  return (
    <div className={cn('stitch-card flex flex-col gap-2 p-6', className)}>
      <div className="flex items-center justify-between">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', iconBg[accent])}>{icon}</div>
        {trend && (
          <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-bold text-success">{trend}</span>
        )}
      </div>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="text-3xl font-bold">{value}</div>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}

export interface StitchTimelineItem {
  id: string;
  title: string;
  date: string;
  description?: string;
}

export function StitchProgressTimeline({ items, className }: { items: StitchTimelineItem[]; className?: string }) {
  return (
    <div className={cn('stitch-card p-6', className)}>
      <h3 className="mb-4 text-lg font-semibold">Progress Timeline</h3>
      <ol className="relative space-y-6 border-l border-border pl-6">
        {items.map((item) => (
          <li key={item.id} className="relative">
            <span className="absolute -left-[1.65rem] top-1 h-3 w-3 rounded-full border-2 border-primary bg-background" />
            <p className="text-xs font-medium text-muted-foreground">{item.date}</p>
            <p className="font-semibold">{item.title}</p>
            {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}
