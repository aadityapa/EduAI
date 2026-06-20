import { getCampaignsPageData } from '@/lib/server-data';
import { CampaignsDashboard } from '@/components/campaigns-dashboard';

export default async function CampaignsPage() {
  const { data, error } = await getCampaignsPageData();
  return <CampaignsDashboard campaigns={data} error={error} />;
}
