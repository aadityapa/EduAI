import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import { ApiError } from '@/components/api-error';
import { getTeacherClasses, ErpApiError } from '@/lib/erp-api';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@eduai/ui';

export default async function TeacherClassesPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (!session.user.roles.includes('teacher')) redirect('/dashboard');

  let classes = null;
  let loadError: string | null = null;

  try {
    classes = await getTeacherClasses();
  } catch (err) {
    loadError = err instanceof ErpApiError ? err.message : 'Failed to load classes';
  }

  return (
    <DashboardShell title="Class Management" portal="teacher">
      {loadError && <div className="mb-6"><ApiError message={loadError} /></div>}
      <div className="grid gap-4 md:grid-cols-2">
        {classes?.map((cls) => (
          <Card key={cls.id} className="glass-card">
            <CardHeader>
              <CardTitle>
                {cls.name} — Section {cls.section}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{cls._count.enrollments} students enrolled</p>
              <Button size="sm" asChild>
                <Link href={`/teacher/classes/${cls.id}`}>View Roster</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
