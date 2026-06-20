import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { isAdminRole } from '@eduai/auth';
import { AdminShell } from '@/components/admin-shell';
import { erpApi, AdminApiError } from '@/lib/admin-api';
import { Card, CardContent, CardHeader, CardTitle } from '@eduai/ui';

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user || !isAdminRole(session.user.roles)) redirect('/login');

  let data = null;
  let error: string | null = null;
  try {
    data = await erpApi.getAnalytics();
  } catch (err) {
    error = err instanceof AdminApiError ? err.message : 'Failed to load analytics';
  }

  const engagement = data?.engagement as Record<string, number> | undefined;
  const attendance = data?.attendance as { rate: number; marked: number } | undefined;
  const ai = data?.ai as { totalTokens: number; totalQueries: number } | undefined;

  return (
    <AdminShell user={session.user}>
      <h1 className="text-2xl font-semibold">Advanced Analytics</h1>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Engagement</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-1">
            <p>Students: {engagement?.students ?? 0}</p>
            <p>Teachers: {engagement?.teachers ?? 0}</p>
            <p>Active Assignments: {engagement?.activeAssignments ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Attendance Today</CardTitle></CardHeader>
          <CardContent className="text-sm">
            <p className="text-2xl font-bold">{attendance?.rate ?? 0}%</p>
            <p className="text-muted-foreground">{attendance?.marked ?? 0} records marked</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>AI Usage</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-1">
            <p>Tokens: {(ai?.totalTokens ?? 0).toLocaleString()}</p>
            <p>Queries: {ai?.totalQueries ?? 0}</p>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
