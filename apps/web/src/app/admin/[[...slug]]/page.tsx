import { redirect } from 'next/navigation';
import { getAdminPortalUrl } from '@eduai/shared';

/** Catch-all: forward /admin/* to the admin portal app. */
export default async function AdminCatchAllRedirect({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const path = slug?.length ? `/${slug.join('/')}` : '/dashboard';
  redirect(`${getAdminPortalUrl()}${path.startsWith('/') ? path : `/${path}`}`);
}
