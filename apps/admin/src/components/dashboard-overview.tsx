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
  Brain,
  Building2,
  CreditCard,
  GraduationCap,
  Repeat,
  School,
  Users,
} from 'lucide-react';
import { PageHeader } from './page-header';
import {
  aiUsageData,
  chartConfig,
  courseCompletionData,
  dashboardKpis,
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

export function DashboardOverview() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Platform overview — users, revenue, AI usage, and engagement"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Dashboard' }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard icon={<GraduationCap className="h-5 w-5" />} label="Total Students" value={formatNumber(dashboardKpis.totalStudents)} trend={{ value: 12.4, label: 'vs last month' }} />
        <KpiCard icon={<Users className="h-5 w-5" />} label="Teachers" value={formatNumber(dashboardKpis.totalTeachers)} trend={{ value: 8.2, label: 'vs last month' }} />
        <KpiCard icon={<School className="h-5 w-5" />} label="Schools" value={formatNumber(dashboardKpis.totalSchools)} trend={{ value: 5.1, label: 'vs last month' }} />
        <KpiCard icon={<CreditCard className="h-5 w-5" />} label="Monthly Revenue" value={formatCurrency(dashboardKpis.monthlyRevenue)} trend={{ value: 7.6, label: 'MRR growth' }} />
        <KpiCard icon={<Activity className="h-5 w-5" />} label="Active Users" value={formatNumber(dashboardKpis.activeUsers)} trend={{ value: 3.8 }} />
        <KpiCard icon={<Brain className="h-5 w-5" />} label="AI Requests" value={formatNumber(dashboardKpis.aiRequests)} trend={{ value: 18.5, label: 'This month' }} />
        <KpiCard icon={<Building2 className="h-5 w-5" />} label="Subscriptions" value={dashboardKpis.subscriptions} trend={{ value: 4.2 }} />
        <KpiCard icon={<Repeat className="h-5 w-5" />} label="Retention" value={`${dashboardKpis.retention}%`} trend={{ value: 1.2, label: 'Net retention' }} />
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
              <LineChart data={revenueData}>
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
