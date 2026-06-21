import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import { ApiError } from '@/components/api-error';
import { getParentFees, ErpApiError } from '@/lib/erp-api';
import { Card, CardContent, CardHeader, CardTitle } from '@eduai/ui';

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
      {loadError && <div className="mb-6"><ApiError message={loadError} /></div>}
      <div className="grid gap-6">
        {fees?.map((item, i) => (
          <Card key={i} className="glass-card">
            <CardHeader>
              <CardTitle>
                {item.student.firstName} {item.student.lastName ?? ''}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Outstanding</p>
                  <p className="text-2xl font-bold">₹{item.summary.totalDue.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Paid</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{item.summary.totalPaid.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
