import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './button';
import { EmptyState } from './empty-state';
import { cn } from '../lib/utils';

describe('@eduai/ui smoke', () => {
  it('merges class names', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('renders Button', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('renders EmptyState title', () => {
    render(<EmptyState title="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });
});
