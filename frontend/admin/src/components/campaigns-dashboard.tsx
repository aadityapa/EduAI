'use client';

import { useMemo } from 'react';
import type { ColumnDef, CsvColumn } from '@eduai/ui';
import { Badge, Button, DataTable, EmptyState, KpiCard } from '@eduai/ui';
import { Mail, Megaphone, Plus } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { ApiError } from '@/components/api-error';
import type { CampaignRecord } from '@/lib/admin-api';
import { formatInr, toNumber } from '@/lib/format';

function campaignSent(campaign: CampaignRecord): number {
  const meta = campaign.metadata ?? {};
  const sent = meta.sent ?? meta.emailsSent ?? meta.recipients;
  return typeof sent === 'number' ? sent : 0;
}

function campaignOpened(campaign: CampaignRecord): number {
  const meta = campaign.metadata ?? {};
  const opened = meta.opened ?? meta.opens;
  return typeof opened === 'number' ? opened : 0;
}

interface CampaignsDashboardProps {
  campaigns: CampaignRecord[] | null;
  error?: string | null;
}

type CampaignRow = {
  id: string;
  name: string;
  channel: string;
  status: string;
  sent: number;
  opened: number;
  budget: number;
};

export function CampaignsDashboard({ campaigns, error }: CampaignsDashboardProps) {
  const rows: CampaignRow[] = useMemo(
    () =>
      (campaigns ?? []).map((c) => ({
        id: c.id,
        name: c.name,
        channel: c.channel,
        status: c.status,
        sent: campaignSent(c),
        opened: campaignOpened(c),
        budget: toNumber(c.budget ?? undefined),
      })),
    [campaigns],
  );

  const activeCount = rows.filter((c) => c.status === 'active').length;
  const totalSent = rows.reduce((sum, c) => sum + c.sent, 0);
  const totalOpened = rows.reduce((sum, c) => sum + c.opened, 0);
  const openRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;

  const columns: ColumnDef<CampaignRow>[] = [
    { accessorKey: 'name', header: 'Campaign' },
    { accessorKey: 'channel', header: 'Channel' },
    {
      accessorKey: 'sent',
      header: 'Sent',
      cell: ({ row }) => row.original.sent.toLocaleString(),
    },
    {
      id: 'openRate',
      header: 'Open rate',
      cell: ({ row }) =>
        row.original.sent > 0
          ? `${Math.round((row.original.opened / row.original.sent) * 100)}%`
          : '—',
    },
    {
      accessorKey: 'budget',
      header: 'Budget',
      cell: ({ row }) => (row.original.budget ? formatInr(row.original.budget) : '—'),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.status === 'active'
              ? 'success'
              : row.original.status === 'draft'
                ? 'warning'
                : 'secondary'
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
  ];

  const exportColumns: CsvColumn<CampaignRow>[] = [
    { header: 'Name', accessor: (r) => r.name },
    { header: 'Channel', accessor: (r) => r.channel },
    { header: 'Sent', accessor: (r) => r.sent },
    { header: 'Opened', accessor: (r) => r.opened },
    { header: 'Budget', accessor: (r) => r.budget },
    { header: 'Status', accessor: (r) => r.status },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campaigns"
        description="Marketing campaigns, email blasts, and engagement drives"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Campaigns' }]}
        actions={
          <Button size="sm">
            <Plus className="me-2 h-4 w-4" />
            New Campaign
          </Button>
        }
      />

      {error && <ApiError title="Campaigns unavailable" message={error} />}

      <div className="grid gap-3 sm:grid-cols-3">
        <KpiCard icon={<Megaphone className="h-5 w-5" />} label="Active Campaigns" value={activeCount} />
        <KpiCard icon={<Mail className="h-5 w-5" />} label="Total Sent" value={totalSent.toLocaleString()} />
        <KpiCard
          icon={<Megaphone className="h-5 w-5" />}
          label="Open Rate"
          value={totalSent > 0 ? `${openRate}%` : '—'}
        />
      </div>

      {!error && rows.length === 0 ? (
        <EmptyState
          icon={<Megaphone className="h-5 w-5" />}
          title="No campaigns yet"
          description="Create campaigns via billing CRM when ready."
        />
      ) : (
        !error && (
          <DataTable
            columns={columns}
            data={rows}
            searchKey="name"
            searchPlaceholder="Search campaigns…"
            exportable
            exportFilename="campaigns"
            exportColumns={exportColumns}
          />
        )
      )}
    </div>
  );
}
