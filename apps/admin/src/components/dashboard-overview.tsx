'use client';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  KpiCard,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from '@eduai/ui';
import {
  Activity,
  AlertCircle,
  Brain,
  Building2,
  CreditCard,
  GraduationCap,
  Repeat,
  School,
  Users,
} from 'lucide-react';
import { PageHeader } from './page-header';
import type { getPlatformOverview } from '@/lib/server-data';
import {
  aiUsageData,
  chartConfig,
  courseCompletionData,
  engagementData,
  revenueData,
  schoolAnalyticsData,
  userGrowthData,
} from '@/lib/mock-data';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-IN').format(value);
}

type Overview = Awaited<ReturnType<typeof getPlatformOverview>>;

export function DashboardOverview({ overview }: { overview: Overview }) {
  const erp = overview.erp.data as {
    engagement?: { students?: number; teachers?: number; classes?: number };
    ai?: { totalQueries?: number };
  } | null;
  const revenue = overview.revenue.data;
  const students = erp?.engagement?.students ?? 0;
  const teachers = erp?.engagement?.teachers ?? 0;
  const classes = erp?.engagement?.classes ?? 0;
  const mrr = revenue?.mrr ?? 0;
  const aiRequests = erp?.ai?.totalQueries ?? 0;
  const subs = revenue?.activeSubscriptions ?? 0;
  const errors = [overview.revenue.error, overview.erp.error, overview.ai.error].filter(Boolean);

  const liveRevenueChart = revenueData.map((row, i, arr) =>
    i === arr.length - 1 ? { ...row, mrr } : row,
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Live KPIs from ERP + billing + AI services"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Dashboard' }]}
      />

      {errors.length > 0 && (
        <div className="flex items-start gap-2 rounded-lg border border-warning/40 bg-warning/5 p-3 text-sm">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <span>Some services unavailable: {errors.join('; ')}. Start backend with pnpm dev:backend</span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard icon={<GraduationCap className="h-5 w-5" />} label="Students (tenant)" value={formatNumber(students)} />
        <KpiCard icon={<Users className="h-5 w-5" />} label="Teachers" value={formatNumber(teachers)} />
        <KpiCard icon={<School className="h-5 w-5" />} label="Active Classes" value={formatNumber(classes)} />
        <KpiCard icon={<CreditCard className="h-5 w-5" />} label="MRR" value={formatCurrency(mrr)} />
        <KpiCard icon={<Activity className="h-5 w-5" />} label="Attendance Today" value={`${(overview.erp.data as { attendance?: { rate?: number } })?.attendance?.rate ?? 0}%`} />
        <KpiCard icon={<Brain className="h-5 w-5" />} label="AI Queries" value={formatNumber(aiRequests)} />
        <KpiCard icon={<Building2 className="h-5 w-5" />} label="Subscriptions" value={subs} />
        <KpiCard icon={<Repeat className="h-5 w-5" />} label="Retention" value={`${((1 - (revenue?.churnRate ?? 0)) * 100).toFixed(1)}%`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px]">
              <AreaChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="students" stackId="1" stroke="var(--color-students)" fill="var(--color-students)" fillOpacity={0.3} />
                <Area type="monotone" dataKey="teachers" stackId="1" stroke="var(--color-teachers)" fill="var(--color-teachers)" fillOpacity={0.3} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue (MRR)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px]">
              <LineChart data={liveRevenueChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="mrr" stroke="var(--color-mrr)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">AI Usage (Weekly)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px]">
              <BarChart data={aiUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="requests" fill="var(--color-requests)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Course Completion by Subject</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px]">
              <BarChart data={courseCompletionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="subject" type="category" width={80} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="completion" fill="var(--color-completion)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Engagement Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px]">
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="sessions" stroke="var(--color-sessions)" strokeWidth={2} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Schools by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px]">
              <BarChart data={schoolAnalyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
                <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
