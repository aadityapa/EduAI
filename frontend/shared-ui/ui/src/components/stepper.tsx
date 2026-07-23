import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';

export interface StepperStep {
  id: string;
  label: string;
  description?: string;
}

export interface StepperProps extends React.HTMLAttributes<HTMLElement> {
  steps: StepperStep[];
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
}

/** Linear multi-step indicator — keyboard focus stays on surrounding controls. */
export function Stepper({
  steps,
  currentStep,
  orientation = 'horizontal',
  className,
  ...props
}: StepperProps) {
  const isVertical = orientation === 'vertical';

  return (
    <nav
      aria-label="Progress"
      className={cn(isVertical ? 'flex flex-col gap-4' : 'flex w-full items-start gap-2', className)}
      {...props}
    >
      {steps.map((step, index) => {
        const status =
          index < currentStep ? 'complete' : index === currentStep ? 'current' : 'upcoming';
        return (
          <div
            key={step.id}
            className={cn(
              'flex',
              isVertical ? 'items-start gap-3' : 'min-w-0 flex-1 flex-col items-center gap-2',
            )}
          >
            <div className={cn('flex items-center', !isVertical && 'w-full justify-center gap-2')}>
              {!isVertical && index > 0 && (
                <div
                  className={cn(
                    'h-0.5 flex-1 rounded-full',
                    index <= currentStep ? 'bg-primary' : 'bg-muted',
                  )}
                  aria-hidden="true"
                />
              )}
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold',
                  status === 'complete' && 'border-primary bg-primary text-primary-foreground',
                  status === 'current' && 'border-primary bg-primary/10 text-primary',
                  status === 'upcoming' && 'border-border bg-background text-muted-foreground',
                )}
                aria-current={status === 'current' ? 'step' : undefined}
              >
                {status === 'complete' ? (
                  <Check className="h-4 w-4" aria-hidden="true" />
                ) : (
                  index + 1
                )}
              </span>
              {!isVertical && index < steps.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 flex-1 rounded-full',
                    index < currentStep ? 'bg-primary' : 'bg-muted',
                  )}
                  aria-hidden="true"
                />
              )}
            </div>
            <div className={cn(!isVertical && 'px-1 text-center')}>
              <p
                className={cn(
                  'text-sm font-medium',
                  status === 'upcoming' ? 'text-muted-foreground' : 'text-foreground',
                )}
              >
                {step.label}
              </p>
              {step.description && (
                <p className="text-xs text-muted-foreground">{step.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
