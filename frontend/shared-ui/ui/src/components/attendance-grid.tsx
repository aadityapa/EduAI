import * as React from 'react';
import { cn } from '../lib/utils';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused' | 'holiday' | 'empty';

export interface AttendanceCell {
  date: string;
  status: AttendanceStatus;
  label?: string;
}

export interface AttendanceGridProps extends React.HTMLAttributes<HTMLDivElement> {
  days: AttendanceCell[];
  legendLabels?: Partial<Record<AttendanceStatus, string>>;
  showLegend?: boolean;
}

const statusStyles: Record<AttendanceStatus, string> = {
  present: 'bg-success text-success-foreground',
  absent: 'bg-destructive text-destructive-foreground',
  late: 'bg-warning text-warning-foreground',
  excused: 'bg-info text-info-foreground',
  holiday: 'bg-muted text-muted-foreground',
  empty: 'bg-muted/40 text-muted-foreground border border-dashed border-border',
};

const defaultLegend: Record<AttendanceStatus, string> = {
  present: 'Present',
  absent: 'Absent',
  late: 'Late',
  excused: 'Excused',
  holiday: 'Holiday',
  empty: 'No data',
};

/** Compact monthly / weekly attendance heat grid for teachers and parents. */
export function AttendanceGrid({
  days,
  legendLabels,
  showLegend = true,
  className,
  ...props
}: AttendanceGridProps) {
  const legend = { ...defaultLegend, ...legendLabels };

  return (
    <div className={cn('space-y-3', className)} {...props}>
      <div
        className="grid grid-cols-7 gap-1.5 sm:gap-2"
        role="grid"
        aria-label="Attendance"
      >
        {days.map((day) => (
          <div
            key={day.date}
            role="gridcell"
            title={day.label ?? `${day.date}: ${legend[day.status]}`}
            aria-label={`${day.date}: ${legend[day.status]}`}
            className={cn(
              'flex aspect-square items-center justify-center rounded-md text-[10px] font-medium sm:text-xs',
              statusStyles[day.status],
            )}
          >
            {new Date(day.date + 'T00:00:00').getDate()}
          </div>
        ))}
      </div>
      {showLegend && (
        <ul className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {(Object.keys(defaultLegend) as AttendanceStatus[])
            .filter((k) => k !== 'empty')
            .map((key) => (
              <li key={key} className="inline-flex items-center gap-1.5">
                <span className={cn('h-2.5 w-2.5 rounded-sm', statusStyles[key])} aria-hidden="true" />
                {legend[key]}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
