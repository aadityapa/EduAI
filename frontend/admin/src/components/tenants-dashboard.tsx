'use client';

import { useMemo } from 'react';
import type { ColumnDef, CsvColumn } from '@eduai/ui';
import { Badge, Button, DataTable, EmptyState, KpiCard } from '@eduai/ui';
import { Building2, Plus } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from './page-header';
import { ApiError } from '@/components/api-error';
import type { SubscriptionRecord } from '@/lib/admin-api';
import { formatInr, toNumber } from '@/lib/format';

interface TenantsDashboardProps {
  subscriptions: SubscriptionRecord[] | null;
  error?: string | null;
}

type TenantRow = {
  id: string;
  name: string;
  slug: string;
  plan: string;
  mrr: number;
  status: string;
};

export function TenantsDashboard({ subscriptions, error }: TenantsDashboardProps) {
  const rows: TenantRow[] = useMemo(
    () =>
      (subscriptions ?? []).map((s) => ({
        id: s.tenant?.id ?? s.id,
        name: s.tenant?.name ?? 'Tenant',
        slug: s.tenant?.slug ?? '—',
        plan: s.plan?.name ?? '—',
        mrr: toNumber(s.plan?.priceMonthly),
        status: s.status,
      })),
    [subscriptions],
  );

  const activeTenants = rows.filter((s) => s.status === 'active' || s.status === 'trialing');
  const totalMrr = activeTenants.reduce((sum, s) => sum + s.mrr, 0);

  const columns: ColumnDef<TenantRow>[] = [
    { accessorKey: 'name', header: 'Tenant' },
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
    {
      id: 'actions',
      cell: () => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/branding">Branding</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/billing">Billing</Link>
          </Button>
        </div>
      ),
    },
  ];

  const exportColumns: CsvColumn<TenantRow>[] = [
    { header: 'Name', accessor: (r) => r.name },
    { header: 'Slug', accessor: (r) => r.slug },
    { header: 'Plan', accessor: (r) => r.plan },
    { header: 'MRR', accessor: (r) => r.mrr },
    { header: 'Status', accessor: (r) => r.status },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tenant Management"
        description="Multi-tenant dashboard — subscriptions, plans, and billing status"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Tenants' }]}
        actions={
          <Button size="sm">
            <Plus className="me-2 h-4 w-4" />
            New Tenant
          </Button>
        }
      />

      {error && <ApiError title="Tenants unavailable" message={error} />}

      <div className="grid gap-3 sm:grid-cols-3">
        <KpiCard icon={<Building2 className="h-5 w-5" />} label="Active Tenants" value={activeTenants.length} />
        <KpiCard icon={<Building2 className="h-5 w-5" />} label="Total Tenants" value={rows.length} />
        <KpiCard icon={<Building2 className="h-5 w-5" />} label="Combined MRR" value={formatInr(totalMrr)} />
      </div>

      {!error && rows.length === 0 ? (
        <EmptyState
          icon={<Building2 className="h-5 w-5" />}
          title="No tenant subscriptions"
          description="Subscriptions appear when billing-service is seeded."
        />
      ) : (
        !error && (
          <DataTable
            columns={columns}
            data={rows}
            searchKey="name"
            searchPlaceholder="Search tenants…"
            exportable
            exportFilename="tenants"
            exportColumns={exportColumns}
          />
        )
      )}
    </div>
  );
}
