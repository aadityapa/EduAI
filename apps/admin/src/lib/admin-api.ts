import { auth } from '@/auth';

const BILLING_URL = process.env.BILLING_SERVICE_URL ?? process.env.NEXT_PUBLIC_BILLING_SERVICE_URL ?? 'http://localhost:3006';
const ERP_URL = process.env.ERP_SERVICE_URL ?? process.env.NEXT_PUBLIC_ERP_SERVICE_URL ?? 'http://localhost:3005';

export class AdminApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function fetchService<T>(baseUrl: string, path: string): Promise<T> {
  const session = await auth();
  const token = session?.user?.accessToken;
  if (!token) throw new AdminApiError(401, 'Not authenticated');

  const res = await fetch(`${baseUrl}/api/v1${path}`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = (await res.json()) as { error?: { message?: string } };
      message = body.error?.message ?? message;
    } catch {
      // ignore
    }
    throw new AdminApiError(res.status, message);
  }

  const json = (await res.json()) as { data: T };
  return json.data;
}

export const billingApi = {
  getRevenue: () => fetchService<Record<string, number>>(BILLING_URL, '/analytics/revenue'),
  getPlans: () => fetchService<unknown[]>(BILLING_URL, '/plans'),
  getSubscriptions: () => fetchService<unknown[]>(BILLING_URL, '/subscriptions'),
  getInvoices: () => fetchService<unknown[]>(BILLING_URL, '/invoices'),
  getCoupons: () => fetchService<unknown[]>(BILLING_URL, '/coupons'),
  getLeads: () => fetchService<unknown[]>(BILLING_URL, '/crm/leads'),
  getTickets: () => fetchService<unknown[]>(BILLING_URL, '/crm/tickets'),
  getCampaigns: () => fetchService<unknown[]>(BILLING_URL, '/crm/campaigns'),
  getAuditLogs: () => fetchService<unknown[]>(BILLING_URL, '/crm/audit-logs'),
  getActivityLogs: () => fetchService<unknown[]>(BILLING_URL, '/crm/activity-logs'),
};

export const erpApi = {
  getAnalytics: () => fetchService<Record<string, unknown>>(ERP_URL, '/analytics/tenant'),
};
