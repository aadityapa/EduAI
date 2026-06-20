import { DashboardShell } from '@/components/dashboard-shell';
import { AiChat } from '@/components/ai-chat';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function ParentAiTutorPage() {
  const session = await auth();
  if (!session?.user?.roles?.includes('parent')) redirect('/login');

  return (
    <DashboardShell title="AI Tutor" portal="parent">
      <AiChat portal="parent" />
    </DashboardShell>
  );
}
