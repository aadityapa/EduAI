'use client';

import { useState } from 'react';
import type { ColumnDef, CsvColumn } from '@eduai/ui';
import {
  Badge,
  Button,
  DataTable,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@eduai/ui';
import { AlertCircle, MoreHorizontal, UserPlus } from 'lucide-react';
import { ROLE_LABELS } from '@eduai/shared';
import type { RoleCode } from '@eduai/shared';
import { PageHeader } from './page-header';

interface UserRow {
  id: string;
  email: string;
  first_name: string;
  last_name?: string | null;
  roles: RoleCode[];
  status: string;
}

interface UserManagementProps {
  users: UserRow[] | null;
  error?: string | null;
}

export function UserManagement({ users, error }: UserManagementProps) {
  const items = users ?? [];
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const exportColumns: CsvColumn<UserRow>[] = [
    { header: 'First Name', accessor: (row) => row.first_name },
    { header: 'Last Name', accessor: (row) => row.last_name ?? '' },
    { header: 'Email', accessor: (row) => row.email },
    { header: 'Roles', accessor: (row) => row.roles.join(', ') },
    { header: 'Status', accessor: (row) => row.status },
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
          <Button size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        }
      />

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={items}
        searchKey="email"
        searchPlaceholder="Search by email…"
        exportable
        exportFilename="users"
        exportColumns={exportColumns}
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
                <p className="text-sm text-muted-foreground">Activity logs available in Audit Center.</p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
