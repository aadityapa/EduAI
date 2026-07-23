'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { ColumnDef, CsvColumn } from '@eduai/ui';
import {
  Badge,
  Button,
  DataTable,
  EmptyState,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@eduai/ui';
import { MoreHorizontal, UserPlus, Users } from 'lucide-react';
import { ROLE_LABELS } from '@eduai/shared';
import type { RoleCode } from '@eduai/shared';
import { PageHeader } from './page-header';
import { ApiError } from '@/components/api-error';
import type { PaginationMeta } from '@/lib/admin-api';

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
  pagination: PaginationMeta | null;
  error?: string | null;
}

export function UserManagement({ users, pagination, error }: UserManagementProps) {
  const items = users ?? [];
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const columns: ColumnDef<UserRow>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => `${row.original.first_name} ${row.original.last_name ?? ''}`.trim(),
      },
      { accessorKey: 'email', header: 'Email' },
      {
        accessorKey: 'roles',
        header: 'Role',
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.roles.map((r) => (
              <Badge key={r} variant="secondary">
                {ROLE_LABELS[r] ?? r}
              </Badge>
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
    ],
    [],
  );

  const exportColumns: CsvColumn<UserRow>[] = [
    { header: 'First Name', accessor: (row) => row.first_name },
    { header: 'Last Name', accessor: (row) => row.last_name ?? '' },
    { header: 'Email', accessor: (row) => row.email },
    { header: 'Roles', accessor: (row) => row.roles.join(', ') },
    { header: 'Status', accessor: (row) => row.status },
  ];

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Search, filter, and manage platform users"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Users' }]}
        actions={
          <Button size="sm">
            <UserPlus className="me-2 h-4 w-4" />
            Add User
          </Button>
        }
      />

      {error && <ApiError title="Users unavailable" message={error} />}

      {!error && items.length === 0 ? (
        <EmptyState
          icon={<Users className="h-5 w-5" />}
          title="No users found"
          description="Users will appear when identity-service is running and seeded."
        />
      ) : (
        !error && (
          <>
            <DataTable
              columns={columns}
              data={items}
              searchKey="email"
              searchPlaceholder="Search by email…"
              exportable
              exportFilename="users"
              exportColumns={exportColumns}
              pageSize={pagination?.page_size ?? 20}
              onRowClick={(row) => {
                setSelectedUser(row);
                setDrawerOpen(true);
              }}
            />
            {pagination && pagination.total_pages > 1 && (
              <div className="flex items-center justify-between text-sm">
                <p className="text-muted-foreground">
                  Page {pagination.page} of {pagination.total_pages} · {pagination.total_items} users
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.has_prev}
                    onClick={() => goToPage(pagination.page - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.has_next}
                    onClick={() => goToPage(pagination.page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )
      )}

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              {selectedUser
                ? `${selectedUser.first_name} ${selectedUser.last_name ?? ''}`.trim()
                : 'User Details'}
            </SheetTitle>
          </SheetHeader>
          {selectedUser && (
            <div className="mt-6 space-y-6">
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="font-medium">{selectedUser.email}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Status</dt>
                  <dd>
                    <Badge variant={selectedUser.status === 'active' ? 'success' : 'outline'}>
                      {selectedUser.status}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Roles</dt>
                  <dd className="flex flex-wrap gap-1">
                    {selectedUser.roles.map((r) => (
                      <Badge key={r} variant="secondary">
                        {ROLE_LABELS[r] ?? r}
                      </Badge>
                    ))}
                  </dd>
                </div>
              </dl>
              <p className="text-sm text-muted-foreground">
                Activity logs available in Audit Center.
              </p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
