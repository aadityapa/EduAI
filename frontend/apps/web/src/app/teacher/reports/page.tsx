import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@eduai/ui';

export default async function TeacherReportsPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (!session.user.roles.includes('teacher')) redirect('/dashboard');

  return (
    <DashboardShell title="Reports" portal="teacher">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Class Performance Reports</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          View student progress, quiz scores, and attendance summaries from the Teacher Dashboard and Class Management pages.
          Export functionality ships in Sprint 5.
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
