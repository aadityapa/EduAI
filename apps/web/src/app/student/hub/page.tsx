import Link from 'next/link';
import { Suspense } from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import { ApiError } from '@/components/api-error';
import { HubFilters } from '@/components/hub-filters';
import { PageMotion } from '@/components/page-motion';
import { getHub, LearningApiError } from '@/lib/learning-api';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@eduai/ui';

interface HubPageProps {
  searchParams: Promise<{
    boardId?: string;
    classLevel?: string;
    subjectId?: string;
    chapterId?: string;
  }>;
}

export default async function HubPage({ searchParams }: HubPageProps) {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (!session.user.roles.includes('student')) redirect('/dashboard');

  const params = await searchParams;
  const classLevel = params.classLevel ? Number(params.classLevel) : undefined;

  let hub = null;
  let loadError: string | null = null;

  try {
    hub = await getHub({
      boardId: params.boardId,
      classLevel: Number.isFinite(classLevel) ? classLevel : undefined,
      subjectId: params.subjectId,
      chapterId: params.chapterId,
    });
  } catch (err) {
    loadError = err instanceof LearningApiError ? err.message : 'Failed to load learning hub';
  }

  const allBoards = hub?.boards ?? [];

  return (
    <DashboardShell title="Learning Hub" portal="student">
      <PageMotion>
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Browse curriculum by board, class, subject, and chapter.
          </p>

          <Suspense fallback={null}>
            <HubFilters boards={allBoards.map((b) => ({ id: b.id, name: b.name }))} />
          </Suspense>

          {loadError && <ApiError message={loadError} />}

          {!loadError && !allBoards.length && (
            <p className="text-sm text-muted-foreground">No content matches your filters.</p>
          )}

          {allBoards.map((board) => (
            <div key={board.id} className="space-y-4">
              <h2 className="text-xl font-semibold">{board.name}</h2>
              {board.subjects.map((subject) => (
                <Card key={subject.id} className="glass-card">
                  <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <CardTitle className="text-lg">
                        {subject.name} · Class {subject.classLevel}
                      </CardTitle>
                      {subject.courses[0] && (
                        <Link
                          href={`/student/courses/${subject.courses[0].id}`}
                          className="text-sm text-primary hover:underline"
                        >
                          View course
                        </Link>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {subject.chapters.map((chapter) => (
                      <div key={chapter.id} className="space-y-2">
                        <h4 className="font-medium">
                          Ch. {chapter.chapterNumber}: {chapter.name}
                        </h4>
                        <div className="grid gap-2">
                          {chapter.lessons.map((lesson) => (
                            <Link
                              key={lesson.id}
                              href={`/student/lessons/${lesson.id}`}
                              className="flex items-center justify-between gap-3 rounded-lg border px-4 py-3 transition-colors hover:bg-muted/50"
                            >
                              <div>
                                <p className="font-medium">{lesson.title}</p>
                                <p className="text-xs capitalize text-muted-foreground">
                                  {lesson.type.replace('_', ' ')}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  lesson.progress.status === 'completed'
                                    ? 'success'
                                    : lesson.progress.status === 'in_progress'
                                      ? 'warning'
                                      : 'secondary'
                                }
                              >
                                {lesson.progress.status.replace('_', ' ')}
                              </Badge>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          ))}
        </div>
      </PageMotion>
    </DashboardShell>
  );
}
