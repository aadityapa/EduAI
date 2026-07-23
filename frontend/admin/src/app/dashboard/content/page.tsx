import { getContentPageData } from '@/lib/server-data';
import { ContentManagement } from '@/components/content-management';

export default async function ContentPage() {
  const { data, error } = await getContentPageData();
  return <ContentManagement courses={data} error={error} />;
}
