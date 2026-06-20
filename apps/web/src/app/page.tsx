import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { resolvePostLoginDestination } from '@eduai/shared';

export default async function HomePage() {
  const session = await auth();
  if (session?.user) {
    redirect(resolvePostLoginDestination(session.user.roles));
  }
  redirect('/login');
}
