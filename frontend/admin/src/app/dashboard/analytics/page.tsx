import { getAnalyticsPageData } from '@/lib/server-data';
import { AnalyticsDashboard } from '@/components/analytics-dashboard';

export default async function AnalyticsPage() {
  const { erp, revenue } = await getAnalyticsPageData();
  return (
    <AnalyticsDashboard
      erp={erp.data}
      revenue={revenue.data}
      error={erp.error ?? revenue.error}
    />
  );
}
