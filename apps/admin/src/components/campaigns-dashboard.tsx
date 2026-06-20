'use client';

import { Badge, Button, Card, CardContent, KpiCard } from '@eduai/ui';
import { AlertCircle, Mail, Megaphone, Plus } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import type { CampaignRecord } from '@/lib/admin-api';

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

export function CampaignsDashboard({ campaigns, error }: CampaignsDashboardProps) {
  const items = campaigns ?? [];
  const activeCount = items.filter((c) => c.status === 'active').length;
  const totalSent = items.reduce((sum, c) => sum + campaignSent(c), 0);
  const totalOpened = items.reduce((sum, c) => sum + campaignOpened(c), 0);
  const openRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campaigns"
        description="Marketing campaigns, email blasts, and engagement drives"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Campaigns' }]}
        actions={<Button size="sm"><Plus className="mr-2 h-4 w-4" />New Campaign</Button>}
      />

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard icon={<Megaphone className="h-5 w-5" />} label="Active Campaigns" value={activeCount} />
        <KpiCard icon={<Mail className="h-5 w-5" />} label="Total Sent" value={totalSent.toLocaleString()} />
        <KpiCard icon={<Megaphone className="h-5 w-5" />} label="Open Rate" value={totalSent > 0 ? `${openRate}%` : '—'} />
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No campaigns yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((c) => {
            const sent = campaignSent(c);
            const opened = campaignOpened(c);
            const rate = sent > 0 ? Math.round((opened / sent) * 100) : null;
            return (
              <Card key={c.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {c.channel}
                      {sent > 0 ? ` · ${sent.toLocaleString()} sent${rate != null ? ` · ${rate}% opened` : ''}` : ''}
                    </p>
                  </div>
                  <Badge
                    variant={
                      c.status === 'active' ? 'success' : c.status === 'draft' ? 'warning' : 'secondary'
                    }
                  >
                    {c.status}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
