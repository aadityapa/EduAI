'use client';

import { ActivityFeed, Button, Card, CardContent, CardHeader, CardTitle, Input, Tabs, TabsContent, TabsList, TabsTrigger, toast } from '@eduai/ui';
import { Download, Search } from 'lucide-react';
import { PageHeader } from './page-header';
import { mockAuditLogs } from '@/lib/mock-data';

const logCategories = {
  activity: mockAuditLogs,
  security: mockAuditLogs.filter((l) => l.type === 'warning' || l.type === 'error'),
  login: mockAuditLogs.filter((l) => l.title.includes('login')),
  ai: [{ id: 'ai1', title: 'AI quota check', description: 'Tenant sunrise at 85%', timestamp: '30 min ago', type: 'warning' as const }],
  payment: [{ id: 'p1', title: 'Payment received', description: '₹85,000 from Demo Academy', timestamp: '1h ago', type: 'success' as const }],
  system: [{ id: 's1', title: 'Database backup', description: 'Scheduled backup completed', timestamp: '6h ago', type: 'info' as const }],
};

export function AuditCenter() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Center"
        description="Activity, security, login, AI, payment, and system logs"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Audit Center' }]}
        actions={
          <Button variant="outline" size="sm" onClick={() => toast.success('Export started')}>
            <Download className="mr-2 h-4 w-4" />Export Logs
          </Button>
        }
      />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Filter logs…" className="pl-9" aria-label="Filter audit logs" />
      </div>

      <Tabs defaultValue="activity">
        <TabsList>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="ai">AI</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        {Object.entries(logCategories).map(([key, items]) => (
          <TabsContent key={key} value={key} className="mt-6">
            <Card>
              <CardHeader><CardTitle className="text-base capitalize">{key} Logs</CardTitle></CardHeader>
              <CardContent>
                <ActivityFeed items={items} />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
