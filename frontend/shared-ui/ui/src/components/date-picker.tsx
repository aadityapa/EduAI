'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { cn } from '../lib/utils';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  /** Accessible label for the trigger. */
  'aria-label'?: string;
  fromDate?: Date;
  toDate?: Date;
}

/**
 * Single-date picker (Popover + DayPicker).
 * Advanced range / multi-month UX is deferred — see phase-2-completion.
 */
export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  disabled,
  error,
  className,
  'aria-label': ariaLabel,
  fromDate,
  toDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          aria-label={ariaLabel ?? placeholder}
          aria-invalid={error || undefined}
          className={cn(
            'w-full justify-start text-start font-normal',
            !value && 'text-muted-foreground',
            error && 'border-destructive',
            className,
          )}
        >
          <CalendarIcon className="me-2 h-4 w-4" aria-hidden="true" />
          {value ? format(value, 'PPP') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <DayPicker
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange?.(date);
            setOpen(false);
          }}
          disabled={
            fromDate || toDate
              ? [{ before: fromDate ?? new Date(0) }, { after: toDate ?? new Date(8640000000000000) }]
              : undefined
          }
          className="rdp-eduai"
          classNames={{
            root: 'text-sm',
            months: 'flex flex-col gap-4',
            month: 'space-y-3',
            month_caption: 'flex justify-center relative items-center h-8',
            caption_label: 'text-sm font-medium',
            nav: 'flex items-center gap-1',
            button_previous:
              'absolute start-1 inline-flex h-7 w-7 items-center justify-center rounded-md border bg-transparent hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            button_next:
              'absolute end-1 inline-flex h-7 w-7 items-center justify-center rounded-md border bg-transparent hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            weekdays: 'flex',
            weekday: 'w-9 text-center text-[0.75rem] font-normal text-muted-foreground',
            week: 'flex w-full mt-1',
            day: 'relative p-0 text-center',
            day_button:
              'inline-flex h-9 w-9 items-center justify-center rounded-md text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-selected:opacity-100',
            selected:
              '[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground',
            today: '[&>button]:bg-accent [&>button]:text-accent-foreground',
            outside: 'text-muted-foreground opacity-50',
            disabled: 'text-muted-foreground opacity-50',
            hidden: 'invisible',
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
