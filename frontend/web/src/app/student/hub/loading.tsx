import { DashboardShell } from '@/components/dashboard-shell';
import { CatalogSkeleton } from '@/components/portal-skeletons';

export default function HubLoading() {
  return (
    <DashboardShell title="Learning Hub" portal="student">
      <CatalogSkeleton cards={4} />
    </DashboardShell>
  );
}
