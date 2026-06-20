import { SubscriptionsDashboard } from '@/components/subscriptions-dashboard';
import { billingApi, AdminApiError } from '@/lib/admin-api';

export default async function SubscriptionsPage() {
  let items = null;
  let error: string | null = null;
  try {
    items = await billingApi.getSubscriptions();
  } catch (err) {
    error = err instanceof AdminApiError ? err.message : 'Failed to load subscriptions';
  }

  return <SubscriptionsDashboard items={items} error={error} />;
}
