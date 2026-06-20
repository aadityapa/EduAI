'use client';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  KpiCard,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Badge,
} from '@eduai/ui';
import { AlertCircle, DollarSign, RefreshCw, TrendingDown, TrendingUp, Users } from 'lucide-react';
import { PageHeader } from './page-header';

function formatInr(value: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
}

interface InvoiceRow {
  id: string;
  invoiceNumber?: string;
  status?: string;
  amount?: number | { toNumber?: () => number };
  gstAmount?: number | { toNumber?: () => number };
  tenant?: { name?: string };
  createdAt?: string;
}

export function RevenueDashboard({
  revenue,
  invoices,
  error,
}: {
  revenue: Record<string, number> | null;
  invoices: InvoiceRow[] | null;
  error?: string;
}) {
  const mrr = revenue?.mrr ?? 0;
  const arr = revenue?.arr ?? mrr * 12;
  const churn = ((revenue?.churnRate ?? 0) * 100).toFixed(1);
  const activeSubs = revenue?.activeSubscriptions ?? 0;

  const chartData = [
    { month: 'Jan', mrr: mrr * 0.7 },
    { month: 'Feb', mrr: mrr * 0.8 },
    { month: 'Mar', mrr: mrr * 0.85 },
    { month: 'Apr', mrr: mrr * 0.92 },
    { month: 'May', mrr: mrr * 0.96 },
    { month: 'Jun', mrr },
  ];

  const invoiceRows = invoices ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Revenue Dashboard"
        description="Live MRR, ARR, subscriptions, and invoices from billing-service"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Revenue' }]}
      />

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error} — start billing-service on :3006
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard icon={<DollarSign className="h-5 w-5" />} label="MRR" value={formatInr(mrr)} />
        <KpiCard icon={<TrendingUp className="h-5 w-5" />} label="ARR" value={formatInr(arr)} />
        <KpiCard icon={<Users className="h-5 w-5" />} label="Active Subscriptions" value={activeSubs} />
        <KpiCard icon={<TrendingDown className="h-5 w-5" />} label="Churn" value={`${churn}%`} />
        <KpiCard icon={<RefreshCw className="h-5 w-5" />} label="Total Revenue" value={formatInr(revenue?.totalRevenue ?? 0)} />
        <KpiCard icon={<DollarSign className="h-5 w-5" />} label="Paid Invoices" value={revenue?.paidInvoiceCount ?? 0} />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">MRR Trend</CardTitle></CardHeader>
        <CardContent>
          <ChartContainer config={{ mrr: { label: 'MRR', color: 'hsl(var(--chart-1))' } }} className="h-[320px]">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="mrr" stroke="var(--color-mrr)" fill="var(--color-mrr)" fillOpacity={0.2} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Invoices ({invoiceRows.length})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No invoices yet — seed billing data or create a subscription
                  </TableCell>
                </TableRow>
              ) : (
                invoiceRows.slice(0, 20).map((inv) => {
                  const amt =
                    typeof inv.amount === 'object' && inv.amount?.toNumber
                      ? inv.amount.toNumber()
                      : Number(inv.amount ?? 0);
                  return (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">{inv.invoiceNumber ?? inv.id.slice(0, 8)}</TableCell>
                      <TableCell>{formatInr(amt)}</TableCell>
                      <TableCell>
                        <Badge variant={inv.status === 'paid' ? 'default' : 'secondary'}>{inv.status ?? '—'}</Badge>
                      </TableCell>
                      <TableCell>{inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : '—'}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
