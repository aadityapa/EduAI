import * as React from 'react';
import { cn } from '../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  errorMessageId?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, errorMessageId, 'aria-invalid': ariaInvalid, ...props }, ref) => {
    const invalid = error === true || ariaInvalid === true || ariaInvalid === 'true';

    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
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
Textarea.displayName = 'Textarea';

export { Textarea };
