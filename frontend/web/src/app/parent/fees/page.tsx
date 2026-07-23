import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Receipt } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { ApiError } from '@/components/api-error';
import { PageMotion } from '@/components/page-motion';
import { getParentFees, ErpApiError } from '@/lib/erp-api';
import { EmptyState, FeeInvoiceCard, StitchPageHeader } from '@eduai/ui';

export default async function ParentFeesPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (!session.user.roles.includes('parent')) redirect('/dashboard');

  let fees = null;
  let loadError: string | null = null;

  try {
    fees = await getParentFees();
  } catch (err) {
    loadError = err instanceof ErpApiError ? err.message : 'Failed to load fees';
  }

  return (
    <DashboardShell title="Fee Status" portal="parent">
      <PageMotion>
        <StitchPageHeader
          title="Fee Status"
          description="Calm overview of outstanding and paid school fees."
        />

        {loadError && (
          <div className="mb-6">
            <ApiError message={loadError} />
          </div>
        )}

        {!loadError && !fees?.length && (
          <EmptyState
            icon={<Receipt className="h-5 w-5" />}
            title="No fee records yet"
            description="Once your school posts invoices, they will appear here."
            action={
              <Link href="/parent/dashboard" className="text-sm font-medium text-primary hover:underline">
                Back to family overview
              </Link>
            }
          />
        )}

        <div className="grid gap-5">
          {fees?.map((item, i) => {
            const due = item.summary.totalDue;
            const paid = item.summary.totalPaid;
            const status = due > 0 ? (paid > 0 ? 'due' : 'due') : 'paid';
            return (
              <FeeInvoiceCard
                key={i}
                invoiceNumber={`FEE-${i + 1}`}
                title={`${item.student.firstName} ${item.student.lastName ?? ''}`.trim()}
                amount={due > 0 ? due : paid}
                currency="INR"
                status={status}
                studentName={`${item.student.firstName} ${item.student.lastName ?? ''}`.trim()}
              />
            );
          })}
        </div>
      </PageMotion>
    </DashboardShell>
  );
}
