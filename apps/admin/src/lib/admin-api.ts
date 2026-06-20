import { auth } from '@/auth';

const BILLING_URL = process.env.BILLING_SERVICE_URL ?? process.env.NEXT_PUBLIC_BILLING_SERVICE_URL ?? 'http://localhost:3006';
const ERP_URL = process.env.ERP_SERVICE_URL ?? process.env.NEXT_PUBLIC_ERP_SERVICE_URL ?? 'http://localhost:3005';
const IDENTITY_URL = process.env.IDENTITY_SERVICE_URL ?? process.env.NEXT_PUBLIC_IDENTITY_SERVICE_URL ?? 'http://localhost:3001';
const AI_URL = process.env.AI_SERVICE_URL ?? process.env.NEXT_PUBLIC_AI_SERVICE_URL ?? 'http://localhost:3004';

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
  getLeads: () => fetchService<LeadRecord[]>(BILLING_URL, '/crm/leads'),
  getTickets: () => fetchService<TicketRecord[]>(BILLING_URL, '/crm/tickets'),
  getCampaigns: () => fetchService<unknown[]>(BILLING_URL, '/crm/campaigns'),
  getAuditLogs: () => fetchService<AuditRecord[]>(BILLING_URL, '/crm/audit-logs'),
  getActivityLogs: () => fetchService<ActivityRecord[]>(BILLING_URL, '/crm/activity-logs'),
};

export const identityApi = {
  getUsers: (query?: { page?: number; page_size?: number; role?: string; status?: string }) => {
    const params = new URLSearchParams();
    if (query?.page) params.set('page', String(query.page));
    if (query?.page_size) params.set('page_size', String(query.page_size));
    if (query?.role) params.set('role', query.role);
    if (query?.status) params.set('status', query.status);
    const qs = params.toString();
    return fetchService<unknown[]>(IDENTITY_URL, `/users${qs ? `?${qs}` : ''}`);
  },
};

export const aiAdminApi = {
  getDashboard: () => fetchService<Record<string, unknown>>(AI_URL, '/analytics/dashboard'),
};

export interface LeadRecord {
  id: string;
  name: string;
  email: string;
  organization?: string | null;
  source?: string | null;
  status: string;
}

export interface TicketRecord {
  id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  createdBy?: { firstName?: string; lastName?: string; email?: string };
}

export interface AuditRecord {
  id: string;
  action: string;
  resource?: string | null;
  createdAt: string;
  userId?: string | null;
}

export interface ActivityRecord {
  id: string;
  action: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export const erpApi = {
  getAnalytics: () => fetchService<Record<string, unknown>>(ERP_URL, '/analytics/tenant'),
};
