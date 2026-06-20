import { getLeadsPageData } from '@/lib/server-data';
import { LeadsCrm } from '@/components/leads-crm';

export default async function LeadsPage() {
  const { data, error } = await getLeadsPageData();
  return <LeadsCrm leads={data} error={error} />;
}
