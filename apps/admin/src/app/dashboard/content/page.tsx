import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { isAdminRole } from '@eduai/auth';
import { AdminShell } from '@/components/admin-shell';

export default async function ContentPage() {
  const session = await auth();
  if (!session?.user || !isAdminRole(session.user.roles)) redirect('/login');

  return (
    <AdminShell user={session.user}>
      <h1 className="text-2xl font-semibold">Content Management</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Manage courses, lessons, and published content. Full CMS editor ships in Sprint 5.
      </p>
    </AdminShell>
  );
}
