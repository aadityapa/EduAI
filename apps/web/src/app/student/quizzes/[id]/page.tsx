import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import { ApiError } from '@/components/api-error';
import { PageMotion } from '@/components/page-motion';
import { QuizPlayer } from '@/components/quiz-player';
import { getQuiz, LearningApiError } from '@/lib/learning-api';

interface QuizPageProps {
  params: Promise<{ id: string }>;
}

export default async function QuizPage({ params }: QuizPageProps) {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (!session.user.roles.includes('student')) redirect('/dashboard');

  const { id } = await params;

  let quiz = null;
  let loadError: string | null = null;

  try {
    quiz = await getQuiz(id);
  } catch (err) {
    if (err instanceof LearningApiError && err.status === 404) notFound();
    loadError = err instanceof LearningApiError ? err.message : 'Failed to load quiz';
  }

  return (
    <DashboardShell title={quiz?.title ?? 'Quiz'} portal="student">
      <PageMotion>
        <div className="mx-auto max-w-2xl space-y-6">
          {loadError && <ApiError message={loadError} />}
          {quiz && <QuizPlayer quiz={quiz} />}
        </div>
      </PageMotion>
    </DashboardShell>
  );
}
