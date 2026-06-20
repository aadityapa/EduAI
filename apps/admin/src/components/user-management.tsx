'use client';

import { useEffect, useState } from 'react';
import type { ColumnDef } from '@eduai/ui';
import {
  Badge,
  Button,
  DataTable,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  ActivityFeed,
  toast,
} from '@eduai/ui';
import { Download, MoreHorizontal, UserPlus } from 'lucide-react';
import { ROLE_LABELS } from '@eduai/shared';
import type { RoleCode } from '@eduai/shared';
import { PageHeader } from './page-header';
import { mockAuditLogs, mockUsers } from '@/lib/mock-data';

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
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    async function load() {
      if (!accessToken) {
        setUsers(mockUsers as UserRow[]);
        setLoading(false);
        return;
      }
      try {
        const base = process.env.NEXT_PUBLIC_IDENTITY_SERVICE_URL ?? 'http://localhost:3001';
        const res = await fetch(`${base}/api/v1/users?page_size=50`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error('Failed');
        const json = await res.json();
        setUsers(json.data?.length ? json.data : mockUsers);
      } catch {
        setUsers(mockUsers as UserRow[]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [accessToken]);

  const columns: ColumnDef<UserRow>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => `${row.original.first_name} ${row.original.last_name ?? ''}`,
    },
    { accessorKey: 'email', header: 'Email' },
    {
      accessorKey: 'roles',
      header: 'Role',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.roles.map((r) => (
            <Badge key={r} variant="secondary">{ROLE_LABELS[r]}</Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'active' ? 'success' : 'outline'}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedUser(row.original);
            setDrawerOpen(true);
          }}
          aria-label="View user details"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Search, filter, and manage platform users"
        breadcrumbs={[
          { label: 'Admin', href: '/dashboard' },
          { label: 'Users' },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast.success('Export started', { description: 'CSV will download shortly' })}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </>
        }
      />

      <DataTable
        columns={columns}
        data={users}
        searchKey="email"
        searchPlaceholder="Search by email…"
        loading={loading}
        onRowClick={(row) => {
          setSelectedUser(row);
          setDrawerOpen(true);
        }}
      />

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              {selectedUser ? `${selectedUser.first_name} ${selectedUser.last_name ?? ''}` : 'User Details'}
            </SheetTitle>
          </SheetHeader>
          {selectedUser && (
            <div className="mt-6 space-y-6">
              <dl className="space-y-3 text-sm">
                <div><dt className="text-muted-foreground">Email</dt><dd className="font-medium">{selectedUser.email}</dd></div>
                <div><dt className="text-muted-foreground">Status</dt><dd><Badge variant={selectedUser.status === 'active' ? 'success' : 'outline'}>{selectedUser.status}</Badge></dd></div>
                <div><dt className="text-muted-foreground">Roles</dt><dd className="flex flex-wrap gap-1">{selectedUser.roles.map((r) => <Badge key={r} variant="secondary">{ROLE_LABELS[r]}</Badge>)}</dd></div>
              </dl>
              <div>
                <h4 className="mb-3 text-sm font-semibold">Activity Timeline</h4>
                <ActivityFeed items={mockAuditLogs.slice(0, 3)} />
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
