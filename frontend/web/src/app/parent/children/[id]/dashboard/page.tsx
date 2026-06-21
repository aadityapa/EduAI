import Link from 'next/link';
import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import { ApiError } from '@/components/api-error';
import { getParentChildDashboard, ErpApiError } from '@/lib/erp-api';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@eduai/ui';

export default async function ParentChildDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (!session.user.roles.includes('parent')) redirect('/dashboard');

  let data: Record<string, unknown> | null = null;
  let loadError: string | null = null;

  try {
    data = await getParentChildDashboard(id);
  } catch (err) {
    if (err instanceof ErpApiError && err.status === 403) notFound();
    loadError = err instanceof ErpApiError ? err.message : 'Failed to load child dashboard';
  }

  const attendance = data?.attendance as { summary?: { present: number; absent: number; total: number } } | undefined;
  const fees = data?.fees as { summary?: { totalDue: number } } | undefined;
  const homework = data?.homework as unknown[] | undefined;

  return (
    <DashboardShell title="Child Dashboard" portal="parent">
      {loadError && <div className="mb-6"><ApiError message={loadError} /></div>}
      <div className="mb-4 flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/parent/children/${id}/report`}>Learning Report</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/parent/fees">Fee Status</Link>
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {attendance?.summary?.present ?? 0}/{attendance?.summary?.total ?? 0} present
            </p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Fees Due</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₹{(fees?.summary?.totalDue ?? 0).toLocaleString('en-IN')}</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Homework</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{homework?.length ?? 0} assignments</p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
