import { auth } from '@/auth';
import { UserManagement } from '@/components/user-management';

export default async function UsersPage() {
  const session = await auth();
  return <UserManagement accessToken={session?.user?.accessToken} />;
}
