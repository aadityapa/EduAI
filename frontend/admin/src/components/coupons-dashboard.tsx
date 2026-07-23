'use client';

import { useMemo } from 'react';
import type { ColumnDef, CsvColumn } from '@eduai/ui';
import { Badge, Button, DataTable, EmptyState, KpiCard } from '@eduai/ui';
import { Percent, Plus, Tag } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { ApiError } from '@/components/api-error';
import type { CouponRecord } from '@/lib/admin-api';
import { toNumber } from '@/lib/format';

function couponStatus(coupon: CouponRecord): string {
  if (!coupon.isActive) return 'inactive';
  const now = Date.now();
  if (new Date(coupon.validUntil).getTime() < now) return 'expired';
  if (coupon.usedCount >= coupon.maxUses) return 'exhausted';
  return 'active';
}

interface CouponsDashboardProps {
  coupons: CouponRecord[] | null;
  error?: string | null;
}

type CouponRow = CouponRecord & { status: string; discount: number };

export function CouponsDashboard({ coupons, error }: CouponsDashboardProps) {
  const rows: CouponRow[] = useMemo(
    () =>
      (coupons ?? []).map((c) => ({
        ...c,
        status: couponStatus(c),
        discount: toNumber(c.discountPct),
      })),
    [coupons],
  );

  const activeCount = rows.filter((c) => c.status === 'active').length;
  const totalRedemptions = rows.reduce((sum, c) => sum + c.usedCount, 0);

  const columns: ColumnDef<CouponRow>[] = [
    { accessorKey: 'code', header: 'Code' },
    {
      accessorKey: 'discount',
      header: 'Discount',
      cell: ({ row }) => `${row.original.discount}%`,
    },
    {
      id: 'uses',
      header: 'Uses',
      cell: ({ row }) => `${row.original.usedCount}/${row.original.maxUses}`,
    },
    {
      accessorKey: 'validUntil',
      header: 'Valid until',
      cell: ({ row }) => new Date(row.original.validUntil).toLocaleDateString(),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'active' ? 'success' : 'outline'}>
          {row.original.status}
        </Badge>
      ),
    },
  ];

  const exportColumns: CsvColumn<CouponRow>[] = [
    { header: 'Code', accessor: (r) => r.code },
    { header: 'Discount %', accessor: (r) => r.discount },
    { header: 'Used', accessor: (r) => r.usedCount },
    { header: 'Max uses', accessor: (r) => r.maxUses },
    { header: 'Status', accessor: (r) => r.status },
    { header: 'Valid until', accessor: (r) => r.validUntil },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coupons"
        description="Manage discount codes and promotional offers"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Coupons' }]}
        actions={
          <Button size="sm">
            <Plus className="me-2 h-4 w-4" />
            Create Coupon
          </Button>
        }
      />

      {error && <ApiError title="Coupons unavailable" message={error} />}

      <div className="grid gap-3 sm:grid-cols-3">
        <KpiCard icon={<Tag className="h-5 w-5" />} label="Active Coupons" value={activeCount} />
        <KpiCard icon={<Percent className="h-5 w-5" />} label="Total Redemptions" value={totalRedemptions} />
        <KpiCard icon={<Tag className="h-5 w-5" />} label="Total Coupons" value={rows.length} />
      </div>

      {!error && rows.length === 0 ? (
        <EmptyState
          icon={<Tag className="h-5 w-5" />}
          title="No coupons configured"
          description="Create coupons via billing-service when ready."
        />
      ) : (
        !error && (
          <DataTable
            columns={columns}
            data={rows}
            searchKey="code"
            searchPlaceholder="Search coupons…"
            exportable
            exportFilename="coupons"
            exportColumns={exportColumns}
          />
        )
      )}
    </div>
  );
}
