'use client';

import { KanbanBoard, KpiCard, Tabs, TabsContent, TabsList, TabsTrigger } from '@eduai/ui';
import { Filter, Target, TrendingUp, Users } from 'lucide-react';
import { PageHeader } from './page-header';
import { mockLeads } from '@/lib/mock-data';

const pipelineColumns = [
  { id: 'new', title: 'New Leads', items: mockLeads.slice(0, 1) },
  { id: 'qualified', title: 'Qualified', items: mockLeads.slice(1, 2) },
  { id: 'proposal', title: 'Proposal', items: [] },
  { id: 'won', title: 'Won', items: mockLeads.slice(2, 3) },
];

export function LeadsCrm() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads CRM"
        description="Pipeline, funnel, sources, conversions, and follow-ups"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Leads' }]}
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <KpiCard icon={<Users className="h-5 w-5" />} label="Total Leads" value="248" trend={{ value: 15 }} />
        <KpiCard icon={<Filter className="h-5 w-5" />} label="Qualified" value="86" trend={{ value: 8 }} />
        <KpiCard icon={<Target className="h-5 w-5" />} label="Conversion Rate" value="34%" trend={{ value: 2.1 }} />
        <KpiCard icon={<TrendingUp className="h-5 w-5" />} label="Pipeline Value" value="₹42L" trend={{ value: 12 }} />
      </div>

      <Tabs defaultValue="kanban">
        <TabsList>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="funnel">Funnel</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
        </TabsList>
        <TabsContent value="kanban" className="mt-6">
          <KanbanBoard columns={pipelineColumns} />
        </TabsContent>
        <TabsContent value="funnel" className="mt-6">
          <div className="space-y-3">
            {['Awareness', 'Interest', 'Decision', 'Action'].map((stage, i) => (
              <div key={stage} className="flex items-center gap-4">
                <span className="w-24 text-sm font-medium">{stage}</span>
                <div className="h-8 flex-1 rounded-lg bg-primary/10" style={{ width: `${100 - i * 20}%` }}>
                  <div className="flex h-full items-center px-3 text-xs font-medium">{248 - i * 50} leads</div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="sources" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { source: 'Website', count: 98, pct: 39 },
              { source: 'Referral', count: 72, pct: 29 },
              { source: 'Events', count: 48, pct: 19 },
            ].map((s) => (
              <div key={s.source} className="rounded-lg border p-4">
                <p className="font-medium">{s.source}</p>
                <p className="text-2xl font-bold">{s.count}</p>
                <p className="text-xs text-muted-foreground">{s.pct}% of total</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
