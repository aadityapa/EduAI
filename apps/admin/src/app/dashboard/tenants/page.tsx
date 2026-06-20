import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { isAdminRole } from '@eduai/auth';
import { AdminShell } from '@/components/admin-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@eduai/ui';

export default async function TenantsPage() {
  const session = await auth();
  if (!session?.user || !isAdminRole(session.user.roles)) redirect('/login');

  return (
    <AdminShell user={session.user}>
      <h1 className="text-2xl font-semibold">Tenant Management</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Multi-tenant configuration: single school, coaching institutes, franchise, white-label
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Tenant</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p>Slug: demo</p>
            <p>Type: school_group</p>
            <p>Tier: professional</p>
            <p className="mt-2 text-muted-foreground">Custom domain and branding configured via tenant_branding table.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Supported Models</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-muted-foreground">
            <p>• single_school — standalone school</p>
            <p>• coaching_institute — batch-based coaching</p>
            <p>• franchise — multi-branch franchise</p>
            <p>• white_label — custom branding + domain</p>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
