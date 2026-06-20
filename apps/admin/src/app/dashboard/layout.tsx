import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { isAdminRole } from '@eduai/auth';
import { AdminShell } from '@/components/admin-shell';
import { Providers } from '@/components/providers';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (!isAdminRole(session.user.roles)) redirect('/login');

  return (
    <Providers>
      <AdminShell user={session.user}>{children}</AdminShell>
    </Providers>
  );
}
