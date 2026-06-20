'use client';

import { Badge, Button, Card, CardContent, KpiCard } from '@eduai/ui';
import { AlertCircle, Percent, Plus, Tag } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import type { CouponRecord } from '@/lib/admin-api';

function toNumber(value: number | { toNumber?: () => number } | undefined): number {
  if (value == null) return 0;
  if (typeof value === 'number') return value;
  return value.toNumber?.() ?? Number(value);
}

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

export function CouponsDashboard({ coupons, error }: CouponsDashboardProps) {
  const items = coupons ?? [];
  const activeCount = items.filter((c) => couponStatus(c) === 'active').length;
  const totalRedemptions = items.reduce((sum, c) => sum + c.usedCount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coupons"
        description="Manage discount codes and promotional offers"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Coupons' }]}
        actions={<Button size="sm"><Plus className="mr-2 h-4 w-4" />Create Coupon</Button>}
      />

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard icon={<Tag className="h-5 w-5" />} label="Active Coupons" value={activeCount} />
        <KpiCard icon={<Percent className="h-5 w-5" />} label="Total Redemptions" value={totalRedemptions} />
        <KpiCard icon={<Tag className="h-5 w-5" />} label="Total Coupons" value={items.length} />
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No coupons configured yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((c) => {
            const status = couponStatus(c);
            return (
              <Card key={c.code}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-mono font-semibold">{c.code}</p>
                    <p className="text-sm text-muted-foreground">{toNumber(c.discountPct)}% off</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{c.usedCount}/{c.maxUses} uses</span>
                    <Badge variant={status === 'active' ? 'success' : 'outline'}>{status}</Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
