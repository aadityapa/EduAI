import { DashboardShell } from '@/components/dashboard-shell';
import { QuestionGenerator } from '@/components/question-generator';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function TeacherGeneratorPage() {
  const session = await auth();
  if (!session?.user?.roles?.includes('teacher')) redirect('/login');

  return (
    <DashboardShell title="Question Generator" portal="teacher">
      <QuestionGenerator />
    </DashboardShell>
  );
}
