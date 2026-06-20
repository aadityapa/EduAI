import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { isAdminRole } from '@eduai/auth';
import { AdminShell } from '@/components/admin-shell';
import { AdminListPage } from '@/components/admin-list-page';
import { billingApi, AdminApiError } from '@/lib/admin-api';

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user || !isAdminRole(session.user.roles)) redirect('/login');

  let revenue = null;
  let error: string | null = null;
  try {
    revenue = await billingApi.getRevenue();
  } catch (err) {
    error = err instanceof AdminApiError ? err.message : 'Failed to load revenue';
  }

  return (
    <AdminShell user={session.user}>
      <h1 className="text-2xl font-semibold">Revenue Management</h1>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">MRR</p>
          <p className="text-2xl font-bold">₹{(revenue?.mrr ?? 0).toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">ARR</p>
          <p className="text-2xl font-bold">₹{(revenue?.arr ?? 0).toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold">₹{(revenue?.totalRevenue ?? 0).toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Active Subscriptions</p>
          <p className="text-2xl font-bold">{revenue?.activeSubscriptions ?? 0}</p>
        </div>
      </div>
    </AdminShell>
  );
}
