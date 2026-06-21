import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import { StitchPageHeader, StitchQuizBuilderWizard } from '@eduai/ui';

export default async function QuizBuilderPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (!session.user.roles.includes('teacher')) redirect('/dashboard');

  return (
    <DashboardShell title="Quiz Builder" portal="teacher">
      <StitchPageHeader
        title="Quiz Builder"
        description="Configure, review, and publish quizzes — Stitch Creator Suite"
      />
      <StitchQuizBuilderWizard aiGeneratorHref="/teacher/ai/generator" />
    </DashboardShell>
  );
}
