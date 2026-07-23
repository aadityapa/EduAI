'use client';

import { useMemo } from 'react';
import type { ColumnDef, CsvColumn } from '@eduai/ui';
import { Badge, DataTable, EmptyState, KpiCard } from '@eduai/ui';
import { DollarSign, RefreshCw, TrendingDown, TrendingUp, Users } from 'lucide-react';
import { PageHeader } from './page-header';
import { ApiError } from '@/components/api-error';
import type { InvoiceRecord } from '@/lib/admin-api';
import { formatInr, toNumber } from '@/lib/format';

export function RevenueDashboard({
  revenue,
  invoices,
  error,
}: {
  revenue: Record<string, number> | null;
  invoices: InvoiceRecord[] | null;
  error?: string;
}) {
  const mrr = revenue?.mrr ?? 0;
  const arr = revenue?.arr ?? mrr * 12;
  const churn = ((revenue?.churnRate ?? 0) * 100).toFixed(1);
  const activeSubs = revenue?.activeSubscriptions ?? 0;
  const invoiceRows = invoices ?? [];

  const columns: ColumnDef<InvoiceRecord>[] = useMemo(
    () => [
      {
        accessorKey: 'invoiceNumber',
        header: 'Invoice',
        cell: ({ row }) => row.original.invoiceNumber ?? row.original.id.slice(0, 8),
      },
      {
        id: 'tenant',
        header: 'Tenant',
        cell: ({ row }) => row.original.tenant?.name ?? '—',
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => formatInr(toNumber(row.original.amount)),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge variant={row.original.status === 'paid' ? 'default' : 'secondary'}>
            {row.original.status ?? '—'}
          </Badge>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Date',
        cell: ({ row }) =>
          row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString() : '—',
      },
    ],
    [],
  );

  const exportColumns: CsvColumn<InvoiceRecord>[] = [
    { header: 'Invoice', accessor: (r) => r.invoiceNumber ?? r.id },
    { header: 'Tenant', accessor: (r) => r.tenant?.name ?? '' },
    { header: 'Amount', accessor: (r) => toNumber(r.amount) },
    { header: 'Status', accessor: (r) => r.status ?? '' },
    { header: 'Date', accessor: (r) => r.createdAt ?? '' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Revenue Dashboard"
        description="Live MRR, ARR, subscriptions, and invoices from billing-service"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Revenue' }]}
      />

      {error && <ApiError title="Billing unavailable" message={`${error} — start billing-service on :3006`} />}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard icon={<DollarSign className="h-5 w-5" />} label="MRR" value={formatInr(mrr)} />
        <KpiCard icon={<TrendingUp className="h-5 w-5" />} label="ARR" value={formatInr(arr)} />
        <KpiCard icon={<Users className="h-5 w-5" />} label="Active Subscriptions" value={activeSubs} />
        <KpiCard icon={<TrendingDown className="h-5 w-5" />} label="Churn" value={`${churn}%`} />
        <KpiCard
          icon={<RefreshCw className="h-5 w-5" />}
          label="Total Revenue"
          value={formatInr(revenue?.totalRevenue ?? 0)}
        />
        <KpiCard
          icon={<DollarSign className="h-5 w-5" />}
          label="Paid Invoices"
          value={revenue?.paidInvoiceCount ?? 0}
        />
      </div>

      {!error && invoiceRows.length === 0 ? (
        <EmptyState
          icon={<DollarSign className="h-5 w-5" />}
          title="No invoices yet"
          description="Seed billing data or create a subscription to see invoices."
        />
      ) : (
        !error && (
          <DataTable
            columns={columns}
            data={invoiceRows}
            searchKey="invoiceNumber"
            searchPlaceholder="Search invoices…"
            exportable
            exportFilename="invoices"
            exportColumns={exportColumns}
          />
        )
      )}
    </div>
  );
}
