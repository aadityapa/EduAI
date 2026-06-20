import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import { ApiError } from '@/components/api-error';
import { getMyAssignments, ErpApiError } from '@/lib/erp-api';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@eduai/ui';

export default async function TeacherAssignmentsPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (!session.user.roles.includes('teacher')) redirect('/dashboard');

  let assignments = null;
  let loadError: string | null = null;

  try {
    assignments = await getMyAssignments();
  } catch (err) {
    loadError = err instanceof ErpApiError ? err.message : 'Failed to load assignments';
  }

  return (
    <DashboardShell title="Assignments" portal="teacher">
      {loadError && <div className="mb-6"><ApiError message={loadError} /></div>}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>My Assignments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!assignments?.length && (
            <p className="text-sm text-muted-foreground">No assignments yet.</p>
          )}
          {assignments?.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">{a.title}</p>
                <p className="text-sm text-muted-foreground">
                  {a.class.name} {a.class.section} · Due {new Date(a.dueDate).toLocaleDateString()}
                </p>
              </div>
              <Badge variant={a.status === 'published' ? 'success' : 'secondary'}>{a.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
      <p className="mt-4 text-sm text-muted-foreground">
        Create assignments via ERP API or link to{' '}
        <Link href="/teacher/ai/generator" className="text-primary underline">
          AI Question Generator
        </Link>
      </p>
    </DashboardShell>
  );
}
