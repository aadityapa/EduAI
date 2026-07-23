import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Users } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { ApiError } from '@/components/api-error';
import { PageMotion } from '@/components/page-motion';
import { getTeacherClasses, ErpApiError } from '@/lib/erp-api';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  StitchPageHeader,
} from '@eduai/ui';

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
      <PageMotion>
        <StitchPageHeader
          title="Class Management"
          description="Dense roster view — open a class for attendance and students."
          action={
            <Button asChild size="sm" className="rounded-full">
              <Link href="/teacher/attendance" prefetch>
                Take attendance
              </Link>
            </Button>
          }
        />

        {loadError && (
          <div className="mb-4">
            <ApiError message={loadError} />
          </div>
        )}

        {!loadError && !classes?.length && (
          <EmptyState
            icon={<Users className="h-5 w-5" />}
            title="No classes assigned"
            description="Your school admin can assign class sections to your account."
          />
        )}

        <div className="grid gap-3 md:grid-cols-2">
          {classes?.map((cls) => (
            <Card key={cls.id} className="stitch-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {cls.name} — Section {cls.section}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  {cls._count.enrollments} students enrolled
                </p>
                <Button size="sm" asChild>
                  <Link href={`/teacher/classes/${cls.id}`} prefetch>
                    View Roster
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageMotion>
    </DashboardShell>
  );
}
