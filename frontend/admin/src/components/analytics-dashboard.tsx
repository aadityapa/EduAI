'use client';

import { EmptyState, KpiCard, Card, CardContent, CardHeader, CardTitle } from '@eduai/ui';
import { BarChart3, Eye, MousePointer, Users } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { ApiError } from '@/components/api-error';
import type { ErpAnalyticsRecord } from '@/lib/admin-api';
import { formatInr, formatNumber } from '@/lib/format';

interface AnalyticsDashboardProps {
  erp: ErpAnalyticsRecord | null;
  revenue: Record<string, number> | null;
  error?: string | null;
}

export function AnalyticsDashboard({ erp, revenue, error }: AnalyticsDashboardProps) {
  const students = erp?.engagement?.students ?? 0;
  const teachers = erp?.engagement?.teachers ?? 0;
  const classes = erp?.engagement?.classes ?? 0;
  const assignments = erp?.engagement?.activeAssignments ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Analytics"
        description="Live tenant engagement from ERP — historical traffic series deferred to analytics-service"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Analytics' }]}
      />

      {error && <ApiError title="Analytics unavailable" message={error} />}

      <div className="grid gap-3 sm:grid-cols-4">
        <KpiCard
          icon={<Users className="h-5 w-5" />}
          label="Students"
          value={formatNumber(students)}
        />
        <KpiCard icon={<Eye className="h-5 w-5" />} label="Teachers" value={formatNumber(teachers)} />
        <KpiCard
          icon={<MousePointer className="h-5 w-5" />}
          label="Active classes"
          value={formatNumber(classes)}
        />
        <KpiCard
          icon={<BarChart3 className="h-5 w-5" />}
          label="Attendance today"
          value={`${erp?.attendance?.rate ?? 0}%`}
        />
      </div>

      {!error && !erp && !revenue ? (
        <EmptyState
          icon={<BarChart3 className="h-5 w-5" />}
          title="No analytics yet"
          description="Start ERP + billing services to load tenant metrics."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Engagement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="flex justify-between">
                <span>Active assignments</span>
                <span className="font-semibold">{assignments}</span>
              </p>
              <p className="flex justify-between">
                <span>Attendance marked today</span>
                <span className="font-semibold">{erp?.attendance?.marked ?? 0}</span>
              </p>
              <p className="flex justify-between">
                <span>AI queries (ERP)</span>
                <span className="font-semibold">{formatNumber(erp?.ai?.totalQueries ?? 0)}</span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Commercial</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="flex justify-between">
                <span>MRR</span>
                <span className="font-semibold">{formatInr(revenue?.mrr ?? 0)}</span>
              </p>
              <p className="flex justify-between">
                <span>Outstanding fees</span>
                <span className="font-semibold">{formatInr(erp?.fees?.outstandingAmount ?? 0)}</span>
              </p>
              <p className="flex justify-between">
                <span>Open fee invoices</span>
                <span className="font-semibold">{erp?.fees?.invoiceCount ?? 0}</span>
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
