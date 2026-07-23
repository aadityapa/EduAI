'use client';

import { useMemo } from 'react';
import type { ColumnDef, CsvColumn } from '@eduai/ui';
import { Badge, DataTable, EmptyState, KpiCard } from '@eduai/ui';
import { CreditCard, RefreshCw, Users } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { ApiError } from '@/components/api-error';
import type { SubscriptionRecord } from '@/lib/admin-api';
import { formatInr, toNumber } from '@/lib/format';

interface SubscriptionsDashboardProps {
  items?: SubscriptionRecord[] | null;
  error?: string | null;
}

type SubRow = {
  id: string;
  tenant: string;
  slug: string;
  plan: string;
  mrr: number;
  status: string;
};

export function SubscriptionsDashboard({ items, error }: SubscriptionsDashboardProps) {
  const rows: SubRow[] = useMemo(
    () =>
      (items ?? []).map((s) => ({
        id: s.id,
        tenant: s.tenant?.name ?? 'Tenant',
        slug: s.tenant?.slug ?? '—',
        plan: s.plan?.name ?? 'Plan',
        mrr: toNumber(s.plan?.priceMonthly),
        status: s.status,
      })),
    [items],
  );

  const activeSubs = rows.filter((s) => s.status === 'active' || s.status === 'trialing');
  const totalMrr = activeSubs.reduce((sum, s) => sum + s.mrr, 0);

  const columns: ColumnDef<SubRow>[] = [
    { accessorKey: 'tenant', header: 'Tenant' },
    { accessorKey: 'slug', header: 'Slug' },
    { accessorKey: 'plan', header: 'Plan' },
    {
      accessorKey: 'mrr',
      header: 'MRR',
      cell: ({ row }) => formatInr(row.original.mrr),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'active' ? 'success' : 'warning'}>
          {row.original.status}
        </Badge>
      ),
    },
  ];

  const exportColumns: CsvColumn<SubRow>[] = [
    { header: 'Tenant', accessor: (r) => r.tenant },
    { header: 'Slug', accessor: (r) => r.slug },
    { header: 'Plan', accessor: (r) => r.plan },
    { header: 'MRR', accessor: (r) => r.mrr },
    { header: 'Status', accessor: (r) => r.status },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription Management"
        description="Manage tenant subscriptions, plans, and renewals"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Subscriptions' }]}
      />

      {error && <ApiError title="Subscriptions unavailable" message={error} />}

      <div className="grid gap-3 sm:grid-cols-3">
        <KpiCard icon={<CreditCard className="h-5 w-5" />} label="Active Subscriptions" value={activeSubs.length} />
        <KpiCard icon={<Users className="h-5 w-5" />} label="Total Subscriptions" value={rows.length} />
        <KpiCard icon={<RefreshCw className="h-5 w-5" />} label="Combined MRR" value={formatInr(totalMrr)} />
      </div>

      {!error && rows.length === 0 ? (
        <EmptyState
          icon={<CreditCard className="h-5 w-5" />}
          title="No subscriptions"
          description="Subscriptions appear when billing data is seeded."
        />
      ) : (
        !error && (
          <DataTable
            columns={columns}
            data={rows}
            searchKey="tenant"
            searchPlaceholder="Search subscriptions…"
            exportable
            exportFilename="subscriptions"
            exportColumns={exportColumns}
          />
        )
      )}
    </div>
  );
}
