import { DashboardShell } from '@/components/dashboard-shell';
import { AiChat } from '@/components/ai-chat';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function TeacherAiTutorPage() {
  const session = await auth();
  if (!session?.user?.roles?.includes('teacher')) redirect('/login');

  return (
    <DashboardShell title="AI Tutor" portal="teacher">
      <AiChat portal="teacher" />
    </DashboardShell>
  );
}
