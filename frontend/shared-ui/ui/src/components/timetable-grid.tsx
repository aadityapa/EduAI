import * as React from 'react';
import { cn } from '../lib/utils';

export interface TimetableSlot {
  id: string;
  day: number;
  startPeriod: number;
  span?: number;
  title: string;
  subtitle?: string;
  tone?: 'default' | 'primary' | 'secondary' | 'success' | 'warning';
}

export interface TimetableGridProps extends React.HTMLAttributes<HTMLDivElement> {
  days: string[];
  periods: string[];
  slots: TimetableSlot[];
  emptyLabel?: string;
}

const toneClasses = {
  default: 'border-border bg-card',
  primary: 'border-primary/30 bg-primary/10',
  secondary: 'border-secondary/30 bg-secondary/10',
  success: 'border-success/30 bg-success/10',
  warning: 'border-warning/30 bg-warning/10',
} as const;

/** Weekly timetable grid — foundation for teacher/student schedules. */
export function TimetableGrid({
  days,
  periods,
  slots,
  emptyLabel = 'Free',
  className,
  ...props
}: TimetableGridProps) {
  const slotMap = React.useMemo(() => {
    const map = new Map<string, TimetableSlot>();
    for (const slot of slots) {
      map.set(`${slot.day}-${slot.startPeriod}`, slot);
    }
    return map;
  }, [slots]);

  const covered = React.useMemo(() => {
    const set = new Set<string>();
    for (const slot of slots) {
      const span = slot.span ?? 1;
      for (let p = slot.startPeriod + 1; p < slot.startPeriod + span; p += 1) {
        set.add(`${slot.day}-${p}`);
      }
    }
    return set;
  }, [slots]);

  return (
    <div className={cn('overflow-x-auto', className)} {...props}>
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="border bg-muted/50 p-2 text-start font-medium text-muted-foreground">
              Period
            </th>
            {days.map((day) => (
              <th
                key={day}
                className="border bg-muted/50 p-2 text-center font-medium"
                scope="col"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {periods.map((period, periodIndex) => (
            <tr key={period}>
              <th
                scope="row"
                className="border bg-muted/30 p-2 text-start font-medium text-muted-foreground"
              >
                {period}
              </th>
              {days.map((_, dayIndex) => {
                const key = `${dayIndex}-${periodIndex}`;
                if (covered.has(key)) return null;
                const slot = slotMap.get(key);
                if (!slot) {
                  return (
                    <td
                      key={key}
                      className="border p-2 text-center text-xs text-muted-foreground"
                    >
                      {emptyLabel}
                    </td>
                  );
                }
                return (
                  <td
                    key={key}
                    rowSpan={slot.span ?? 1}
                    className={cn(
                      'border p-2 align-top',
                      toneClasses[slot.tone ?? 'default'],
                    )}
                  >
                    <p className="font-medium leading-snug">{slot.title}</p>
                    {slot.subtitle && (
                      <p className="mt-0.5 text-xs text-muted-foreground">{slot.subtitle}</p>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
