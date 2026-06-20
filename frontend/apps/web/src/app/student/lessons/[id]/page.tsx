import Link from 'next/link';
import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { ArrowLeft, Clock, FileText, Video } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { ApiError } from '@/components/api-error';
import { MarkLessonCompleteButton } from '@/components/mark-lesson-complete';
import { PageMotion } from '@/components/page-motion';
import {
  findLessonInHub,
  getHub,
  getMyProgress,
  LearningApiError,
} from '@/lib/learning-api';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@eduai/ui';

interface LessonPageProps {
  params: Promise<{ id: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (!session.user.roles.includes('student')) redirect('/dashboard');

  const { id } = await params;

  let progress = null;
  let hub = null;
  let loadError: string | null = null;

  try {
    [progress, hub] = await Promise.all([getMyProgress(), getHub()]);
  } catch (err) {
    loadError = err instanceof LearningApiError ? err.message : 'Failed to load lesson';
  }

  const progressRecord = progress?.lessons.find((record) => record.lessonId === id);
  const hubMatch = hub ? findLessonInHub(hub, id) : null;

  if (!loadError && !progressRecord && !hubMatch) {
    notFound();
  }

  const title = progressRecord?.lesson.title ?? hubMatch?.lesson.title ?? 'Lesson';
  const type = progressRecord?.lesson.type ?? hubMatch?.lesson.type ?? 'mixed';
  const duration =
    progressRecord?.lesson.durationMinutes ?? hubMatch?.lesson.durationMinutes ?? null;
  const completed = progressRecord?.status === 'completed';
  const chapterName =
    progressRecord?.lesson.chapter.name ?? hubMatch?.chapter.name ?? 'Chapter';
  const subjectName =
    progressRecord?.lesson.chapter.subject.name ?? hubMatch?.subject.name ?? 'Subject';

  return (
    <DashboardShell title={title} portal="student">
      <PageMotion>
        <div className="space-y-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/student/hub">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to hub
            </Link>
          </Button>

          {loadError && <ApiError message={loadError} />}

          <Card className="glass-card">
            <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{subjectName}</Badge>
                  <Badge variant="outline">{chapterName}</Badge>
                  <Badge variant="outline" className="capitalize">
                    {type.replace('_', ' ')}
                  </Badge>
                </div>
                <CardTitle className="text-2xl">{title}</CardTitle>
                {duration != null && (
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {duration} min
                  </p>
                )}
              </div>
              <MarkLessonCompleteButton lessonId={id} completed={completed} />
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                Lesson content
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>
                {type === 'video'
                  ? 'Watch the video lesson and follow along with the guided notes below.'
                  : type === 'text'
                    ? 'Read through the lesson material and complete the practice activities.'
                    : 'Explore the mixed media lesson content including videos, notes, and activities.'}
              </p>
              <p className="text-muted-foreground">
                {subjectName} · {chapterName}
              </p>
              {progressRecord && (
                <p className="text-sm">
                  Status: <strong>{progressRecord.status.replace('_', ' ')}</strong>
                  {progressRecord.timeSpentSeconds > 0 &&
                    ` · ${Math.round(progressRecord.timeSpentSeconds / 60)} min spent`}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Video className="h-5 w-5" />
                Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Lesson resources (videos, notes, worksheets) are available through your enrolled
                course. Open the course page to access linked materials.
              </p>
              {hubMatch?.subject.courses[0] && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/student/courses/${hubMatch.subject.courses[0].id}`}>
                    View course materials
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </PageMotion>
    </DashboardShell>
  );
}
