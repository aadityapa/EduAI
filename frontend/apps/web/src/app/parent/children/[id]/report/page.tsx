import Link from 'next/link';
import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { ApiError } from '@/components/api-error';
import { PageMotion } from '@/components/page-motion';
import { getChildReport, LearningApiError } from '@/lib/learning-api';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ProgressBar,
  StreakBadge,
  XpBadge,
} from '@eduai/ui';

interface ChildReportPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChildReportPage({ params }: ChildReportPageProps) {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (!session.user.roles.includes('parent')) redirect('/dashboard');

  const { id } = await params;

  let report = null;
  let loadError: string | null = null;

  try {
    report = await getChildReport(id);
  } catch (err) {
    if (err instanceof LearningApiError && (err.status === 403 || err.status === 404)) {
      notFound();
    }
    loadError = err instanceof LearningApiError ? err.message : 'Failed to load report';
  }

  const studentName = report
    ? `${report.student.firstName} ${report.student.lastName ?? ''}`.trim()
    : 'Student';

  return (
    <DashboardShell title={`${studentName} — Learning Report`} portal="parent">
      <PageMotion>
        <div className="space-y-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/parent/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to dashboard
            </Link>
          </Button>

          {loadError && <ApiError message={loadError} />}

          {report && (
            <>
              <div className="flex flex-wrap gap-3">
                <XpBadge xp={report.gamification.totalXp} />
                <StreakBadge days={report.gamification.currentStreak} />
                <Badge variant="secondary">Level {report.gamification.currentLevel}</Badge>
              </div>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Progress overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ProgressBar
                    value={
                      report.progress.summary.total > 0
                        ? (report.progress.summary.completed / report.progress.summary.total) *
                          100
                        : 0
                    }
                    label="Lessons completed"
                    showPercentage
                    variant="lesson"
                  />
                  <div className="grid gap-2 text-sm sm:grid-cols-3">
                    <p>
                      <span className="text-muted-foreground">Completed:</span>{' '}
                      {report.progress.summary.completed}
                    </p>
                    <p>
                      <span className="text-muted-foreground">In progress:</span>{' '}
                      {report.progress.summary.inProgress}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Study time:</span>{' '}
                      {Math.round(report.progress.summary.totalTimeSpentSeconds / 60)} min
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Enrolled courses</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {!report.enrollments.length ? (
                      <p className="text-sm text-muted-foreground">No active enrollments.</p>
                    ) : (
                      report.enrollments.map((enrollment) => (
                        <div key={enrollment.courseId} className="rounded-lg border p-3">
                          <p className="font-medium">{enrollment.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Class {enrollment.classLevel} · Enrolled{' '}
                            {new Date(enrollment.enrolledAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent quiz scores</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {!report.quizzes.length ? (
                      <p className="text-sm text-muted-foreground">No quiz attempts yet.</p>
                    ) : (
                      report.quizzes.map((attempt) => (
                        <div
                          key={attempt.attemptId}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div>
                            <p className="font-medium">{attempt.quizTitle}</p>
                            {attempt.submittedAt && (
                              <p className="text-xs text-muted-foreground">
                                {new Date(attempt.submittedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              {attempt.score != null ? `${Math.round(attempt.score)}%` : '—'}
                            </span>
                            <Badge variant={attempt.passed ? 'success' : 'secondary'}>
                              {attempt.passed ? 'Passed' : 'Failed'}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              {report.progress.lessons.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent lessons</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {report.progress.lessons.slice(0, 8).map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between rounded-lg border px-4 py-3"
                      >
                        <div>
                          <p className="font-medium">{record.lesson.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {record.lesson.chapter.subject.name}
                          </p>
                        </div>
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
                    ))}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </PageMotion>
    </DashboardShell>
  );
}
