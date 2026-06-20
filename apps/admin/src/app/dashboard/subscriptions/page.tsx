import { getSubscriptionsPageData } from '@/lib/server-data';
import { SubscriptionsDashboard } from '@/components/subscriptions-dashboard';

export default async function SubscriptionsPage() {
  const { data, error } = await getSubscriptionsPageData();
  return <SubscriptionsDashboard items={data} error={error} />;
}
