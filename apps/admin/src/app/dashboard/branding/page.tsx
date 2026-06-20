import { getBrandingPageData } from '@/lib/server-data';
import { BrandingDashboard } from '@/components/branding-dashboard';

export default async function BrandingPage() {
  const { data, error } = await getBrandingPageData();
  return <BrandingDashboard branding={data} error={error} />;
}
