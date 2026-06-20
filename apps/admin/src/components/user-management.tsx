'use client';

import { useEffect, useState } from 'react';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@eduai/ui';
import { ROLE_LABELS } from '@eduai/shared';
import type { RoleCode } from '@eduai/shared';

interface UserRow {
  id: string;
  email: string;
  first_name: string;
  last_name?: string;
  roles: RoleCode[];
  status: string;
}

export function UserManagement({ accessToken }: { accessToken?: string }) {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      if (!accessToken) {
        setError('No access token — sign in via identity service');
        setLoading(false);
        return;
      }
      try {
        const base = process.env.NEXT_PUBLIC_IDENTITY_SERVICE_URL ?? 'http://localhost:3001';
        const res = await fetch(`${base}/api/v1/users?page_size=50`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error('Failed to load users');
        const json = await res.json();
        setUsers(json.data ?? []);
      } catch {
        setError('Could not fetch users. Ensure identity-service is running.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [accessToken]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <p className="text-sm text-muted-foreground">Loading users…</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Email</th>
                  <th className="pb-3 pr-4">Roles</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-border/50">
                    <td className="py-3 pr-4">
                      {u.first_name} {u.last_name ?? ''}
                    </td>
                    <td className="py-3 pr-4">{u.email}</td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-1">
                        {u.roles.map((r) => (
                          <Badge key={r} variant="secondary">
                            {ROLE_LABELS[r]}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge variant={u.status === 'active' ? 'success' : 'outline'}>{u.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <p className="py-4 text-sm text-muted-foreground">No users found. Run pnpm db:seed.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
