import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getDashboardRoute } from '@eduai/shared';

export default async function DashboardRedirect() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  redirect(getDashboardRoute(session.user.roles));
}
