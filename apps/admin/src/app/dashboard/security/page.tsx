import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { isAdminRole } from '@eduai/auth';
import { AdminShell } from '@/components/admin-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@eduai/ui';

export default async function SecurityPage() {
  const session = await auth();
  if (!session?.user || !isAdminRole(session.user.roles)) redirect('/login');

  return (
    <AdminShell user={session.user}>
      <h1 className="text-2xl font-semibold">Security Dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Row Level Security</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            PostgreSQL RLS enabled on ERP and billing tables. Tenant context set via app.tenant_id session variable.
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Rate Limiting</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            NestJS Throttler active: 120 req/min default, 20 req/15min on auth endpoints. Redis-backed limits when REDIS_URL configured.
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Permission Matrix</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            RBAC enforced via @eduai/auth permission guards on all ERP and billing endpoints.
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Activity Logging</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            ERP actions logged to activity_logs. Audit trail in audit_logs table with 90-day retention policy.
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
