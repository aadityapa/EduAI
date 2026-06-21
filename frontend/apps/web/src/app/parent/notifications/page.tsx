import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import { ApiError } from '@/components/api-error';
import { getMyNotifications, ErpApiError } from '@/lib/erp-api';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@eduai/ui';

export default async function ParentNotificationsPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (!session.user.roles.includes('parent')) redirect('/dashboard');

  let notifications = null;
  let loadError: string | null = null;

  try {
    notifications = await getMyNotifications();
  } catch (err) {
    loadError = err instanceof ErpApiError ? err.message : 'Failed to load notifications';
  }

  return (
    <DashboardShell title="Notifications" portal="parent">
      {loadError && <div className="mb-6"><ApiError message={loadError} /></div>}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!notifications?.length && (
            <p className="text-sm text-muted-foreground">No notifications yet.</p>
          )}
          {notifications?.map((n) => (
            <div key={n.id} className="flex items-start justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.body}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
              {!n.readAt && <Badge variant="warning">New</Badge>}
            </div>
          ))}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
