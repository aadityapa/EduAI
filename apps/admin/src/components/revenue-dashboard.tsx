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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from '@eduai/ui';
import { DollarSign, RefreshCw, TrendingDown, TrendingUp, Users } from 'lucide-react';
import { PageHeader } from './page-header';
import { chartConfig, revenueData } from '@/lib/mock-data';

const invoices = [
  { id: 'INV-001', tenant: 'Demo Academy', amount: 85000, status: 'paid', date: 'Jun 1, 2025' },
  { id: 'INV-002', tenant: 'Sunrise Schools', amount: 52000, status: 'paid', date: 'Jun 1, 2025' },
  { id: 'INV-003', tenant: 'Green Valley', amount: 28000, status: 'pending', date: 'Jun 5, 2025' },
];

export function RevenueDashboard() {
  const latestMrr = revenueData[revenueData.length - 1].mrr;
  const prevMrr = revenueData[revenueData.length - 2].mrr;
  const growth = ((latestMrr - prevMrr) / prevMrr * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Revenue Dashboard"
        description="MRR, ARR, subscriptions, churn, and forecasts"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Revenue' }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard icon={<DollarSign className="h-5 w-5" />} label="MRR" value={`₹${latestMrr.toLocaleString()}`} trend={{ value: parseFloat(growth) }} />
        <KpiCard icon={<TrendingUp className="h-5 w-5" />} label="ARR" value={`₹${(latestMrr * 12).toLocaleString()}`} trend={{ value: parseFloat(growth) }} />
        <KpiCard icon={<Users className="h-5 w-5" />} label="LTV" value="₹1.2L" description="Avg customer lifetime value" />
        <KpiCard icon={<TrendingDown className="h-5 w-5" />} label="Churn" value="2.1%" trend={{ value: -0.3, label: 'Improved' }} />
        <KpiCard icon={<RefreshCw className="h-5 w-5" />} label="Renewals" value="38" description="Due this month" />
        <KpiCard icon={<DollarSign className="h-5 w-5" />} label="CAC" value="₹8,400" description="Customer acquisition cost" />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Revenue Forecast</CardTitle></CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[320px]">
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="mrr" stroke="var(--color-mrr)" fill="var(--color-mrr)" fillOpacity={0.2} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Recent Invoices</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono text-sm">{inv.id}</TableCell>
                  <TableCell>{inv.tenant}</TableCell>
                  <TableCell>₹{inv.amount.toLocaleString()}</TableCell>
                  <TableCell><span className={inv.status === 'paid' ? 'text-success' : 'text-warning'}>{inv.status}</span></TableCell>
                  <TableCell className="text-muted-foreground">{inv.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
