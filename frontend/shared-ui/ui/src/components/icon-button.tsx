import * as React from 'react';
import { cn } from '../lib/utils';
import { Button, type ButtonProps } from './button';

export interface IconButtonProps extends Omit<ButtonProps, 'size' | 'children'> {
  /** Accessible name — required for icon-only buttons. */
  'aria-label': string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
} as const;

/**
 * Icon-only button with enforced aria-label.
 * Prefer over raw `Button size="icon"` when the control has no visible text.
 */
const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size = 'md', children, ...props }, ref) => (
    <Button
      ref={ref}
      size="icon"
      className={cn(sizeMap[size], className)}
      {...props}
    >
      {children}
    </Button>
  ),
);
IconButton.displayName = 'IconButton';

export { IconButton };
