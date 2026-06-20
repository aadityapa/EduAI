import { getSchoolsPageData } from '@/lib/server-data';
import { SchoolsDashboard } from '@/components/schools-dashboard';

export default async function SchoolsPage() {
  const { data, error } = await getSchoolsPageData();
  return <SchoolsDashboard schools={data} error={error} />;
}
