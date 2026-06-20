'use client';

import { Badge, Card, CardContent, KpiCard } from '@eduai/ui';
import { CreditCard, RefreshCw, Users } from 'lucide-react';
import { PageHeader } from '@/components/page-header';

const mockSubscriptions = [
  { id: '1', tenant: 'Demo Academy', plan: 'Enterprise', status: 'active', mrr: 85000, users: 5200 },
  { id: '2', tenant: 'Sunrise Schools', plan: 'Pro', status: 'active', mrr: 52000, users: 3200 },
  { id: '3', tenant: 'Green Valley', plan: 'Starter', status: 'trial', mrr: 0, users: 1800 },
];

interface SubscriptionsDashboardProps {
  items?: unknown[] | null;
  error?: string | null;
}

export function SubscriptionsDashboard({ items, error }: SubscriptionsDashboardProps) {
  const subs = items?.length ? items : mockSubscriptions;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription Management"
        description="Manage tenant subscriptions, plans, and renewals"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Subscriptions' }]}
      />

      {error && (
        <Card className="border-destructive/30">
          <CardContent className="p-4 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard icon={<CreditCard className="h-5 w-5" />} label="Active Subscriptions" value={subs.length} />
        <KpiCard icon={<Users className="h-5 w-5" />} label="Total Users" value="10,200" />
        <KpiCard icon={<RefreshCw className="h-5 w-5" />} label="Renewals Due" value="8" />
      </div>

      <div className="space-y-3">
        {(subs as typeof mockSubscriptions).map((sub) => (
          <Card key={String(sub.id ?? sub.tenant)}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{sub.tenant ?? 'Tenant'}</p>
                <p className="text-sm text-muted-foreground">{sub.plan ?? sub.status} plan</p>
              </div>
              <div className="flex items-center gap-4">
                {sub.mrr !== undefined && <span className="font-semibold">₹{sub.mrr.toLocaleString()}/mo</span>}
                <Badge variant={sub.status === 'active' ? 'success' : 'warning'}>{sub.status}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
