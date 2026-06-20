'use client';

import { Badge, Button, Card, CardContent, KpiCard } from '@eduai/ui';
import { Percent, Plus, Tag } from 'lucide-react';
import { PageHeader } from '@/components/page-header';

const coupons = [
  { code: 'LAUNCH20', discount: '20%', uses: 142, max: 500, status: 'active' },
  { code: 'EDU50', discount: '₹500 off', uses: 38, max: 100, status: 'active' },
  { code: 'TRIAL30', discount: '30 days free', uses: 89, max: 200, status: 'expired' },
];

export function CouponsDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Coupons"
        description="Manage discount codes and promotional offers"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Coupons' }]}
        actions={<Button size="sm"><Plus className="mr-2 h-4 w-4" />Create Coupon</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard icon={<Tag className="h-5 w-5" />} label="Active Coupons" value="2" />
        <KpiCard icon={<Percent className="h-5 w-5" />} label="Total Redemptions" value="269" trend={{ value: 18 }} />
        <KpiCard icon={<Tag className="h-5 w-5" />} label="Revenue Impact" value="₹1.2L" />
      </div>

      <div className="space-y-3">
        {coupons.map((c) => (
          <Card key={c.code}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-mono font-semibold">{c.code}</p>
                <p className="text-sm text-muted-foreground">{c.discount}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{c.uses}/{c.max} uses</span>
                <Badge variant={c.status === 'active' ? 'success' : 'outline'}>{c.status}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
