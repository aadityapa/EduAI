'use client';

import { useMemo } from 'react';
import type { ColumnDef, CsvColumn } from '@eduai/ui';
import {
  DataTable,
  EmptyState,
  KanbanBoard,
  KpiCard,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type KanbanColumn,
} from '@eduai/ui';
import { Filter, Target, TrendingUp, Users } from 'lucide-react';
import { PageHeader } from './page-header';
import { ApiError } from '@/components/api-error';
import type { LeadRecord } from '@/lib/admin-api';

const STAGES: { id: string; title: string }[] = [
  { id: 'new', title: 'New' },
  { id: 'contacted', title: 'Contacted' },
  { id: 'qualified', title: 'Qualified' },
  { id: 'converted', title: 'Converted' },
  { id: 'lost', title: 'Lost' },
];

function toKanban(leads: LeadRecord[]): KanbanColumn[] {
  return STAGES.map((stage) => ({
    id: stage.id,
    title: stage.title,
    items: leads
      .filter((l) => l.status === stage.id)
      .map((l) => ({
        id: l.id,
        title: l.name,
        description: l.email,
        tags: l.source ? [l.source] : undefined,
      })),
  }));
}

function sourceBreakdown(leads: LeadRecord[]) {
  const map = new Map<string, number>();
  for (const l of leads) {
    const s = l.source ?? 'Unknown';
    map.set(s, (map.get(s) ?? 0) + 1);
  }
  return [...map.entries()].map(([source, count]) => ({ source, count }));
}

export function LeadsCrm({ leads, error }: { leads: LeadRecord[] | null; error?: string }) {
  const items = leads ?? [];
  const columns = toKanban(items);
  const sources = sourceBreakdown(items);
  const qualified = items.filter((l) => l.status === 'qualified' || l.status === 'converted').length;
  const conversion = items.length ? Math.round((qualified / items.length) * 100) : 0;

  const tableColumns: ColumnDef<LeadRecord>[] = useMemo(
    () => [
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'email', header: 'Email' },
      {
        accessorKey: 'organization',
        header: 'Organization',
        cell: ({ row }) => row.original.organization ?? '—',
      },
      {
        accessorKey: 'source',
        header: 'Source',
        cell: ({ row }) => row.original.source ?? '—',
      },
      { accessorKey: 'status', header: 'Status' },
    ],
    [],
  );

  const exportColumns: CsvColumn<LeadRecord>[] = [
    { header: 'Name', accessor: (r) => r.name },
    { header: 'Email', accessor: (r) => r.email },
    { header: 'Organization', accessor: (r) => r.organization ?? '' },
    { header: 'Source', accessor: (r) => r.source ?? '' },
    { header: 'Status', accessor: (r) => r.status },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads CRM"
        description="Live pipeline from billing-service CRM"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Leads' }]}
      />

      {error && <ApiError title="Leads unavailable" message={error} />}

      <div className="grid gap-3 sm:grid-cols-4">
        <KpiCard icon={<Users className="h-5 w-5" />} label="Total Leads" value={items.length} />
        <KpiCard icon={<Filter className="h-5 w-5" />} label="Qualified+" value={qualified} />
        <KpiCard icon={<Target className="h-5 w-5" />} label="Conversion" value={`${conversion}%`} />
        <KpiCard icon={<TrendingUp className="h-5 w-5" />} label="Sources" value={sources.length} />
      </div>

      {!error && items.length === 0 ? (
        <EmptyState
          icon={<Users className="h-5 w-5" />}
          title="No leads yet"
          description="Add leads via CRM API or seed script."
        />
      ) : (
        !error && (
          <Tabs defaultValue="table">
            <TabsList>
              <TabsTrigger value="table">Table</TabsTrigger>
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
              <TabsTrigger value="sources">Sources</TabsTrigger>
            </TabsList>
            <TabsContent value="table" className="mt-6">
              <DataTable
                columns={tableColumns}
                data={items}
                searchKey="name"
                searchPlaceholder="Search leads…"
                exportable
                exportFilename="leads"
                exportColumns={exportColumns}
              />
            </TabsContent>
            <TabsContent value="kanban" className="mt-6">
              <KanbanBoard columns={columns} />
            </TabsContent>
            <TabsContent value="sources" className="mt-6">
              <div className="grid gap-4 sm:grid-cols-3">
                {sources.map((s) => (
                  <div key={s.source} className="rounded-lg border p-4">
                    <p className="font-medium">{s.source}</p>
                    <p className="text-2xl font-bold">{s.count}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )
      )}
    </div>
  );
}
