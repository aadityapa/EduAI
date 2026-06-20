import Link from 'next/link';
import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { Clock, PlayCircle } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { ApiError } from '@/components/api-error';
import { EnrollButton } from '@/components/enroll-button';
import { PageMotion } from '@/components/page-motion';
import {
  getCourse,
  getCourseLessons,
  getMyEnrollments,
  LearningApiError,
} from '@/lib/learning-api';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@eduai/ui';

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (!session.user.roles.includes('student')) redirect('/dashboard');

  const { id } = await params;

  let course = null;
  let lessons = null;
  let enrollments = null;
  let loadError: string | null = null;

  try {
    [course, lessons, enrollments] = await Promise.all([
      getCourse(id),
      getCourseLessons(id),
      getMyEnrollments(),
    ]);
  } catch (err) {
    if (err instanceof LearningApiError && err.status === 404) notFound();
    loadError = err instanceof LearningApiError ? err.message : 'Failed to load course';
  }

  const enrolled = enrollments?.some((e) => e.courseId === id) ?? false;

  return (
    <DashboardShell title={course?.title ?? 'Course'} portal="student">
      <PageMotion>
        <div className="space-y-6">
          {loadError && <ApiError message={loadError} />}

          {course && (
            <>
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2">
                      <Badge variant="secondary">
                        {course.board.name} · {course.subject.name} · Class {course.classLevel}
                      </Badge>
                      <CardTitle className="text-2xl">{course.title}</CardTitle>
                      {course.description && (
                        <p className="text-sm text-muted-foreground">{course.description}</p>
                      )}
                    </div>
                    <EnrollButton courseId={course.id} alreadyEnrolled={enrolled} />
                  </div>
                </CardHeader>
              </Card>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Lessons</h3>
                {!lessons?.chapters.length ? (
                  <p className="text-sm text-muted-foreground">No lessons published yet.</p>
                ) : (
                  lessons.chapters.map((chapter) => (
                    <Card key={chapter.id}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">
                          Chapter {chapter.chapterNumber}: {chapter.name}
                        </CardTitle>
                        {chapter.description && (
                          <p className="text-sm text-muted-foreground">{chapter.description}</p>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {chapter.lessons.map((lesson) => (
                          <Link
                            key={lesson.id}
                            href={`/student/lessons/${lesson.id}`}
                            className="flex items-center justify-between gap-3 rounded-lg border px-4 py-3 transition-colors hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-3">
                              <PlayCircle className="h-5 w-5 text-primary" />
                              <div>
                                <p className="font-medium">{lesson.title}</p>
                                <p className="text-xs capitalize text-muted-foreground">
                                  {lesson.type.replace('_', ' ')}
                                </p>
                              </div>
                            </div>
                            {lesson.durationMinutes != null && (
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" />
                                {lesson.durationMinutes} min
                              </span>
                            )}
                          </Link>
                        ))}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </PageMotion>
    </DashboardShell>
  );
}
