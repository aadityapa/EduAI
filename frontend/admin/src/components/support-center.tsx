'use client';

import { Badge, Card, CardContent, CardHeader, CardTitle, KanbanBoard, KpiCard, StitchSlaBanner, type KanbanColumn } from '@eduai/ui';
import { AlertCircle, Clock, Headphones, CheckCircle, AlertTriangle } from 'lucide-react';
import { PageHeader } from './page-header';
import type { TicketRecord } from '@/lib/admin-api';

const TICKET_STAGES = [
  { id: 'open', title: 'Open' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'resolved', title: 'Resolved' },
  { id: 'closed', title: 'Closed' },
];

function toTicketKanban(tickets: TicketRecord[]): KanbanColumn[] {
  return TICKET_STAGES.map((stage) => ({
    id: stage.id,
    title: stage.title,
    items: tickets
      .filter((t) => t.status === stage.id)
      .map((t) => ({
        id: t.id,
        title: t.subject,
        description: t.description?.slice(0, 80),
        tags: [t.priority],
        assignee: t.createdBy?.email,
      })),
  }));
}

export function SupportCenter({ tickets, error }: { tickets: TicketRecord[] | null; error?: string }) {
  const items = tickets ?? [];
  const open = items.filter((t) => t.status === 'open' || t.status === 'in_progress').length;
  const resolved = items.filter((t) => t.status === 'resolved' || t.status === 'closed').length;
  const columns = toTicketKanban(items);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support Center"
        description="Live tickets from billing-service CRM"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Support' }]}
      />

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {open > 0 && items.some((t) => t.priority === 'high') && (
        <StitchSlaBanner
          message={`${items.filter((t) => t.priority === 'high' && (t.status === 'open' || t.status === 'in_progress')).length} high-priority ticket(s) may breach SLA`}
          actionLabel="Review Now"
          actionHref="#tickets"
        />
      )}

      <div className="grid gap-4 sm:grid-cols-4">
        <KpiCard icon={<Headphones className="h-5 w-5" />} label="Open / Active" value={open} />
        <KpiCard icon={<CheckCircle className="h-5 w-5" />} label="Resolved" value={resolved} />
        <KpiCard icon={<Clock className="h-5 w-5" />} label="Total" value={items.length} />
        <KpiCard icon={<AlertTriangle className="h-5 w-5" />} label="High Priority" value={items.filter((t) => t.priority === 'high').length} />
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No support tickets yet.</p>
      ) : (
        <div id="tickets">
          <KanbanBoard columns={columns} />
        </div>
      )}

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
