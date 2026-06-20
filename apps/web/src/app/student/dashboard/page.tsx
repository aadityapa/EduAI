import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { BookOpen, Coins, Flame, Sparkles, TrendingUp } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { ApiError } from '@/components/api-error';
import { PageMotion } from '@/components/page-motion';
import {
  getCourses,
  getGamification,
  getMyEnrollments,
  getMyProgress,
  LearningApiError,
} from '@/lib/learning-api';
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CourseCard,
  ProgressBar,
  StatCard,
  StreakBadge,
  XpBadge,
} from '@eduai/ui';

export default async function StudentDashboard() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (!session.user.roles.includes('student')) redirect('/dashboard');

  const firstName = session.user.name?.split(' ')[0] ?? 'Student';

  let gamification = null;
  let progress = null;
  let enrollments = null;
  let recommendations = null;
  let loadError: string | null = null;

  try {
    [gamification, progress, enrollments, recommendations] = await Promise.all([
      getGamification(),
      getMyProgress(),
      getMyEnrollments(),
      getCourses({ classLevel: 8 }),
    ]);
  } catch (err) {
    loadError = err instanceof LearningApiError ? err.message : 'Failed to load dashboard data';
  }

  const enrolledIds = new Set(enrollments?.map((e) => e.courseId) ?? []);
  const suggested =
    recommendations?.filter((course) => !enrolledIds.has(course.id)).slice(0, 3) ?? [];

  return (
    <DashboardShell title="Student Dashboard" portal="student">
      <PageMotion>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">Welcome back, {firstName}</h2>
            <p className="text-sm text-muted-foreground">Continue your learning journey</p>
          </div>

          {loadError && <ApiError message={loadError} />}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={<Sparkles className="h-5 w-5" />}
              label="XP"
              value={
                gamification ? (
                  <XpBadge xp={gamification.xp.totalXp} size="lg" showIcon={false} />
                ) : (
                  '—'
                )
              }
              description={
                gamification ? `Level ${gamification.xp.currentLevel}` : undefined
              }
            />
            <StatCard
              icon={<Flame className="h-5 w-5" />}
              label="Streak"
              value={
                gamification ? (
                  <StreakBadge days={gamification.streak.currentStreak} size="lg" showIcon={false} />
                ) : (
                  '—'
                )
              }
              description={
                gamification
                  ? `Longest: ${gamification.streak.longestStreak} days`
                  : undefined
              }
            />
            <StatCard
              icon={<Coins className="h-5 w-5" />}
              label="Coins"
              value={gamification?.coins.balance ?? '—'}
            />
            <StatCard
              icon={<TrendingUp className="h-5 w-5" />}
              label="Progress"
              value={
                progress
                  ? `${progress.summary.completed}/${progress.summary.total || progress.summary.completed} lessons`
                  : '—'
              }
              description={
                progress
                  ? `${Math.round(progress.summary.totalTimeSpentSeconds / 60)} min studied`
                  : undefined
              }
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">My Courses</CardTitle>
                <Link href="/student/courses" className="text-sm text-primary hover:underline">
                  View all
                </Link>
              </CardHeader>
              <CardContent className="space-y-3">
                {!enrollments?.length ? (
                  <p className="text-sm text-muted-foreground">
                    You are not enrolled in any courses yet. Browse the catalog to get started.
                  </p>
                ) : (
                  enrollments.slice(0, 3).map((enrollment) => (
                    <Link
                      key={enrollment.id}
                      href={`/student/courses/${enrollment.courseId}`}
                      className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{enrollment.course.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {enrollment.course.subject?.name ?? 'Course'} · Class{' '}
                          {enrollment.course.classLevel}
                        </p>
                      </div>
                      <Badge variant="secondary">Enrolled</Badge>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Continue Learning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!progress?.lessons.length ? (
                  <p className="text-sm text-muted-foreground">
                    Start a lesson from your courses or the learning hub.
                  </p>
                ) : (
                  progress.lessons.slice(0, 4).map((record) => (
                    <Link
                      key={record.id}
                      href={`/student/lessons/${record.lessonId}`}
                      className="block space-y-2 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-medium">{record.lesson.title}</p>
                        <Badge
                          variant={
                            record.status === 'completed'
                              ? 'success'
                              : record.status === 'in_progress'
                                ? 'warning'
                                : 'secondary'
                          }
                        >
                          {record.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {record.lesson.chapter.subject.name} · {record.lesson.chapter.name}
                      </p>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {suggested.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recommended for you</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {suggested.map((course) => (
                  <Link key={course.id} href={`/student/courses/${course.id}`}>
                    <CourseCard
                      title={course.title}
                      description={course.description ?? undefined}
                      subject={course.subject.name}
                      lessonCount={undefined}
                      status="not_started"
                      imageUrl={course.thumbnailUrl ?? undefined}
                      actionLabel="View course"
                      className="h-full cursor-pointer transition-transform hover:scale-[1.01]"
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {progress && progress.summary.total > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Overall progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ProgressBar
                  value={
                    progress.summary.total > 0
                      ? (progress.summary.completed / progress.summary.total) * 100
                      : 0
                  }
                  label="Lessons completed"
                  showPercentage
                  variant="lesson"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </PageMotion>
    </DashboardShell>
  );
}
