'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
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
import { Activity, Coins, Users, Zap } from 'lucide-react';
import { PageHeader } from './page-header';
import { aiUsageData, chartConfig } from '@/lib/mock-data';

const AI_BASE = process.env.NEXT_PUBLIC_AI_SERVICE_URL ?? 'http://localhost:3004';

interface DashboardData {
  totalTokens: number;
  totalQueries: number;
  estimatedCostUsd: number;
  topUsers: Array<{ userId: string; tokensUsed: number; queryCount: number; estimatedCostUsd: number }>;
  featureUsage: Array<{ type: string; _count: { id: number } }>;
}

const mockFeatureUsage = [
  { type: 'tutor', count: 4200 },
  { type: 'homework', count: 2800 },
  { type: 'planner', count: 1500 },
  { type: 'generator', count: 980 },
];

const mockSubjects = [
  { subject: 'Math', requests: 3200 },
  { subject: 'Science', requests: 2800 },
  { subject: 'English', requests: 2100 },
  { subject: 'Hindi', requests: 1400 },
];

export function AiAnalyticsDashboard() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!session?.user?.accessToken) {
        setData({
          totalTokens: 4820000,
          totalQueries: 847200,
          estimatedCostUsd: 482.50,
          topUsers: [
            { userId: 'usr-001', tokensUsed: 125000, queryCount: 420, estimatedCostUsd: 12.50 },
            { userId: 'usr-002', tokensUsed: 98000, queryCount: 380, estimatedCostUsd: 9.80 },
            { userId: 'usr-003', tokensUsed: 76000, queryCount: 290, estimatedCostUsd: 7.60 },
          ],
          featureUsage: mockFeatureUsage.map((f) => ({ type: f.type, _count: { id: f.count } })),
        });
        setLoading(false);
        return;
      }
      const res = await fetch(`${AI_BASE}/api/v1/analytics/dashboard`, {
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      });
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
      } else {
        setData({
          totalTokens: 4820000,
          totalQueries: 847200,
          estimatedCostUsd: 482.50,
          topUsers: [],
          featureUsage: mockFeatureUsage.map((f) => ({ type: f.type, _count: { id: f.count } })),
        });
      }
      setLoading(false);
    }
    load();
  }, [session?.user?.accessToken]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Analytics"
        description="Token usage, cost tracking, feature adoption, and trends"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'AI Analytics' }]}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard loading={loading} label="Total Tokens" value={data?.totalTokens.toLocaleString() ?? '—'} icon={<Zap className="h-5 w-5" />} trend={{ value: 18.5 }} />
        <KpiCard loading={loading} label="Total Queries" value={data?.totalQueries.toLocaleString() ?? '—'} icon={<Activity className="h-5 w-5" />} trend={{ value: 12.2 }} />
        <KpiCard loading={loading} label="Est. Cost (USD)" value={data ? `$${data.estimatedCostUsd.toFixed(2)}` : '—'} icon={<Coins className="h-5 w-5" />} />
        <KpiCard loading={loading} label="Active Users" value={String(data?.topUsers.length ?? 0)} icon={<Users className="h-5 w-5" />} />
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
            {data?.topUsers.map((u, i) => (
              <LeaderboardRow
                key={u.userId}
                rank={i + 1}
                name={u.userId.slice(0, 12)}
                xp={u.tokensUsed}
                subtitle={`${u.queryCount} queries · $${u.estimatedCostUsd.toFixed(2)}`}
              />
            )) ?? <p className="text-sm text-muted-foreground">No data</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Feature Usage</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {data?.featureUsage.map((f) => (
                <li key={f.type} className="flex justify-between rounded-lg bg-muted/50 px-3 py-2">
                  <span className="capitalize">{f.type}</span>
                  <span>{f._count.id.toLocaleString()} conversations</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
