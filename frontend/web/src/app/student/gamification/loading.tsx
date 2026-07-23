import { DashboardShell } from '@/components/dashboard-shell';
import { CatalogSkeleton } from '@/components/portal-skeletons';

export default function GamificationLoading() {
  return (
    <DashboardShell title="Achievements" portal="student">
      <CatalogSkeleton cards={3} />
    </DashboardShell>
  );
}
