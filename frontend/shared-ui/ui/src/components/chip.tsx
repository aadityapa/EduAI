import * as React from 'react';
import { X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const chipVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-muted text-foreground',
        primary: 'border-transparent bg-primary/10 text-primary',
        secondary: 'border-transparent bg-secondary/15 text-secondary-foreground',
        outline: 'border-border bg-transparent text-foreground',
        success: 'border-transparent bg-success/15 text-success',
        warning: 'border-transparent bg-warning/15 text-warning-foreground',
        danger: 'border-transparent bg-destructive/15 text-destructive',
      },
      selected: {
        true: 'ring-2 ring-ring ring-offset-1 ring-offset-background',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      selected: false,
    },
  },
);

export interface ChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof chipVariants> {
  onRemove?: () => void;
  removeLabel?: string;
}

/** Tag / filter chip — clickable; optional dismiss. */
const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      className,
      variant,
      selected,
      onRemove,
      removeLabel = 'Remove',
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        aria-pressed={selected ?? undefined}
        className={cn(chipVariants({ variant, selected }), 'disabled:opacity-50', className)}
        {...props}
      >
        <span>{children}</span>
        {onRemove && (
          <span
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-label={removeLabel}
            className="inline-flex rounded-full p-0.5 hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                onRemove();
              }
            }}
          >
            <X className="h-3 w-3" aria-hidden="true" />
          </span>
        )}
      </button>
    );
  },
);
Chip.displayName = 'Chip';

/** Non-interactive tag alias for display-only chips. */
export function Tag({
  className,
  variant = 'default',
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof chipVariants>) {
  return (
    <span className={cn(chipVariants({ variant, selected: false }), className)} {...props}>
      {children}
    </span>
  );
}

export { Chip, chipVariants };
