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
  Pie,
  PieChart,
  Cell,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from '@eduai/ui';
import { BarChart3, Eye, MousePointer, Users } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { chartConfig, engagementData, userGrowthData } from '@/lib/mock-data';

const deviceData = [
  { name: 'Desktop', value: 45, color: 'hsl(var(--chart-1))' },
  { name: 'Mobile', value: 42, color: 'hsl(var(--chart-2))' },
  { name: 'Tablet', value: 13, color: 'hsl(var(--chart-3))' },
];

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Analytics"
        description="Traffic, engagement, and user behavior insights"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Analytics' }]}
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <KpiCard icon={<Users className="h-5 w-5" />} label="Monthly Active Users" value="19,200" trend={{ value: 8.4 }} />
        <KpiCard icon={<Eye className="h-5 w-5" />} label="Page Views" value="842K" trend={{ value: 12 }} />
        <KpiCard icon={<MousePointer className="h-5 w-5" />} label="Avg Session" value="24 min" trend={{ value: 5 }} />
        <KpiCard icon={<BarChart3 className="h-5 w-5" />} label="Bounce Rate" value="22%" trend={{ value: -3 }} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">User Growth</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px]">
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="students" fill="var(--color-students)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Device Breakdown</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="mx-auto h-[280px]">
              <PieChart>
                <Pie data={deviceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {deviceData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Engagement Over Time</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px]">
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="sessions" fill="var(--color-sessions)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
