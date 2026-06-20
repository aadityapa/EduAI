'use client';

import { Badge, Card, CardContent, CardHeader, CardTitle, KanbanBoard, KpiCard } from '@eduai/ui';
import { Clock, Headphones, CheckCircle, AlertTriangle } from 'lucide-react';
import { PageHeader } from './page-header';
import { mockTickets } from '@/lib/mock-data';

const ticketColumns = [
  { id: 'open', title: 'Open', items: mockTickets.slice(0, 1) },
  { id: 'in_progress', title: 'In Progress', items: mockTickets.slice(1, 2) },
  { id: 'resolved', title: 'Resolved', items: mockTickets.slice(2, 3) },
];

export function SupportCenter() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Support Center"
        description="Tickets, SLA tracking, assignments, and knowledge base"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Support' }]}
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <KpiCard icon={<Headphones className="h-5 w-5" />} label="Open Tickets" value="24" />
        <KpiCard icon={<Clock className="h-5 w-5" />} label="Avg Resolution" value="4.2h" />
        <KpiCard icon={<CheckCircle className="h-5 w-5" />} label="SLA Met" value="96%" trend={{ value: 2 }} />
        <KpiCard icon={<AlertTriangle className="h-5 w-5" />} label="Escalated" value="3" trend={{ value: -1 }} />
      </div>

      <KanbanBoard columns={ticketColumns} />

      <Card>
        <CardHeader><CardTitle className="text-base">Knowledge Base</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {['Getting started with EduAI', 'AI tutor configuration', 'Billing and subscriptions FAQ'].map((article) => (
            <div key={article} className="flex items-center justify-between rounded-lg border p-3 text-sm">
              <span>{article}</span>
              <Badge variant="secondary">Published</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
