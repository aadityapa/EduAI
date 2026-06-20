import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { isAdminRole } from '@eduai/auth';
import { AdminShell } from '@/components/admin-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@eduai/ui';

export default async function BrandingPage() {
  const session = await auth();
  if (!session?.user || !isAdminRole(session.user.roles)) redirect('/login');

  return (
    <AdminShell user={session.user}>
      <h1 className="text-2xl font-semibold">White Label Branding</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Customize logos, colors, fonts, domains, and email templates per tenant
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Theme Tokens</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Primary: <span className="inline-block h-4 w-4 rounded bg-indigo-500 align-middle" /> #6366f1</p>
            <p>Secondary: #8b5cf6 · Accent: #f59e0b</p>
            <p>Font: Inter (web + mobile via ThemeProvider)</p>
            <p className="text-muted-foreground">API: PATCH billing-service /api/v1/branding</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Custom Domain & Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-muted-foreground">
            <p>• Custom domain via tenants.custom_domain</p>
            <p>• DNS verification: tenant_branding.custom_domain_verified</p>
            <p>• Email header/footer HTML templates</p>
            <p>• Mobile app name override</p>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
