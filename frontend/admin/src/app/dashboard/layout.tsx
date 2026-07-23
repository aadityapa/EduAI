import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { isAdminRole } from '@eduai/auth';
import { AdminShell } from '@/components/admin-shell';
import { Providers } from '@/components/providers';
import { getShellChromeData } from '@/lib/server-data';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (!isAdminRole(session.user.roles)) redirect('/login');

  const chrome = await getShellChromeData();
  const tenants =
    chrome.subs.data?.map((s) => ({
      id: s.tenant.id,
      name: s.tenant.name,
      slug: s.tenant.slug,
    })) ?? [];

  const notifications =
    chrome.activity.data?.slice(0, 8).map((a) => ({
      id: a.id,
      title: a.action,
      message: JSON.stringify(a.metadata ?? {}).slice(0, 80),
      time: new Date(a.createdAt).toLocaleString(),
      read: false,
    })) ?? [];

  return (
    <Providers>
      <AdminShell user={session.user} tenants={tenants} notifications={notifications}>
        {children}
      </AdminShell>
    </Providers>
  );
}
