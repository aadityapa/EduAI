import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { BookOpen, Flame, Sparkles, TrendingUp } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { ApiError } from '@/components/api-error';
import { PageMotion } from '@/components/page-motion';
import {
  getGamification,
  getMyEnrollments,
  getMyProgress,
  LearningApiError,
} from '@/lib/learning-api';
import {
  KpiCard,
  STITCH_IMAGES,
  StitchAiPromo,
  StitchInsightPanel,
  StitchRecentCourseCard,
  StitchTaskList,
  StitchWelcomeBanner,
} from '@eduai/ui';

const courseAccents = ['primary', 'secondary', 'tertiary'] as const;

export default async function StudentDashboard() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (!session.user.roles.includes('student')) redirect('/dashboard');

  const firstName = session.user.name?.split(' ')[0] ?? 'Student';

  let gamification = null;
  let progress = null;
  let enrollments = null;
  let loadError: string | null = null;

  try {
    [gamification, progress, enrollments] = await Promise.all([
      getGamification(),
      getMyProgress(),
      getMyEnrollments(),
    ]);
  } catch (err) {
    loadError = err instanceof LearningApiError ? err.message : 'Failed to load dashboard data';
  }

  const continueLesson = progress?.lessons.find((r) => r.status === 'in_progress') ?? progress?.lessons[0];
  const continueHref = continueLesson
    ? `/student/lessons/${continueLesson.lessonId}`
    : enrollments?.[0]
      ? `/student/courses/${enrollments[0].courseId}`
      : '/student/hub';

  const streakDays = gamification?.streak.currentStreak ?? 0;
  const welcomeDescription = streakDays
    ? `You're on a ${streakDays}-day streak. Keep it up!`
    : 'Continue your learning journey — courses, quizzes, and AI tutor await.';

  return (
    <DashboardShell title="Student Dashboard" portal="student">
      <PageMotion>
        <div className="space-y-8">
          <StitchWelcomeBanner
            title={`Welcome back, ${firstName}!`}
            description={welcomeDescription}
            imageUrl={STITCH_IMAGES.studentHero}
            action={
              <Link
                href={continueHref}
                className="inline-flex h-10 shrink-0 items-center rounded-full bg-white px-6 text-sm font-bold text-primary shadow-lg transition hover:scale-105"
              >
                Continue Learning
              </Link>
            }
          />

          {loadError && <ApiError message={loadError} />}

          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              icon={<Sparkles className="h-5 w-5" />}
              label="Total XP"
              value={gamification ? gamification.xp.totalXp.toLocaleString() : '—'}
              description={gamification ? `Level ${gamification.xp.currentLevel}` : undefined}
            />
            <KpiCard
              icon={<Flame className="h-5 w-5" />}
              label="Current Streak"
              value={gamification ? `${gamification.streak.currentStreak} Days` : '—'}
              description={
                gamification
                  ? `Longest: ${gamification.streak.longestStreak} days`
                  : undefined
              }
            />
            <KpiCard
              icon={<BookOpen className="h-5 w-5" />}
              label="Active Courses"
              value={enrollments?.length ?? '—'}
            />
            <KpiCard
              icon={<TrendingUp className="h-5 w-5" />}
              label="Lessons Completed"
              value={
                progress
                  ? `${progress.summary.completed}/${progress.summary.total || progress.summary.completed}`
                  : '—'
              }
              description={
                progress
                  ? `${Math.round(progress.summary.totalTimeSpentSeconds / 60)} min studied`
                  : undefined
              }
            />
          </section>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-lg font-semibold">Recent Courses</h3>
                <Link href="/student/courses" className="text-sm font-bold text-primary hover:underline">
                  View all
                </Link>
              </div>

              {!enrollments?.length ? (
                <p className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
                  You are not enrolled in any courses yet.{' '}
                  <Link href="/student/courses" className="font-medium text-primary hover:underline">
                    Browse the catalog
                  </Link>{' '}
                  to get started.
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-3">
                  {enrollments.slice(0, 3).map((enrollment, index) => {
                    const courseProgress = progress?.lessons.filter((l) =>
                      l.lesson.chapter.subject.name === enrollment.course.subject?.name,
                    );
                    const completed = courseProgress?.filter((l) => l.status === 'completed').length ?? 0;
                    const total = courseProgress?.length ?? 0;
                    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

                    return (
                      <StitchRecentCourseCard
                        key={enrollment.id}
                        href={`/student/courses/${enrollment.courseId}`}
                        subject={enrollment.course.subject?.name ?? 'Course'}
                        title={enrollment.course.title}
                        progress={pct}
                        accent={courseAccents[index % courseAccents.length]}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            <StitchAiPromo
              title="Elevate your learning with AI Tutor"
              description="Get personalized guidance, 24/7 instant answers, and adaptive study plans tailored just for you."
              href="/student/ai/tutor"
              linkLabel="Try Now"
              imageUrl={STITCH_IMAGES.studentAiPromo}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <StitchTaskList
              tasks={[
                {
                  id: '1',
                  title: 'Complete in-progress lessons',
                  due: progress?.lessons.find((l) => l.status === 'in_progress')
                    ? 'Continue today'
                    : 'No active tasks',
                  href: continueHref,
                  variant: 'error',
                },
                {
                  id: '2',
                  title: 'Review quiz performance',
                  due: 'Check gamification hub',
                  href: '/student/gamification',
                },
              ]}
            />
            <StitchInsightPanel
              insights={[
                {
                  id: '1',
                  content: (
                    <>
                      You&apos;re building momentum with{' '}
                      <span className="font-bold text-foreground">{streakDays} day streak</span>. Keep learning daily to
                      unlock badges!
                    </>
                  ),
                },
                {
                  id: '2',
                  accent: progress?.summary.completed ? 'default' : 'warning',
                  content: (
                    <>
                      {progress?.summary.completed
                        ? `You've completed ${progress.summary.completed} lessons. Great progress!`
                        : 'Start your first lesson today to maintain your streak.'}
                    </>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </PageMotion>
    </DashboardShell>
  );
}
