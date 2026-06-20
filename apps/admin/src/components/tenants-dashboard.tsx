'use client';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, KpiCard, ProgressBar } from '@eduai/ui';
import { Activity, Building2, Globe, Plus, Users } from 'lucide-react';
import { PageHeader } from './page-header';
import { mockTenants } from '@/lib/mock-data';

export function TenantsDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tenant Management"
        description="Multi-tenant dashboard — branding, domains, users, and health"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Tenants' }]}
        actions={<Button size="sm"><Plus className="mr-2 h-4 w-4" />New Tenant</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard icon={<Building2 className="h-5 w-5" />} label="Active Tenants" value={mockTenants.length} />
        <KpiCard icon={<Users className="h-5 w-5" />} label="Total Users" value={mockTenants.reduce((s, t) => s + t.users, 0).toLocaleString()} />
        <KpiCard icon={<Activity className="h-5 w-5" />} label="Avg Health Score" value={`${Math.round(mockTenants.reduce((s, t) => s + t.health, 0) / mockTenants.length)}%`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {mockTenants.map((tenant) => (
          <Card key={tenant.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{tenant.name}</CardTitle>
                <Badge variant="secondary">{tenant.slug}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4" />{tenant.domain}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground">Users</p><p className="font-semibold">{tenant.users.toLocaleString()}</p></div>
                <div><p className="text-muted-foreground">MRR</p><p className="font-semibold">₹{tenant.mrr.toLocaleString()}</p></div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs"><span>Health Score</span><span>{tenant.health}%</span></div>
                <ProgressBar value={tenant.health} showPercentage={false} />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">Branding</Button>
                <Button variant="outline" size="sm" className="flex-1">Domains</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
