import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { ClipboardList, GraduationCap, Users } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { ApiError } from '@/components/api-error';
import { PageMotion } from '@/components/page-motion';
import { getTeacherDashboard, ErpApiError } from '@/lib/erp-api';
import {
  EmptyState,
  KpiCard,
  ProgressBar,
  StitchPageHeader,
  StitchScheduleCarousel,
  StitchTeacherAiPromo,
  StitchToGradeList,
} from '@eduai/ui';

export default async function TeacherDashboard() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (!session.user.roles.includes('teacher')) redirect('/dashboard');

  const firstName = session.user.name?.split(' ')[0] ?? 'Teacher';

  let dashboard = null;
  let loadError: string | null = null;

  try {
    dashboard = await getTeacherDashboard();
  } catch (err) {
    loadError = err instanceof ErpApiError ? err.message : 'Failed to load dashboard';
  }

  const classCount = dashboard?.classCount ?? 0;
  const scheduleItems =
    dashboard?.classes?.slice(0, 3).map((cls, i) => ({
      id: cls.id,
      time: ['10:00 AM', '11:30 AM', '01:15 PM'][i] ?? '02:00 PM',
      title: `${cls.name} — ${cls.section}`,
      location: `${cls.studentCount} students`,
      accent: (['primary', 'secondary', 'muted'] as const)[i] ?? 'primary',
      status: (i === 0 ? 'active' : 'scheduled') as 'active' | 'scheduled',
      href: `/teacher/classes/${cls.id}`,
    })) ?? [];

  return (
    <DashboardShell title="Teacher Dashboard" portal="teacher">
      <PageMotion>
        {loadError && (
          <div className="mb-4">
            <ApiError message={loadError} />
          </div>
        )}

        <StitchPageHeader
          title={`Good morning, ${firstName}!`}
          description={`You have ${classCount} classes on your roster today.`}
          action={
            <Link
              href="/teacher/quizzes/builder"
              prefetch
              className="inline-flex h-9 items-center rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground"
            >
              Quiz Builder
            </Link>
          }
        />

        <div className="mb-6 grid gap-4 md:grid-cols-12">
          <StitchTeacherAiPromo href="/teacher/ai/generator" className="md:col-span-8" />
          <div className="stitch-card flex flex-col justify-between p-4 md:col-span-4 md:p-5">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-muted-foreground">
                  Daily Attendance
                </span>
                <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success">
                  Today
                </span>
              </div>
              <p className="text-3xl font-bold">{dashboard?.todayAttendanceMarked ?? 0} marked</p>
              <p className="mt-1 text-sm text-muted-foreground">Across all classes</p>
            </div>
            <ProgressBar
              value={
                classCount
                  ? Math.min(100, ((dashboard?.todayAttendanceMarked ?? 0) / classCount) * 100)
                  : 0
              }
              showPercentage={false}
              variant="lesson"
              className="mt-4"
            />
          </div>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard icon={<GraduationCap className="h-5 w-5" />} label="My Classes" value={classCount} />
          <KpiCard
            icon={<ClipboardList className="h-5 w-5" />}
            label="Active Assignments"
            value={dashboard?.activeAssignments ?? 0}
          />
          <KpiCard
            icon={<Users className="h-5 w-5" />}
            label="Pending Grading"
            value={dashboard?.pendingGrading ?? 0}
          />
          <KpiCard
            icon={<GraduationCap className="h-5 w-5" />}
            label="Students"
            value={dashboard?.classes?.reduce((sum, c) => sum + c.studentCount, 0) ?? 0}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <section className="lg:col-span-7">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold">Today&apos;s Schedule</h3>
              <Link
                href="/teacher/classes"
                prefetch
                className="text-sm font-bold text-primary hover:underline"
              >
                View Calendar
              </Link>
            </div>
            {scheduleItems.length ? (
              <StitchScheduleCarousel items={scheduleItems} />
            ) : (
              <EmptyState
                title="No classes scheduled"
                description="Your roster will appear here once classes are assigned."
                action={
                  <Link
                    href="/teacher/classes"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Manage classes
                  </Link>
                }
              />
            )}
          </section>

          <section className="lg:col-span-5">
            <StitchToGradeList
              activeCount={dashboard?.pendingGrading ?? 0}
              items={
                dashboard?.pendingGrading
                  ? [
                      {
                        id: '1',
                        title: 'Pending quiz submissions',
                        meta: `${dashboard.pendingGrading} items awaiting review`,
                        href: '/teacher/assignments',
                      },
                    ]
                  : [{ id: '0', title: 'All caught up!', meta: 'No submissions to grade' }]
              }
            />
          </section>
        </div>

        <div className="mt-6 stitch-card p-4 md:p-5">
          <h3 className="mb-3 text-base font-semibold">My Classes</h3>
          {!dashboard?.classes?.length ? (
            <EmptyState
              title="No classes assigned yet"
              description="Ask your school admin to assign you to a class roster."
              className="border-0 bg-transparent py-6"
            />
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {dashboard.classes.map((cls) => (
                <Link
                  key={cls.id}
                  href={`/teacher/classes/${cls.id}`}
                  prefetch
                  className="rounded-lg border px-3 py-3 transition-colors hover:bg-muted/50"
                >
                  <p className="font-semibold">
                    {cls.name} — {cls.section}
                  </p>
                  <p className="text-sm text-muted-foreground">{cls.studentCount} students</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </PageMotion>
    </DashboardShell>
  );
}
