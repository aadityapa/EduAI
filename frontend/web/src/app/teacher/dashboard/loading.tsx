import { DashboardShell } from '@/components/dashboard-shell';
import { TeacherDashboardSkeleton } from '@/components/portal-skeletons';

export default function TeacherDashboardLoading() {
  return (
    <DashboardShell title="Teacher Dashboard" portal="teacher">
      <TeacherDashboardSkeleton />
    </DashboardShell>
  );
}
