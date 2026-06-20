import { DashboardShell } from '@/components/dashboard-shell';
import { StudyPlanner } from '@/components/study-planner';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function StudentPlannerPage() {
  const session = await auth();
  if (!session?.user?.roles?.includes('student')) redirect('/login');

  return (
    <DashboardShell title="Study Planner" portal="student">
      <StudyPlanner />
    </DashboardShell>
  );
}
