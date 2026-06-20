'use client';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, KpiCard } from '@eduai/ui';
import { AlertCircle, Building2, Plus } from 'lucide-react';
import { PageHeader } from './page-header';
import type { SubscriptionRecord } from '@/lib/admin-api';

function toNumber(value: number | { toNumber?: () => number } | undefined): number {
  if (value == null) return 0;
  if (typeof value === 'number') return value;
  return value.toNumber?.() ?? Number(value);
}

interface TenantsDashboardProps {
  subscriptions: SubscriptionRecord[] | null;
  error?: string | null;
}

export function TenantsDashboard({ subscriptions, error }: TenantsDashboardProps) {
  const subs = subscriptions ?? [];
  const activeTenants = subs.filter((s) => s.status === 'active' || s.status === 'trialing');
  const totalMrr = activeTenants.reduce((sum, s) => sum + toNumber(s.plan?.priceMonthly), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tenant Management"
        description="Multi-tenant dashboard — subscriptions, plans, and billing status"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Tenants' }]}
        actions={<Button size="sm"><Plus className="mr-2 h-4 w-4" />New Tenant</Button>}
      />

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard icon={<Building2 className="h-5 w-5" />} label="Active Tenants" value={activeTenants.length} />
        <KpiCard icon={<Building2 className="h-5 w-5" />} label="Total Tenants" value={subs.length} />
        <KpiCard icon={<Building2 className="h-5 w-5" />} label="Combined MRR" value={`₹${totalMrr.toLocaleString()}`} />
      </div>

      {subs.length === 0 ? (
        <p className="text-sm text-muted-foreground">No tenant subscriptions found.</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {subs.map((sub) => (
            <Card key={sub.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{sub.tenant?.name ?? 'Tenant'}</CardTitle>
                  <Badge variant="secondary">{sub.tenant?.slug}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-muted-foreground">Plan</p><p className="font-semibold">{sub.plan?.name ?? '—'}</p></div>
                  <div><p className="text-muted-foreground">MRR</p><p className="font-semibold">₹{toNumber(sub.plan?.priceMonthly).toLocaleString()}</p></div>
                </div>
                <Badge variant={sub.status === 'active' ? 'success' : 'warning'}>{sub.status}</Badge>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">Branding</Button>
                  <Button variant="outline" size="sm" className="flex-1">Billing</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
