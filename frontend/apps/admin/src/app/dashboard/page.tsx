import { getPlatformOverview } from '@/lib/server-data';
import { DashboardOverview } from '@/components/dashboard-overview';

export default async function AdminDashboardPage() {
  const overview = await getPlatformOverview();
  return <DashboardOverview overview={overview} />;
}
