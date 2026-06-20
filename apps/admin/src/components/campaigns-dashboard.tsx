'use client';

import { Badge, Button, Card, CardContent, KpiCard } from '@eduai/ui';
import { Mail, Megaphone, Plus, Users } from 'lucide-react';
import { PageHeader } from '@/components/page-header';

const campaigns = [
  { name: 'Summer Enrollment 2025', channel: 'Email', sent: 12500, opened: 4200, status: 'active' },
  { name: 'AI Tutor Launch', channel: 'In-app', sent: 8200, opened: 6100, status: 'completed' },
  { name: 'Parent Engagement Drive', channel: 'SMS', sent: 3400, opened: 2100, status: 'scheduled' },
];

export function CampaignsDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Campaigns"
        description="Marketing campaigns, email blasts, and engagement drives"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Campaigns' }]}
        actions={<Button size="sm"><Plus className="mr-2 h-4 w-4" />New Campaign</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard icon={<Megaphone className="h-5 w-5" />} label="Active Campaigns" value="1" />
        <KpiCard icon={<Mail className="h-5 w-5" />} label="Emails Sent" value="24.1K" trend={{ value: 22 }} />
        <KpiCard icon={<Users className="h-5 w-5" />} label="Open Rate" value="38%" trend={{ value: 4.2 }} />
      </div>

      <div className="space-y-3">
        {campaigns.map((c) => (
          <Card key={c.name}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-sm text-muted-foreground">{c.channel} · {c.sent.toLocaleString()} sent · {Math.round(c.opened / c.sent * 100)}% opened</p>
              </div>
              <Badge variant={c.status === 'active' ? 'success' : c.status === 'scheduled' ? 'warning' : 'secondary'}>{c.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
