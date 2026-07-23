import { getAuditPageData } from '@/lib/server-data';
import { SecurityDashboard } from '@/components/security-dashboard';

export default async function SecurityPage() {
  const { audit } = await getAuditPageData();
  return <SecurityDashboard auditLogs={audit.data} error={audit.error} />;
}
