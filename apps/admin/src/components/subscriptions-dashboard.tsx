'use client';

import { Badge, Card, CardContent, KpiCard } from '@eduai/ui';
import { AlertCircle, CreditCard, RefreshCw, Users } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import type { SubscriptionRecord } from '@/lib/admin-api';

function toNumber(value: number | { toNumber?: () => number } | undefined): number {
  if (value == null) return 0;
  if (typeof value === 'number') return value;
  return value.toNumber?.() ?? Number(value);
}

interface SubscriptionsDashboardProps {
  items?: SubscriptionRecord[] | null;
  error?: string | null;
}

export function SubscriptionsDashboard({ items, error }: SubscriptionsDashboardProps) {
  const subs = items ?? [];
  const activeSubs = subs.filter((s) => s.status === 'active' || s.status === 'trialing');
  const totalMrr = activeSubs.reduce((sum, s) => sum + toNumber(s.plan?.priceMonthly), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription Management"
        description="Manage tenant subscriptions, plans, and renewals"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Subscriptions' }]}
      />

      {error && (
        <Card className="border-destructive/30">
          <CardContent className="flex items-center gap-2 p-4 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" /> {error}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard icon={<CreditCard className="h-5 w-5" />} label="Active Subscriptions" value={activeSubs.length} />
        <KpiCard icon={<Users className="h-5 w-5" />} label="Total Subscriptions" value={subs.length} />
        <KpiCard icon={<RefreshCw className="h-5 w-5" />} label="Combined MRR" value={`₹${totalMrr.toLocaleString()}`} />
      </div>

      {subs.length === 0 ? (
        <p className="text-sm text-muted-foreground">No subscriptions found.</p>
      ) : (
        <div className="space-y-3">
          {subs.map((sub) => (
            <Card key={sub.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{sub.tenant?.name ?? 'Tenant'}</p>
                  <p className="text-sm text-muted-foreground">
                    {sub.plan?.name ?? 'Plan'} · {sub.tenant?.slug}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">₹{toNumber(sub.plan?.priceMonthly).toLocaleString()}/mo</span>
                  <Badge variant={sub.status === 'active' ? 'success' : 'warning'}>{sub.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
