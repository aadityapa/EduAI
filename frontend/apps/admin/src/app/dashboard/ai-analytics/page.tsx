import { getAiAnalyticsPageData } from '@/lib/server-data';
import { AiAnalyticsDashboard } from '@/components/ai-analytics-dashboard';

export default async function AiAnalyticsPage() {
  const { data, error } = await getAiAnalyticsPageData();
  return <AiAnalyticsDashboard initialData={data} error={error} />;
}
