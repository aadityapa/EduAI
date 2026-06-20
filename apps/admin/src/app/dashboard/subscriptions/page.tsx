import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { isAdminRole } from '@eduai/auth';
import { AdminShell } from '@/components/admin-shell';
import { AdminListPage } from '@/components/admin-list-page';
import { billingApi, AdminApiError } from '@/lib/admin-api';

export default async function SubscriptionsPage() {
  const session = await auth();
  if (!session?.user || !isAdminRole(session.user.roles)) redirect('/login');

  let items = null;
  let error: string | null = null;
  try {
    items = await billingApi.getSubscriptions();
  } catch (err) {
    error = err instanceof AdminApiError ? err.message : 'Failed to load subscriptions';
  }

  return (
    <AdminShell user={session.user}>
      <AdminListPage
        title="Subscription Management"
        items={items}
        error={error}
        renderItem={(item) => (
          <div key={String(item.id)} className="rounded border p-3 text-sm">
            <p className="font-medium">{String(item.status)}</p>
            <p className="text-muted-foreground">Tenant subscription</p>
          </div>
        )}
      />
    </AdminShell>
  );
}
