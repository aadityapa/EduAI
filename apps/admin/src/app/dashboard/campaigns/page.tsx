import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { isAdminRole } from '@eduai/auth';
import { AdminShell } from '@/components/admin-shell';
import { AdminListPage } from '@/components/admin-list-page';
import { billingApi, AdminApiError } from '@/lib/admin-api';

export default async function CampaignsPage() {
  const session = await auth();
  if (!session?.user || !isAdminRole(session.user.roles)) redirect('/login');
  let items = null;
  let error: string | null = null;
  try { items = await billingApi.getCampaigns(); } catch (e) { error = e instanceof AdminApiError ? e.message : 'Failed'; }
  return (
    <AdminShell user={session.user}>
      <AdminListPage title="Marketing Campaigns" items={items} error={error}
        renderItem={(item) => (
          <div key={String(item.id)} className="rounded border p-3 text-sm">
            <p className="font-medium">{String(item.name)}</p>
            <p className="text-muted-foreground">{String(item.channel)} · {String(item.status)}</p>
          </div>
        )} />
    </AdminShell>
  );
}
