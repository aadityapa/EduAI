import { getAuditPageData } from '@/lib/server-data';
import { AuditCenter } from '@/components/audit-center';

export default async function AuditLogsPage() {
  const { audit, activity } = await getAuditPageData();
  return (
    <AuditCenter
      auditLogs={audit.data}
      activityLogs={activity.data}
      error={audit.error ?? activity.error}
    />
  );
}
