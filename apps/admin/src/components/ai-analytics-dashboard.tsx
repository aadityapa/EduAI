'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, StatCard } from '@eduai/ui';
import { Activity, Coins, Users, Zap } from 'lucide-react';

const AI_BASE = process.env.NEXT_PUBLIC_AI_SERVICE_URL ?? 'http://localhost:3004';

interface DashboardData {
  totalTokens: number;
  totalQueries: number;
  estimatedCostUsd: number;
  topUsers: Array<{ userId: string; tokensUsed: number; queryCount: number; estimatedCostUsd: number }>;
  featureUsage: Array<{ type: string; _count: { id: number } }>;
}

export function AiAnalyticsDashboard() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!session?.user?.accessToken) return;
      const res = await fetch(`${AI_BASE}/api/v1/analytics/dashboard`, {
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      });
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
      }
      setLoading(false);
    }
    load();
  }, [session?.user?.accessToken]);

  if (loading) return <p className="text-muted-foreground">Loading analytics…</p>;
  if (!data) return <p className="text-muted-foreground">Unable to load AI analytics.</p>;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Tokens" value={data.totalTokens.toLocaleString()} icon={<Zap className="h-5 w-5" />} />
        <StatCard label="Total Queries" value={data.totalQueries.toLocaleString()} icon={<Activity className="h-5 w-5" />} />
        <StatCard label="Est. Cost (USD)" value={`$${data.estimatedCostUsd.toFixed(2)}`} icon={<Coins className="h-5 w-5" />} />
        <StatCard label="Active Users" value={String(data.topUsers.length)} icon={<Users className="h-5 w-5" />} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Users by Token Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-2">User ID</th>
                <th className="pb-2">Tokens</th>
                <th className="pb-2">Queries</th>
                <th className="pb-2">Est. Cost</th>
              </tr>
            </thead>
            <tbody>
              {data.topUsers.map((u) => (
                <tr key={u.userId} className="border-b border-border/50">
                  <td className="py-2 font-mono text-xs">{u.userId.slice(0, 8)}…</td>
                  <td className="py-2">{u.tokensUsed.toLocaleString()}</td>
                  <td className="py-2">{u.queryCount}</td>
                  <td className="py-2">${u.estimatedCostUsd.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feature Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {data.featureUsage.map((f) => (
              <li key={f.type} className="flex justify-between rounded-lg bg-muted/50 px-3 py-2">
                <span className="capitalize">{f.type}</span>
                <span>{f._count.id} conversations</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
