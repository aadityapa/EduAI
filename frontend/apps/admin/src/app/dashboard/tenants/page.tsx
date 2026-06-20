import { getTenantsPageData } from '@/lib/server-data';
import { TenantsDashboard } from '@/components/tenants-dashboard';

export default async function TenantsPage() {
  const { data, error } = await getTenantsPageData();
  return <TenantsDashboard subscriptions={data} error={error} />;
}
