import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { isAdminRole } from '@eduai/auth';
import { AdminShell } from '@/components/admin-shell';
import { AdminListPage } from '@/components/admin-list-page';
import { billingApi, AdminApiError } from '@/lib/admin-api';

export default async function SchoolsPage() {
  const session = await auth();
  if (!session?.user || !isAdminRole(session.user.roles)) redirect('/login');

  let analytics = null;
  let error: string | null = null;
  try {
    const { erpApi } = await import('@/lib/admin-api');
    analytics = await erpApi.getAnalytics();
  } catch (err) {
    error = err instanceof AdminApiError ? err.message : 'Failed to load school data';
  }

  const engagement = analytics?.engagement as Record<string, number> | undefined;

  return (
    <AdminShell user={session.user}>
      <AdminListPage
        title="School Management"
        description="Overview of schools and classes in your tenant"
        items={engagement ? [engagement] : null}
        error={error}
        renderItem={(item) => (
          <div key="engagement" className="grid gap-4 sm:grid-cols-3">
            <div className="rounded border p-4">
              <p className="text-sm text-muted-foreground">Students</p>
              <p className="text-2xl font-bold">{item.students as number}</p>
            </div>
            <div className="rounded border p-4">
              <p className="text-sm text-muted-foreground">Teachers</p>
              <p className="text-2xl font-bold">{item.teachers as number}</p>
            </div>
            <div className="rounded border p-4">
              <p className="text-sm text-muted-foreground">Classes</p>
              <p className="text-2xl font-bold">{item.classes as number}</p>
            </div>
          </div>
        )}
      />
    </AdminShell>
  );
}
