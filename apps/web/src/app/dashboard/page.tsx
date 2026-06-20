import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { resolvePostLoginDestination } from '@eduai/shared';

export default async function DashboardRedirect() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  redirect(resolvePostLoginDestination(session.user.roles));
}
