'use client';

import { useMemo } from 'react';
import type { ColumnDef, CsvColumn } from '@eduai/ui';
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  EmptyState,
  KpiCard,
} from '@eduai/ui';
import { AlertTriangle, Lock, Shield, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { ApiError } from '@/components/api-error';
import type { AuditRecord } from '@/lib/admin-api';

interface SecurityDashboardProps {
  auditLogs?: AuditRecord[] | null;
  error?: string | null;
}

const SECURITY_KEYWORDS = ['login', 'auth', 'role', 'permission', 'session', 'fail', 'security'];

export function SecurityDashboard({ auditLogs, error }: SecurityDashboardProps) {
  const securityEvents = useMemo(
    () =>
      (auditLogs ?? []).filter((l) =>
        SECURITY_KEYWORDS.some((k) => l.action.toLowerCase().includes(k)),
      ),
    [auditLogs],
  );

  const all = auditLogs ?? [];
  const failedish = securityEvents.filter((l) =>
    /fail|deny|block|unauthor/i.test(l.action),
  ).length;

  const columns: ColumnDef<AuditRecord>[] = [
    { accessorKey: 'action', header: 'Event' },
    {
      accessorKey: 'resource',
      header: 'Resource',
      cell: ({ row }) => row.original.resource ?? '—',
    },
    {
      accessorKey: 'userId',
      header: 'Actor',
      cell: ({ row }) => row.original.userId?.slice(0, 12) ?? 'system',
    },
    {
      accessorKey: 'createdAt',
      header: 'When',
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
    },
  ];

  const exportColumns: CsvColumn<AuditRecord>[] = [
    { header: 'Event', accessor: (r) => r.action },
    { header: 'Resource', accessor: (r) => r.resource ?? '' },
    { header: 'Actor', accessor: (r) => r.userId ?? '' },
    { header: 'When', accessor: (r) => r.createdAt },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security Center"
        description="Live sessions/audit signals from CRM audit logs — session store APIs deferred"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Security' }]}
      />

      {error && <ApiError title="Security data unavailable" message={error} />}

      <div className="grid gap-3 sm:grid-cols-4">
        <KpiCard
          icon={<ShieldCheck className="h-5 w-5" />}
          label="Audit events"
          value={all.length}
        />
        <KpiCard icon={<Lock className="h-5 w-5" />} label="Security-tagged" value={securityEvents.length} />
        <KpiCard icon={<AlertTriangle className="h-5 w-5" />} label="Failure-like" value={failedish} />
        <KpiCard
          icon={<Shield className="h-5 w-5" />}
          label="Policies"
          value="Enforced"
          description="RBAC via identity JWT"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Access Policies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="flex justify-between">
              <span>Password policy</span>
              <Badge variant="success">Enforced</Badge>
            </p>
            <p className="flex justify-between">
              <span>JWT access TTL</span>
              <span className="text-muted-foreground">Short-lived</span>
            </p>
            <p className="flex justify-between">
              <span>RBAC matrix</span>
              <Badge variant="success">Live catalog</Badge>
            </p>
            <p className="flex justify-between">
              <span>Audit logging</span>
              <Badge variant="success">Enabled</Badge>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Session store</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              title="Live session list deferred"
              description="Wire identity session/revocation APIs in Phase 6. Audit events below are live."
            />
          </CardContent>
        </Card>
      </div>

      {!error && securityEvents.length === 0 ? (
        <EmptyState
          icon={<Shield className="h-5 w-5" />}
          title="No security events yet"
          description="Auth and privilege events from the audit API will appear here."
        />
      ) : (
        !error && (
          <DataTable
            columns={columns}
            data={securityEvents.length ? securityEvents : all}
            searchKey="action"
            searchPlaceholder="Filter security events…"
            exportable
            exportFilename="security-events"
            exportColumns={exportColumns}
          />
        )
      )}
    </div>
  );
}
