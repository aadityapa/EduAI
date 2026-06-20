import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { isAdminRole } from '@eduai/auth';
import { AdminShell } from '@/components/admin-shell';
import { AdminListPage } from '@/components/admin-list-page';
import { billingApi, AdminApiError } from '@/lib/admin-api';

export default async function AuditLogsPage() {
  const session = await auth();
  if (!session?.user || !isAdminRole(session.user.roles)) redirect('/login');
  let items = null;
  let error: string | null = null;
  try { items = await billingApi.getAuditLogs(); } catch (e) { error = e instanceof AdminApiError ? e.message : 'Failed'; }
  return (
    <AdminShell user={session.user}>
      <AdminListPage title="Audit Logs" items={items} error={error}
        renderItem={(item) => (
          <div key={String(item.id)} className="rounded border p-3 text-sm">
            <p className="font-medium">{String(item.action)}</p>
            <p className="text-muted-foreground">{String(item.resourceType ?? '—')} · {new Date(String(item.createdAt)).toLocaleString()}</p>
          </div>
        )} />
    </AdminShell>
  );
}
