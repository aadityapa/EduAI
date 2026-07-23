import * as React from 'react';
import { cn } from '../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Marks the field as invalid (sets aria-invalid + error ring). */
  error?: boolean;
  /** Optional id of the element that describes the error. */
  errorMessageId?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, errorMessageId, 'aria-invalid': ariaInvalid, ...props }, ref) => {
    const invalid = error === true || ariaInvalid === true || ariaInvalid === 'true';

    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-muted-foreground',
          'transition-colors duration-fast motion-reduce:transition-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive',
          className,
        )}
        ref={ref}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid && errorMessageId ? errorMessageId : props['aria-describedby']}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
