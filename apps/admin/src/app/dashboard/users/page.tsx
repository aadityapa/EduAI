import { getUsersPageData } from '@/lib/server-data';
import { UserManagement } from '@/components/user-management';
import type { RoleCode } from '@eduai/shared';

export default async function UsersPage() {
  const { data, error } = await getUsersPageData();
  const users = data?.map((u) => ({
    ...u,
    roles: u.roles as RoleCode[],
  })) ?? null;

  return <UserManagement users={users} error={error} />;
}
