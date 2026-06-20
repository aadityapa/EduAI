import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@eduai/ui';

export default async function TeacherDashboard() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (!session.user.roles.includes('teacher')) redirect('/dashboard');

  return (
    <DashboardShell title="Teacher Dashboard" portal="teacher">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Class Roster</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Class management ships in Sprint 12.
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Pending Grading</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">No submissions yet.</CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
