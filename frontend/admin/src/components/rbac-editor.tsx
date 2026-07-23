'use client';

import { useMemo, useState } from 'react';
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  EmptyState,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@eduai/ui';
import { PERMISSIONS, ROLE_PERMISSIONS } from '@eduai/auth';
import { ROLE_LABELS, ROLES, type RoleCode } from '@eduai/shared';
import { KeyRound } from 'lucide-react';
import { PageHeader } from '@/components/page-header';

const ROLE_OPTIONS = Object.values(ROLES) as RoleCode[];

/**
 * Read-only RBAC matrix backed by `@eduai/auth` ROLE_PERMISSIONS catalog.
 * Mutations require identity role-admin APIs (Phase 6) — not invented here.
 */
export function RbacEditor() {
  const [role, setRole] = useState<RoleCode>('tenant_admin');
  const granted = useMemo(() => new Set(ROLE_PERMISSIONS[role] ?? []), [role]);

  const byResource = useMemo(() => {
    const map = new Map<string, typeof PERMISSIONS>();
    for (const p of PERMISSIONS) {
      const list = map.get(p.resource) ?? [];
      list.push(p);
      map.set(p.resource, list);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="RBAC Editor"
        description="Permission matrix from identity catalog — view-only until role mutation APIs ship"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'RBAC' }]}
      />

      <div className="flex flex-wrap items-center gap-3">
        <Select value={role} onValueChange={(v) => setRole(v as RoleCode)}>
          <SelectTrigger className="w-56" aria-label="Select role">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((r) => (
              <SelectItem key={r} value={r}>
                {ROLE_LABELS[r]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant="secondary">
          {granted.size} / {PERMISSIONS.length} permissions
        </Badge>
        <Badge variant="outline">Read-only</Badge>
      </div>

      {PERMISSIONS.length === 0 ? (
        <EmptyState
          icon={<KeyRound className="h-5 w-5" />}
          title="No permissions catalog"
          description="Ensure @eduai/auth is built and ROLE_PERMISSIONS is exported."
        />
      ) : (
        <ScrollArea className="h-[calc(100vh-16rem)] rounded-lg border">
          <div className="space-y-4 p-4">
            {byResource.map(([resource, perms]) => (
              <Card key={resource}>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-semibold capitalize">{resource}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pb-4">
                  {perms.map((p) => {
                    const checked = granted.has(p.code);
                    return (
                      <label
                        key={p.code}
                        className="flex items-start gap-3 rounded-md border px-3 py-2 text-sm"
                      >
                        <Checkbox checked={checked} disabled aria-readonly className="mt-0.5" />
                        <span className="min-w-0 flex-1">
                          <span className="font-mono text-xs">{p.code}</span>
                          {p.description && (
                            <span className="mt-0.5 block text-muted-foreground">{p.description}</span>
                          )}
                        </span>
                      </label>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
