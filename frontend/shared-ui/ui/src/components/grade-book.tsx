import * as React from 'react';
import { cn } from '../lib/utils';
import { Badge } from './badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

export interface GradeBookEntry {
  id: string;
  studentName: string;
  rollNumber?: string;
  scores: Record<string, number | null>;
  average?: number | null;
}

export interface GradeBookColumn {
  id: string;
  label: string;
  max?: number;
}

export interface GradeBookProps extends React.HTMLAttributes<HTMLDivElement> {
  columns: GradeBookColumn[];
  entries: GradeBookEntry[];
  emptyLabel?: string;
}

function scoreTone(score: number | null | undefined, max = 100): 'success' | 'warning' | 'danger' | 'secondary' {
  if (score == null) return 'secondary';
  const pct = (score / max) * 100;
  if (pct >= 75) return 'success';
  if (pct >= 40) return 'warning';
  return 'danger';
}

/** Dense grade book table foundation for teacher reporting. */
export function GradeBook({
  columns,
  entries,
  emptyLabel = 'No grades yet',
  className,
  ...props
}: GradeBookProps) {
  if (entries.length === 0) {
    return (
      <div
        className={cn(
          'rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground',
          className,
        )}
        {...props}
      >
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className={cn('overflow-x-auto rounded-lg border', className)} {...props}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            {columns.map((col) => (
              <TableHead key={col.id} className="text-center">
                {col.label}
                {col.max != null && (
                  <span className="ms-1 text-xs font-normal text-muted-foreground">/{col.max}</span>
                )}
              </TableHead>
            ))}
            <TableHead className="text-center">Avg</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{entry.studentName}</p>
                  {entry.rollNumber && (
                    <p className="text-xs text-muted-foreground">#{entry.rollNumber}</p>
                  )}
                </div>
              </TableCell>
              {columns.map((col) => {
                const score = entry.scores[col.id];
                return (
                  <TableCell key={col.id} className="text-center">
                    {score == null ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      <Badge variant={scoreTone(score, col.max)}>{score}</Badge>
                    )}
                  </TableCell>
                );
              })}
              <TableCell className="text-center font-medium tabular-nums">
                {entry.average == null ? '—' : entry.average.toFixed(1)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
