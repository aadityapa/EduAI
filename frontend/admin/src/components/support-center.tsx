'use client';

import { useMemo } from 'react';
import type { ColumnDef, CsvColumn } from '@eduai/ui';
import {
  Badge,
  DataTable,
  EmptyState,
  KanbanBoard,
  KpiCard,
  StitchSlaBanner,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type KanbanColumn,
} from '@eduai/ui';
import { AlertTriangle, CheckCircle, Clock, Headphones } from 'lucide-react';
import { PageHeader } from './page-header';
import { ApiError } from '@/components/api-error';
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
  const highOpen = items.filter(
    (t) => t.priority === 'high' && (t.status === 'open' || t.status === 'in_progress'),
  ).length;
  const kanban = toTicketKanban(items);

  const tableColumns: ColumnDef<TicketRecord>[] = useMemo(
    () => [
      { accessorKey: 'subject', header: 'Subject' },
      {
        accessorKey: 'priority',
        header: 'Priority',
        cell: ({ row }) => (
          <Badge variant={row.original.priority === 'high' ? 'danger' : 'secondary'}>
            {row.original.priority}
          </Badge>
        ),
      },
      { accessorKey: 'status', header: 'Status' },
      {
        id: 'requester',
        header: 'Requester',
        cell: ({ row }) => row.original.createdBy?.email ?? '—',
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => row.original.description?.slice(0, 60) ?? '—',
      },
    ],
    [],
  );

  const exportColumns: CsvColumn<TicketRecord>[] = [
    { header: 'Subject', accessor: (r) => r.subject },
    { header: 'Priority', accessor: (r) => r.priority },
    { header: 'Status', accessor: (r) => r.status },
    { header: 'Requester', accessor: (r) => r.createdBy?.email ?? '' },
    { header: 'Description', accessor: (r) => r.description },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support Center"
        description="Live tickets from billing-service CRM"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Support' }]}
      />

      {error && <ApiError title="Tickets unavailable" message={error} />}

      {highOpen > 0 && (
        <StitchSlaBanner
          message={`${highOpen} high-priority ticket(s) may breach SLA`}
          actionLabel="Review Now"
          actionHref="#tickets"
        />
      )}

      <div className="grid gap-3 sm:grid-cols-4">
        <KpiCard icon={<Headphones className="h-5 w-5" />} label="Open / Active" value={open} />
        <KpiCard icon={<CheckCircle className="h-5 w-5" />} label="Resolved" value={resolved} />
        <KpiCard icon={<Clock className="h-5 w-5" />} label="Total" value={items.length} />
        <KpiCard icon={<AlertTriangle className="h-5 w-5" />} label="High Priority" value={highOpen} />
      </div>

      {!error && items.length === 0 ? (
        <EmptyState
          icon={<Headphones className="h-5 w-5" />}
          title="No support tickets"
          description="Tickets appear when CRM is seeded or customers open issues."
        />
      ) : (
        !error && (
          <div id="tickets">
            <Tabs defaultValue="table">
              <TabsList>
                <TabsTrigger value="table">Table</TabsTrigger>
                <TabsTrigger value="kanban">Kanban</TabsTrigger>
              </TabsList>
              <TabsContent value="table" className="mt-6">
                <DataTable
                  columns={tableColumns}
                  data={items}
                  searchKey="subject"
                  searchPlaceholder="Search tickets…"
                  exportable
                  exportFilename="tickets"
                  exportColumns={exportColumns}
                />
              </TabsContent>
              <TabsContent value="kanban" className="mt-6">
                <KanbanBoard columns={kanban} />
              </TabsContent>
            </Tabs>
          </div>
        )
      )}
    </div>
  );
}
