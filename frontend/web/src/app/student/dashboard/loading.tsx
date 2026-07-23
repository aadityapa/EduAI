import { DashboardShell } from '@/components/dashboard-shell';
import { StudentDashboardSkeleton } from '@/components/portal-skeletons';

export default function StudentDashboardLoading() {
  return (
    <DashboardShell title="Student Dashboard" portal="student">
      <StudentDashboardSkeleton />
    </DashboardShell>
  );
}
