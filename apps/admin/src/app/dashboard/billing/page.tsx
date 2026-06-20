import { getRevenuePageData } from '@/lib/server-data';
import { RevenueDashboard } from '@/components/revenue-dashboard';

export default async function BillingPage() {
  const { revenue, invoices } = await getRevenuePageData();
  return (
    <RevenueDashboard
      revenue={revenue.data}
      invoices={(invoices.data as never[]) ?? null}
      error={revenue.error ?? invoices.error}
    />
  );
}
