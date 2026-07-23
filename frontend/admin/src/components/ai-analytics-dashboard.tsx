'use client';

import { useMemo } from 'react';
import type { ColumnDef, CsvColumn } from '@eduai/ui';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  EmptyState,
  KpiCard,
  LeaderboardRow,
} from '@eduai/ui';
import { Activity, Coins, Users, Zap } from 'lucide-react';
import { PageHeader } from './page-header';
import { ApiError } from '@/components/api-error';
import type { AiDashboardRecord } from '@/lib/admin-api';
import { formatNumber } from '@/lib/format';

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

type FeatureRow = { feature: string; count: number };
type TopUserRow = AiDashboardRecord['topUsers'][number];

export function AiAnalyticsDashboard({ initialData, error }: AiAnalyticsDashboardProps) {
  const data = initialData;

  const featureRows: FeatureRow[] = useMemo(
    () =>
      (data?.featureUsage ?? []).map((f) => ({
        feature: featureLabel(f),
        count: featureCount(f),
      })),
    [data],
  );

  const featureColumns: ColumnDef<FeatureRow>[] = [
    { accessorKey: 'feature', header: 'Feature' },
    {
      accessorKey: 'count',
      header: 'Conversations',
      cell: ({ row }) => formatNumber(row.original.count),
    },
  ];

  const topUserColumns: ColumnDef<TopUserRow>[] = [
    {
      accessorKey: 'userId',
      header: 'User',
      cell: ({ row }) => row.original.userId.slice(0, 12),
    },
    {
      accessorKey: 'tokensUsed',
      header: 'Tokens',
      cell: ({ row }) => formatNumber(row.original.tokensUsed),
    },
    { accessorKey: 'queryCount', header: 'Queries' },
    {
      accessorKey: 'estimatedCostUsd',
      header: 'Cost (USD)',
      cell: ({ row }) => `$${row.original.estimatedCostUsd.toFixed(2)}`,
    },
  ];

  const featureExport: CsvColumn<FeatureRow>[] = [
    { header: 'Feature', accessor: (r) => r.feature },
    { header: 'Count', accessor: (r) => r.count },
  ];

  const userExport: CsvColumn<TopUserRow>[] = [
    { header: 'User', accessor: (r) => r.userId },
    { header: 'Tokens', accessor: (r) => r.tokensUsed },
    { header: 'Queries', accessor: (r) => r.queryCount },
    { header: 'Cost USD', accessor: (r) => r.estimatedCostUsd },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Analytics"
        description={
          data?.dailyBudgetSample != null
            ? `Token usage & cost from ai-service · daily budget sample ${formatNumber(data.dailyBudgetSample)} tokens`
            : 'Token usage, cost tracking, and feature adoption from ai-service'
        }
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'AI Analytics' }]}
      />

      {error && <ApiError title="AI analytics unavailable" message={error} />}

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Tokens"
          value={data ? formatNumber(data.totalTokens) : '—'}
          icon={<Zap className="h-5 w-5" />}
        />
        <KpiCard
          label="Total Queries"
          value={data ? formatNumber(data.totalQueries) : '—'}
          icon={<Activity className="h-5 w-5" />}
        />
        <KpiCard
          label="Est. Cost (USD)"
          value={data ? `$${data.estimatedCostUsd.toFixed(2)}` : '—'}
          icon={<Coins className="h-5 w-5" />}
        />
        <KpiCard
          label="Active Users"
          value={String(data?.topUsers.length ?? 0)}
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      {!error && !data ? (
        <EmptyState
          icon={<Zap className="h-5 w-5" />}
          title="No AI usage yet"
          description="Usage appears when ai-service records quota events."
        />
      ) : (
        !error &&
        data && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Users by Token Usage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.topUsers.length ? (
                  <>
                    {data.topUsers.slice(0, 5).map((u, i) => (
                      <LeaderboardRow
                        key={u.userId}
                        rank={i + 1}
                        name={u.userId.slice(0, 12)}
                        xp={u.tokensUsed}
                        subtitle={`${u.queryCount} queries · $${u.estimatedCostUsd.toFixed(2)}`}
                      />
                    ))}
                    <DataTable
                      className="mt-4"
                      columns={topUserColumns}
                      data={data.topUsers}
                      exportable
                      exportFilename="ai-top-users"
                      exportColumns={userExport}
                      pageSize={10}
                    />
                  </>
                ) : (
                  <EmptyState title="No top users" description="No token usage recorded yet." />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Feature Usage</CardTitle>
              </CardHeader>
              <CardContent>
                {featureRows.length ? (
                  <DataTable
                    columns={featureColumns}
                    data={featureRows}
                    searchKey="feature"
                    exportable
                    exportFilename="ai-features"
                    exportColumns={featureExport}
                  />
                ) : (
                  <EmptyState title="No feature usage" description="Feature breakdown appears after AI traffic." />
                )}
              </CardContent>
            </Card>
          </div>
        )
      )}
    </div>
  );
}
