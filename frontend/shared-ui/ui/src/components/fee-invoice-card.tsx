import * as React from 'react';
import { Receipt } from 'lucide-react';
import { cn } from '../lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './card';

export type InvoiceStatus = 'draft' | 'due' | 'paid' | 'overdue' | 'cancelled';

export interface FeeInvoiceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  invoiceNumber: string;
  title: string;
  amount: number;
  currency?: string;
  dueDate?: string;
  status: InvoiceStatus;
  studentName?: string;
  onPay?: () => void;
  onView?: () => void;
  payLabel?: string;
  viewLabel?: string;
  statusLabels?: Partial<Record<InvoiceStatus, string>>;
}

const statusVariant: Record<InvoiceStatus, 'secondary' | 'warning' | 'success' | 'danger' | 'outline'> = {
  draft: 'outline',
  due: 'warning',
  paid: 'success',
  overdue: 'danger',
  cancelled: 'secondary',
};

const defaultStatusLabels: Record<InvoiceStatus, string> = {
  draft: 'Draft',
  due: 'Due',
  paid: 'Paid',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
};

/** Parent-facing fee invoice summary card. */
export function FeeInvoiceCard({
  invoiceNumber,
  title,
  amount,
  currency = 'INR',
  dueDate,
  status,
  studentName,
  onPay,
  onView,
  payLabel = 'Pay now',
  viewLabel = 'View',
  statusLabels,
  className,
  ...props
}: FeeInvoiceCardProps) {
  const labels = { ...defaultStatusLabels, ...statusLabels };
  const formatted = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

  return (
    <Card className={cn('overflow-hidden', className)} {...props}>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Receipt className="h-4 w-4" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-wide">{invoiceNumber}</span>
          </div>
          <CardTitle className="text-base">{title}</CardTitle>
          {studentName && <p className="text-sm text-muted-foreground">{studentName}</p>}
        </div>
        <Badge variant={statusVariant[status]}>{labels[status]}</Badge>
      </CardHeader>
      <CardContent className="space-y-1 pb-3">
        <p className="text-2xl font-bold tabular-nums">{formatted}</p>
        {dueDate && (
          <p className="text-sm text-muted-foreground">
            Due {dueDate}
          </p>
        )}
      </CardContent>
      {(onPay || onView) && (
        <CardFooter className="gap-2">
          {onView && (
            <Button variant="outline" className="flex-1" onClick={onView}>
              {viewLabel}
            </Button>
          )}
          {onPay && status !== 'paid' && status !== 'cancelled' && (
            <Button className="flex-1" onClick={onPay}>
              {payLabel}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
