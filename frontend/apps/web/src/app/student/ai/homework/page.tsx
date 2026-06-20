import { DashboardShell } from '@/components/dashboard-shell';
import { HomeworkAssistant } from '@/components/homework-assistant';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function StudentHomeworkPage() {
  const session = await auth();
  if (!session?.user?.roles?.includes('student')) redirect('/login');

  return (
    <DashboardShell title="Homework Assistant" portal="student">
      <HomeworkAssistant />
    </DashboardShell>
  );
}
