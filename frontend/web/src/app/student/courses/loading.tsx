import { DashboardShell } from '@/components/dashboard-shell';
import { CatalogSkeleton } from '@/components/portal-skeletons';

export default function CoursesLoading() {
  return (
    <DashboardShell title="Courses" portal="student">
      <CatalogSkeleton />
    </DashboardShell>
  );
}
