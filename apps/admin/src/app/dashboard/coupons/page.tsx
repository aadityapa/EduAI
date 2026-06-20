import { getCouponsPageData } from '@/lib/server-data';
import { CouponsDashboard } from '@/components/coupons-dashboard';

export default async function CouponsPage() {
  const { data, error } = await getCouponsPageData();
  return <CouponsDashboard coupons={data} error={error} />;
}
