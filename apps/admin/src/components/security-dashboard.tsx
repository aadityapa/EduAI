'use client';

import { Badge, Card, CardContent, CardHeader, CardTitle, KpiCard } from '@eduai/ui';
import { AlertTriangle, Lock, Shield, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/page-header';

export function SecurityDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Security Center"
        description="Authentication, access control, and security monitoring"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Security' }]}
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <KpiCard icon={<ShieldCheck className="h-5 w-5" />} label="Security Score" value="94/100" trend={{ value: 2 }} />
        <KpiCard icon={<Lock className="h-5 w-5" />} label="2FA Enabled" value="78%" />
        <KpiCard icon={<AlertTriangle className="h-5 w-5" />} label="Threats Blocked" value="12" trend={{ value: -15 }} />
        <KpiCard icon={<Shield className="h-5 w-5" />} label="Active Sessions" value="1,842" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Recent Security Events</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { event: 'Failed login attempt blocked', severity: 'warning' },
              { event: 'New admin role assigned', severity: 'info' },
              { event: 'API key rotated', severity: 'success' },
            ].map((e) => (
              <div key={e.event} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                <span>{e.event}</span>
                <Badge variant={e.severity === 'warning' ? 'warning' : e.severity === 'success' ? 'success' : 'secondary'}>
                  {e.severity}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Access Policies</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="flex justify-between"><span>Password policy</span><Badge variant="success">Enforced</Badge></p>
            <p className="flex justify-between"><span>Session timeout</span><span className="text-muted-foreground">30 min</span></p>
            <p className="flex justify-between"><span>IP allowlist</span><Badge variant="secondary">Optional</Badge></p>
            <p className="flex justify-between"><span>Audit logging</span><Badge variant="success">Enabled</Badge></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
