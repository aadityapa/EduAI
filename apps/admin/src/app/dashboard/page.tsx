import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { isAdminRole } from '@eduai/auth';
import { AdminShell } from '@/components/admin-shell';
import { UserManagement } from '@/components/user-management';

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (!isAdminRole(session.user.roles)) redirect('/login');

  return (
    <AdminShell user={session.user}>
      <UserManagement accessToken={session.user.accessToken} />
    </AdminShell>
  );
}
