import { identityApi, AdminApiError } from '@/lib/admin-api';
import { PrivacyDsrPanel } from '@/components/privacy-dsr-panel';

export default async function PrivacyPage() {
  let consents = null;
  let dsrs = null;
  let error: string | null = null;

  try {
    const [c, d] = await Promise.all([
      identityApi.getConsentTenant(),
      identityApi.getDsrTenant(),
    ]);
    consents = c;
    dsrs = d;
  } catch (err) {
    error = err instanceof AdminApiError ? err.message : 'Failed to load privacy data';
  }

  return <PrivacyDsrPanel consents={consents} dsrs={dsrs} error={error} />;
}
