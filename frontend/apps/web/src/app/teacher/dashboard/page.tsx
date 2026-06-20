import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import { ApiError } from '@/components/api-error';
import { PageMotion } from '@/components/page-motion';
import { getTeacherDashboard, ErpApiError } from '@/lib/erp-api';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@eduai/ui';

export default async function TeacherDashboard() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (!session.user.roles.includes('teacher')) redirect('/dashboard');

  let dashboard = null;
  let loadError: string | null = null;

  try {
    dashboard = await getTeacherDashboard();
  } catch (err) {
    loadError = err instanceof ErpApiError ? err.message : 'Failed to load dashboard';
  }

  return (
    <DashboardShell title="Teacher Dashboard" portal="teacher">
      <PageMotion>
        {loadError && <div className="mb-6"><ApiError message={loadError} /></div>}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">My Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{dashboard?.classCount ?? 0}</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{dashboard?.activeAssignments ?? 0}</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Grading</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{dashboard?.pendingGrading ?? 0}</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Attendance Today</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{dashboard?.todayAttendanceMarked ?? 0}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>My Classes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!dashboard?.classes?.length && (
                <p className="text-sm text-muted-foreground">No classes assigned yet.</p>
              )}
              {dashboard?.classes?.map((cls) => (
                <div key={cls.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">
                      {cls.name} — {cls.section}
                    </p>
                    <p className="text-sm text-muted-foreground">{cls.studentCount} students</p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/teacher/classes/${cls.id}`}>Manage</Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button asChild>
                <Link href="/teacher/attendance">Mark Attendance</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/teacher/assignments">Assignments</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/teacher/quizzes/builder">Quiz Builder</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/teacher/ai/generator">AI Question Generator</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/teacher/reports">Reports</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageMotion>
    </DashboardShell>
  );
}
