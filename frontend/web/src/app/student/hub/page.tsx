import Link from 'next/link';
import { Suspense } from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Library } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { ApiError } from '@/components/api-error';
import { HubFilters } from '@/components/hub-filters';
import { PageMotion } from '@/components/page-motion';
import { getHub, LearningApiError } from '@/lib/learning-api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  LessonCard,
  StitchPageHeader,
} from '@eduai/ui';

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
          <StitchPageHeader
            title="Learning Hub"
            description="Browse boards, subjects, chapters, and lessons."
          />

          <Suspense fallback={null}>
            <HubFilters boards={allBoards.map((b) => ({ id: b.id, name: b.name }))} />
          </Suspense>

          {loadError && <ApiError message={loadError} />}

          {!loadError && !allBoards.length && (
            <EmptyState
              icon={<Library className="h-5 w-5" />}
              title="No content matches your filters"
              description="Adjust board, class, or subject filters to explore the curriculum."
              action={
                <Link
                  href="/student/hub"
                  className="inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground"
                >
                  Clear filters
                </Link>
              }
            />
          )}

          {allBoards.map((board) => (
            <div key={board.id} className="space-y-4">
              <h2 className="font-display text-xl font-semibold">{board.name}</h2>
              {board.subjects.map((subject) => (
                <Card key={subject.id} className="stitch-card">
                  <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <CardTitle className="text-lg">
                        {subject.name} · Class {subject.classLevel}
                      </CardTitle>
                      {subject.courses[0] && (
                        <Link
                          href={`/student/courses/${subject.courses[0].id}`}
                          prefetch
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          View course
                        </Link>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {subject.chapters.map((chapter) => (
                      <div key={chapter.id} className="space-y-3">
                        <h4 className="font-medium">
                          Ch. {chapter.chapterNumber}: {chapter.name}
                        </h4>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {chapter.lessons.map((lesson) => {
                            const status =
                              lesson.progress.status === 'completed'
                                ? 'completed'
                                : lesson.progress.status === 'in_progress'
                                  ? 'in_progress'
                                  : 'available';
                            return (
                              <Link
                                key={lesson.id}
                                href={`/student/lessons/${lesson.id}`}
                                prefetch
                                className="block h-full motion-safe:transition-transform motion-safe:hover:scale-[1.01]"
                              >
                                <LessonCard
                                  title={lesson.title}
                                  subject={lesson.type.replace('_', ' ')}
                                  status={status}
                                  durationMinutes={lesson.durationMinutes ?? undefined}
                                  progress={
                                    status === 'completed'
                                      ? 100
                                      : status === 'in_progress'
                                        ? 40
                                        : 0
                                  }
                                  className="h-full cursor-pointer"
                                />
                              </Link>
                            );
                          })}
                        </div>
                        {!chapter.lessons.length && (
                          <p className="text-sm text-muted-foreground">No lessons in this chapter yet.</p>
                        )}
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
