import { AiAnalyticsDashboard } from '@/components/ai-analytics-dashboard';

export default function AiAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">AI Analytics</h1>
        <p className="text-muted-foreground">Token usage, cost tracking, and feature adoption</p>
      </div>
      <AiAnalyticsDashboard />
    </div>
  );
}
