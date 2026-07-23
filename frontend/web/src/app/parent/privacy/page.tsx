import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Shield } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { ApiError } from '@/components/api-error';
import { PageMotion } from '@/components/page-motion';
import { EmptyState, StitchPageHeader } from '@eduai/ui';
import {
  IdentityApiError,
  listMyConsent,
  listMyDsr,
} from '@/lib/identity-api';
import { ParentalConsentForm } from '@/components/parental-consent-form';

export default async function ParentPrivacyPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (!session.user.roles.includes('parent')) redirect('/dashboard');

  let consents: Awaited<ReturnType<typeof listMyConsent>> = [];
  let dsrs: Awaited<ReturnType<typeof listMyDsr>> = [];
  let loadError: string | null = null;

  try {
    [consents, dsrs] = await Promise.all([listMyConsent(), listMyDsr()]);
  } catch (err) {
    loadError = err instanceof IdentityApiError ? err.message : 'Failed to load privacy data';
  }

  return (
    <DashboardShell title="Privacy" portal="parent">
      <PageMotion>
        <StitchPageHeader
          title="Privacy & consent"
          description="Manage purpose-limited consent for linked children and data export or deletion requests (DPDP)."
        />

        {loadError && (
          <div className="mb-6">
            <ApiError message={loadError} />
          </div>
        )}

        <section className="mb-10 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Parental consent</h2>
          <ParentalConsentForm />
          {!loadError && !consents.length && (
            <EmptyState
              icon={<Shield className="h-5 w-5" />}
              title="No consent records yet"
              description="Grant AI tutor or analytics consent for a linked child using the form above."
            />
          )}
          {consents.length > 0 && (
            <ul className="divide-y divide-border rounded-lg border border-border">
              {consents.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                  <span className="font-medium">{c.purpose}</span>
                  <span className="text-muted-foreground">{c.status}</span>
                  <span className="text-muted-foreground">v{c.policy_version}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Your requests</h2>
          <p className="text-sm text-muted-foreground">
            Use the actions below to exercise data principal rights. Erasure is queued for school admin completion.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/parent/privacy?action=export"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Request data export
            </Link>
            <Link
              href="/parent/privacy?action=erase"
              className="rounded-md border border-border px-4 py-2 text-sm font-medium"
            >
              Request erasure
            </Link>
          </div>
          {dsrs.length > 0 && (
            <ul className="divide-y divide-border rounded-lg border border-border">
              {dsrs.map((d) => (
                <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                  <span className="font-medium">{d.type}</span>
                  <span className="text-muted-foreground">{d.status}</span>
                  <span className="text-muted-foreground">due {new Date(d.due_at).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </PageMotion>
    </DashboardShell>
  );
}
