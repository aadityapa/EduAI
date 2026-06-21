'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  KpiCard,
  LeaderboardRow,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from '@eduai/ui';
import { Activity, AlertCircle, Coins, Users, Zap } from 'lucide-react';
import { PageHeader } from './page-header';
import { aiUsageData, chartConfig } from '@/lib/mock-data';
import type { AiDashboardRecord } from '@/lib/admin-api';

const mockSubjects = [
  { subject: 'Math', requests: 3200 },
  { subject: 'Science', requests: 2800 },
  { subject: 'English', requests: 2100 },
  { subject: 'Hindi', requests: 1400 },
];

function featureCount(entry: { type?: string; feature?: string; _count?: { id: number }; count?: number }): number {
  if (entry.count != null) return entry.count;
  return entry._count?.id ?? 0;
}

function featureLabel(entry: { type?: string; feature?: string }): string {
  return entry.feature ?? entry.type ?? 'unknown';
}

interface AiAnalyticsDashboardProps {
  initialData: AiDashboardRecord | null;
  error?: string | null;
}

export function AiAnalyticsDashboard({ initialData, error }: AiAnalyticsDashboardProps) {
  const data = initialData;

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Analytics"
        description="Token usage, cost tracking, feature adoption, and trends"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'AI Analytics' }]}
      />

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Tokens" value={data?.totalTokens.toLocaleString() ?? '—'} icon={<Zap className="h-5 w-5" />} />
        <KpiCard label="Total Queries" value={data?.totalQueries.toLocaleString() ?? '—'} icon={<Activity className="h-5 w-5" />} />
        <KpiCard label="Est. Cost (USD)" value={data ? `$${data.estimatedCostUsd.toFixed(2)}` : '—'} icon={<Coins className="h-5 w-5" />} />
        <KpiCard label="Active Users" value={String(data?.topUsers.length ?? 0)} icon={<Users className="h-5 w-5" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Daily AI Usage</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px]">
              <LineChart data={aiUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="requests" stroke="var(--color-requests)" strokeWidth={2} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Usage by Subject</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px]">
              <BarChart data={mockSubjects}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="requests" fill="var(--color-requests)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Top Users by Token Usage</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {data?.topUsers.length ? data.topUsers.map((u, i) => (
              <LeaderboardRow
                key={u.userId}
                rank={i + 1}
                name={u.userId.slice(0, 12)}
                xp={u.tokensUsed}
                subtitle={`${u.queryCount} queries · $${u.estimatedCostUsd.toFixed(2)}`}
              />
            )) : <p className="text-sm text-muted-foreground">No usage data yet.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Feature Usage</CardTitle></CardHeader>
          <CardContent>
            {data?.featureUsage.length ? (
              <ul className="space-y-2 text-sm">
                {data.featureUsage.map((f) => (
                  <li key={featureLabel(f)} className="flex justify-between rounded-lg bg-muted/50 px-3 py-2">
                    <span className="capitalize">{featureLabel(f)}</span>
                    <span>{featureCount(f).toLocaleString()} conversations</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No feature usage recorded yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
