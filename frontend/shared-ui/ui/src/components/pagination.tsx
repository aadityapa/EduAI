import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './button';

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  previousLabel?: string;
  nextLabel?: string;
  siblingCount?: number;
}

function range(start: number, end: number): number[] {
  const length = end - start + 1;
  return Array.from({ length }, (_, i) => start + i);
}

function buildPages(page: number, pageCount: number, siblingCount: number): Array<number | 'ellipsis'> {
  const totalNumbers = siblingCount * 2 + 5;
  if (pageCount <= totalNumbers) return range(1, pageCount);

  const leftSibling = Math.max(page - siblingCount, 1);
  const rightSibling = Math.min(page + siblingCount, pageCount);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < pageCount - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftCount = 3 + 2 * siblingCount;
    return [...range(1, leftCount), 'ellipsis', pageCount];
  }
  if (showLeftEllipsis && !showRightEllipsis) {
    const rightCount = 3 + 2 * siblingCount;
    return [1, 'ellipsis', ...range(pageCount - rightCount + 1, pageCount)];
  }
  return [1, 'ellipsis', ...range(leftSibling, rightSibling), 'ellipsis', pageCount];
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  previousLabel = 'Previous page',
  nextLabel = 'Next page',
  siblingCount = 1,
  className,
  ...props
}: PaginationProps) {
  const pages = buildPages(page, Math.max(1, pageCount), siblingCount);

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn('flex items-center gap-1', className)}
      {...props}
    >
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        aria-label={previousLabel}
      >
        <ChevronLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
      </Button>
      {pages.map((item, index) =>
        item === 'ellipsis' ? (
          <span
            key={`e-${index}`}
            className="flex h-8 w-8 items-center justify-center text-muted-foreground"
            aria-hidden="true"
          >
            <MoreHorizontal className="h-4 w-4" />
          </span>
        ) : (
          <Button
            key={item}
            variant={item === page ? 'default' : 'outline'}
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(item)}
            aria-label={`Page ${item}`}
            aria-current={item === page ? 'page' : undefined}
          >
            {item}
          </Button>
        ),
      )}
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(Math.min(pageCount, page + 1))}
        disabled={page >= pageCount}
        aria-label={nextLabel}
      >
        <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
      </Button>
    </nav>
  );
}
