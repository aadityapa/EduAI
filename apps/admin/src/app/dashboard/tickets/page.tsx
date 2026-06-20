import { getTicketsPageData } from '@/lib/server-data';
import { SupportCenter } from '@/components/support-center';

export default async function TicketsPage() {
  const { data, error } = await getTicketsPageData();
  return <SupportCenter tickets={data} error={error} />;
}
