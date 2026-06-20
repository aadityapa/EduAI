'use client';

import { ActivityFeed, Input, Tabs, TabsContent, TabsList, TabsTrigger } from '@eduai/ui';
import { AlertCircle, Search } from 'lucide-react';
import { PageHeader } from './page-header';
import type { ActivityRecord, AuditRecord } from '@/lib/admin-api';

function mapAudit(logs: AuditRecord[]) {
  return logs.map((l) => ({
    id: l.id,
    title: l.action,
    description: l.resource ?? '',
    timestamp: new Date(l.createdAt).toLocaleString(),
    type: 'info' as const,
  }));
}

function mapActivity(logs: ActivityRecord[]) {
  return logs.map((l) => ({
    id: l.id,
    title: l.action,
    description: JSON.stringify(l.metadata ?? {}).slice(0, 80),
    timestamp: new Date(l.createdAt).toLocaleString(),
    type: 'info' as const,
  }));
}

export function AuditCenter({
  auditLogs,
  activityLogs,
  error,
}: {
  auditLogs: AuditRecord[] | null;
  activityLogs: ActivityRecord[] | null;
  error?: string;
}) {
  const audit = auditLogs ?? [];
  const activity = activityLogs ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Center"
        description="Live audit and activity logs from billing-service"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Audit Logs' }]}
      />

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Filter logs…" className="pl-9" aria-label="Filter audit logs" />
      </div>

      <Tabs defaultValue="audit">
        <TabsList>
          <TabsTrigger value="audit">Audit ({audit.length})</TabsTrigger>
          <TabsTrigger value="activity">Activity ({activity.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="audit" className="mt-4">
          {audit.length === 0 ? (
            <p className="text-sm text-muted-foreground">No audit logs recorded yet.</p>
          ) : (
            <ActivityFeed items={mapAudit(audit)} />
          )}
        </TabsContent>
        <TabsContent value="activity" className="mt-4">
          {activity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity logs recorded yet.</p>
          ) : (
            <ActivityFeed items={mapActivity(activity)} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
