import { DashboardShell } from '@/components/dashboard-shell';
import { AiChat } from '@/components/ai-chat';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function StudentAiTutorPage() {
  const session = await auth();
  if (!session?.user?.roles?.includes('student')) redirect('/login');

  return (
    <DashboardShell title="AI Tutor" portal="student">
      <AiChat portal="student" />
    </DashboardShell>
  );
}
