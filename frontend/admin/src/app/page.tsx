import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { isAdminRole } from '@eduai/auth';

export default async function AdminHome() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (!isAdminRole(session.user.roles)) redirect('/login?error=unauthorized');
  redirect('/dashboard');
}
