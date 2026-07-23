import { DashboardShell } from '@/components/dashboard-shell';
import { ParentDashboardSkeleton } from '@/components/portal-skeletons';

export default function ParentDashboardLoading() {
  return (
    <DashboardShell title="Parent Dashboard" portal="parent">
      <ParentDashboardSkeleton />
    </DashboardShell>
  );
}
