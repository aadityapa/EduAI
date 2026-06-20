import Link from 'next/link';
import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import { ApiError } from '@/components/api-error';
import { getClassDetail, ErpApiError } from '@/lib/erp-api';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@eduai/ui';

export default async function TeacherClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (!session.user.roles.includes('teacher')) redirect('/dashboard');

  let cls = null;
  let loadError: string | null = null;

  try {
    cls = await getClassDetail(id);
  } catch (err) {
    if (err instanceof ErpApiError && err.status === 404) notFound();
    loadError = err instanceof ErpApiError ? err.message : 'Failed to load class';
  }

  return (
    <DashboardShell title={`${cls?.name ?? 'Class'} — ${cls?.section ?? ''}`} portal="teacher">
      {loadError && <div className="mb-6"><ApiError message={loadError} /></div>}
      <div className="mb-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/teacher/attendance">Mark Attendance</Link>
        </Button>
      </div>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Class Roster</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {cls?.enrollments?.map((e) => (
            <div key={e.student.id} className="flex justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">
                  {e.student.firstName} {e.student.lastName ?? ''}
                </p>
                <p className="text-sm text-muted-foreground">{e.student.email}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
