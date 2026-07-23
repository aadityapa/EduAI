import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import { PageMotion } from '@/components/page-motion';
import { StitchPageHeader, StitchQuizBuilderWizard } from '@eduai/ui';

export default async function QuizBuilderPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (!session.user.roles.includes('teacher')) redirect('/dashboard');

  return (
    <DashboardShell title="Quiz Builder" portal="teacher">
      <PageMotion>
        <StitchPageHeader
          title="Quiz Builder"
          description="Configure, review, and publish quizzes — Stitch Creator Suite"
        />
        <div className="mt-4">
          <StitchQuizBuilderWizard aiGeneratorHref="/teacher/ai/generator" />
        </div>
      </PageMotion>
    </DashboardShell>
  );
}
