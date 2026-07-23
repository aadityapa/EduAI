'use client';

import { useMemo, useState } from 'react';
import type { ColumnDef, CsvColumn } from '@eduai/ui';
import {
  DataTable,
  EmptyState,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@eduai/ui';
import { Search, Shield } from 'lucide-react';
import { PageHeader } from './page-header';
import { ApiError } from '@/components/api-error';
import type { ActivityRecord, AuditRecord } from '@/lib/admin-api';

export function AuditCenter({
  auditLogs,
  activityLogs,
  error,
}: {
  auditLogs: AuditRecord[] | null;
  activityLogs: ActivityRecord[] | null;
  error?: string;
}) {
  const [filter, setFilter] = useState('');

  const filteredAudit = useMemo(() => {
    const audit = auditLogs ?? [];
    const q = filter.toLowerCase();
    if (!q) return audit;
    return audit.filter(
      (l) =>
        l.action.toLowerCase().includes(q) ||
        (l.resource ?? '').toLowerCase().includes(q) ||
        (l.userId ?? '').toLowerCase().includes(q),
    );
  }, [auditLogs, filter]);

  const filteredActivity = useMemo(() => {
    const activity = activityLogs ?? [];
    const q = filter.toLowerCase();
    if (!q) return activity;
    return activity.filter(
      (l) =>
        l.action.toLowerCase().includes(q) ||
        JSON.stringify(l.metadata ?? {})
          .toLowerCase()
          .includes(q),
    );
  }, [activityLogs, filter]);

  const auditColumns: ColumnDef<AuditRecord>[] = [
    { accessorKey: 'action', header: 'Action' },
    {
      accessorKey: 'resource',
      header: 'Resource',
      cell: ({ row }) => row.original.resource ?? '—',
    },
    {
      accessorKey: 'userId',
      header: 'User',
      cell: ({ row }) => row.original.userId?.slice(0, 12) ?? '—',
    },
    {
      accessorKey: 'createdAt',
      header: 'When',
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
    },
  ];

  const activityColumns: ColumnDef<ActivityRecord>[] = [
    { accessorKey: 'action', header: 'Action' },
    {
      id: 'metadata',
      header: 'Metadata',
      cell: ({ row }) => JSON.stringify(row.original.metadata ?? {}).slice(0, 80),
    },
    {
      accessorKey: 'createdAt',
      header: 'When',
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
    },
  ];

  const auditExport: CsvColumn<AuditRecord>[] = [
    { header: 'Action', accessor: (r) => r.action },
    { header: 'Resource', accessor: (r) => r.resource ?? '' },
    { header: 'User', accessor: (r) => r.userId ?? '' },
    { header: 'Created At', accessor: (r) => r.createdAt },
  ];

  const activityExport: CsvColumn<ActivityRecord>[] = [
    { header: 'Action', accessor: (r) => r.action },
    { header: 'Metadata', accessor: (r) => JSON.stringify(r.metadata ?? {}) },
    { header: 'Created At', accessor: (r) => r.createdAt },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Center"
        description="Live audit and activity logs from billing-service"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Audit Logs' }]}
      />

      {error && <ApiError title="Audit unavailable" message={error} />}

      <div className="relative max-w-md">
        <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Filter logs…"
          className="ps-9"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter audit logs"
        />
      </div>

      {!error && (
        <Tabs defaultValue="audit">
          <TabsList>
            <TabsTrigger value="audit">Audit ({filteredAudit.length})</TabsTrigger>
            <TabsTrigger value="activity">Activity ({filteredActivity.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="audit" className="mt-4">
            {filteredAudit.length === 0 ? (
              <EmptyState
                icon={<Shield className="h-5 w-5" />}
                title="No audit logs"
                description="Privileged actions will appear here as they occur."
              />
            ) : (
              <DataTable
                columns={auditColumns}
                data={filteredAudit}
                exportable
                exportFilename="audit-logs"
                exportColumns={auditExport}
                pageSize={25}
              />
            )}
          </TabsContent>
          <TabsContent value="activity" className="mt-4">
            {filteredActivity.length === 0 ? (
              <EmptyState
                icon={<Shield className="h-5 w-5" />}
                title="No activity logs"
                description="Platform activity will appear when services emit events."
              />
            ) : (
              <DataTable
                columns={activityColumns}
                data={filteredActivity}
                exportable
                exportFilename="activity-logs"
                exportColumns={activityExport}
                pageSize={25}
              />
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
