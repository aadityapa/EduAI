import { Suspense } from 'react';
import { getUsersPageData } from '@/lib/server-data';
import { UserManagement } from '@/components/user-management';
import type { RoleCode } from '@eduai/shared';
import { Skeleton } from '@eduai/ui';

interface UsersPageProps {
  searchParams: Promise<{ page?: string; role?: string; status?: string }>;
}

async function UsersTable({ searchParams }: UsersPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const { data, pagination, error } = await getUsersPageData({
    page,
    page_size: 20,
    role: params.role,
    status: params.status,
  });
  const users =
    data?.map((u) => ({
      ...u,
      roles: u.roles as RoleCode[],
    })) ?? null;

  return <UserManagement users={users} pagination={pagination} error={error} />;
}

export default function UsersPage(props: UsersPageProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <UsersTable {...props} />
    </Suspense>
  );
}
