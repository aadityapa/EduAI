'use client';

import type { ColumnDef } from '@eduai/ui';
import { Badge, DataTable, EmptyState, KpiCard } from '@eduai/ui';
import { FileKey, Scale, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { ApiError } from '@/components/api-error';
import type { ConsentRecord, DsrRecord } from '@/lib/admin-api';

interface PrivacyDsrPanelProps {
  consents?: ConsentRecord[] | null;
  dsrs?: DsrRecord[] | null;
  error?: string | null;
}

export function PrivacyDsrPanel({ consents, dsrs, error }: PrivacyDsrPanelProps) {
  const consentCols: ColumnDef<ConsentRecord>[] = [
    { accessorKey: 'purpose', header: 'Purpose' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <Badge variant="outline">{row.original.status}</Badge>,
    },
    { accessorKey: 'subject_user_id', header: 'Subject' },
    { accessorKey: 'policy_version', header: 'Policy' },
    { accessorKey: 'created_at', header: 'Created' },
  ];

  const dsrCols: ColumnDef<DsrRecord>[] = [
    { accessorKey: 'type', header: 'Type' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <Badge variant="outline">{row.original.status}</Badge>,
    },
    { accessorKey: 'subject_user_id', header: 'Subject' },
    { accessorKey: 'due_at', header: 'Due' },
    { accessorKey: 'completed_at', header: 'Completed' },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Privacy & DSR"
        description="DPDP consent records and data-subject request queue for this tenant."
      />

      {error && <ApiError message={error} />}

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard icon={<ShieldCheck className="h-5 w-5" />} label="Consent records" value={consents?.length ?? 0} />
        <KpiCard icon={<Scale className="h-5 w-5" />} label="Open DSRs" value={(dsrs ?? []).filter((d) => d.status !== 'completed' && d.status !== 'rejected' && d.status !== 'cancelled').length} />
        <KpiCard icon={<FileKey className="h-5 w-5" />} label="Completed DSRs" value={(dsrs ?? []).filter((d) => d.status === 'completed').length} />
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Consent</h2>
        {!error && !consents?.length ? (
          <EmptyState title="No consent records" description="Grants from parents/students will appear here." />
        ) : (
          <DataTable
            columns={consentCols}
            data={consents ?? []}
            searchPlaceholder="Filter consent…"
            exportFilename="consent-records"
          />
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Data subject requests</h2>
        {!error && !dsrs?.length ? (
          <EmptyState title="No DSR queue items" description="Export and erasure requests will appear here for processing." />
        ) : (
          <DataTable
            columns={dsrCols}
            data={dsrs ?? []}
            searchPlaceholder="Filter DSR…"
            exportFilename="dsr-requests"
          />
        )}
      </section>
    </div>
  );
}
