import { redirect } from 'next/navigation';
import { auth, getDashboardRoute } from '@/auth';

export default async function HomePage() {
  const session = await auth();
  if (session?.user) {
    redirect(getDashboardRoute(session.user.roles));
  }
  redirect('/login');
}
