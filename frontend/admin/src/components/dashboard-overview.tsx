'use client';

import {
  EmptyState,
  KpiCard,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@eduai/ui';
import {
  Activity,
  Brain,
  Building2,
  CreditCard,
  GraduationCap,
  School,
  Users,
} from 'lucide-react';
import { PageHeader } from './page-header';
import { ApiError } from '@/components/api-error';
import type { getPlatformOverview } from '@/lib/server-data';
import { formatInr, formatNumber } from '@/lib/format';
import { useAdminLocale } from '@/components/admin-locale-provider';

type Overview = Awaited<ReturnType<typeof getPlatformOverview>>;

export function DashboardOverview({ overview }: { overview: Overview }) {
  const { t } = useAdminLocale();
  const erp = overview.erp.data;
  const revenue = overview.revenue.data;
  const ai = overview.ai.data;
  const students = erp?.engagement?.students ?? 0;
  const teachers = erp?.engagement?.teachers ?? 0;
  const classes = erp?.engagement?.classes ?? 0;
  const mrr = revenue?.mrr ?? 0;
  const aiQueries = ai?.totalQueries ?? erp?.ai?.totalQueries ?? 0;
  const aiCost = ai?.estimatedCostUsd ?? 0;
  const subs = revenue?.activeSubscriptions ?? 0;
  const userTotal = overview.users.data?.total;
  const fatal = !overview.revenue.data && !overview.erp.data && overview.revenue.error && overview.erp.error;

  if (fatal) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={t('admin.nav.dashboard')}
          description="Live KPIs from ERP + billing + AI services"
          breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Dashboard' }]}
        />
        <ApiError title="Dashboard unavailable" message={t('admin.serviceUnavailable')} />
      </div>
    );
  }

  const softErrors = [overview.revenue.error, overview.erp.error, overview.ai.error].filter(Boolean);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('admin.nav.dashboard')}
        description="Live KPIs from ERP + billing + AI services"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Dashboard' }]}
      />

      {softErrors.length > 0 && (
        <ApiError
          title="Partial data"
          message={`${t('admin.serviceUnavailable')} (${softErrors.join('; ')})`}
        />
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard icon={<CreditCard className="h-5 w-5" />} label="MRR" value={formatInr(mrr)} />
        <KpiCard icon={<Building2 className="h-5 w-5" />} label="Active Tenants" value={formatNumber(subs)} />
        <KpiCard
          icon={<Users className="h-5 w-5" />}
          label="Total Users"
          value={formatNumber(userTotal ?? students + teachers)}
        />
        <KpiCard
          icon={<Brain className="h-5 w-5" />}
          label="AI Cost (est.)"
          value={ai ? `$${aiCost.toFixed(2)}` : formatInr(0)}
          description={`${formatNumber(aiQueries)} queries`}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard icon={<GraduationCap className="h-5 w-5" />} label="Students (tenant)" value={formatNumber(students)} />
        <KpiCard icon={<Users className="h-5 w-5" />} label="Teachers" value={formatNumber(teachers)} />
        <KpiCard icon={<School className="h-5 w-5" />} label="Active Classes" value={formatNumber(classes)} />
        <KpiCard
          icon={<Activity className="h-5 w-5" />}
          label="Attendance Today"
          value={`${erp?.attendance?.rate ?? 0}%`}
        />
      </div>

      <Card className="stitch-card">
        <CardHeader>
          <CardTitle className="text-base">Operational snapshot</CardTitle>
        </CardHeader>
        <CardContent>
          {!erp && !revenue ? (
            <EmptyState
              title={t('admin.emptyTitle')}
              description={t('admin.emptyDescription')}
            />
          ) : (
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Outstanding fees</dt>
                <dd className="text-lg font-semibold">
                  {formatInr(erp?.fees?.outstandingAmount ?? 0)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Fee invoices open</dt>
                <dd className="text-lg font-semibold">{erp?.fees?.invoiceCount ?? 0}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Active assignments</dt>
                <dd className="text-lg font-semibold">{erp?.engagement?.activeAssignments ?? 0}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">AI tokens (ERP)</dt>
                <dd className="text-lg font-semibold">{formatNumber(erp?.ai?.totalTokens ?? 0)}</dd>
              </div>
            </dl>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
