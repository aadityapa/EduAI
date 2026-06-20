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

export interface CouponRecord {
  code: string;
  discountPct: number | { toNumber?: () => number };
  usedCount: number;
  maxUses: number;
  isActive: boolean;
  validFrom: string;
  validUntil: string;
}

export interface CampaignRecord {
  id: string;
  name: string;
  channel: string;
  status: string;
  budget?: number | { toNumber?: () => number } | null;
  metadata?: Record<string, unknown>;
  startsAt?: string | null;
  endsAt?: string | null;
}

export interface SubscriptionRecord {
  id: string;
  status: string;
  tenant: { id: string; slug: string; name: string };
  plan: { name: string; priceMonthly: number | { toNumber?: () => number } };
}

export interface BrandingRecord {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  logoUrl?: string | null;
  customDomainVerified?: boolean;
}

export interface AiDashboardRecord {
  totalTokens: number;
  totalQueries: number;
  estimatedCostUsd: number;
  topUsers: Array<{ userId: string; tokensUsed: number; queryCount: number; estimatedCostUsd: number }>;
  featureUsage: Array<{ type: string; _count: { id: number } }>;
}

export interface SchoolRecord {
  id: string;
  name: string;
  code: string;
  address?: Record<string, unknown>;
  userCount: number;
  classCount: number;
  students: number;
  teachers: number;
}

export interface ClassRecord {
  id: string;
  name?: string;
  classLevel?: number;
  section?: string;
  school?: { id: string; name: string; code: string };
  _count?: { enrollments: number };
}

export interface UserRecord {
  id: string;
  email: string;
  first_name: string;
  last_name?: string | null;
  roles: string[];
  status: string;
}

export const billingApi = {
  getRevenue: () => fetchService<Record<string, number>>(BILLING_URL, '/analytics/revenue'),
  getPlans: () => fetchService<unknown[]>(BILLING_URL, '/plans'),
  getSubscriptions: () => fetchService<SubscriptionRecord[]>(BILLING_URL, '/subscriptions'),
  getInvoices: () => fetchService<unknown[]>(BILLING_URL, '/invoices'),
  getCoupons: () => fetchService<CouponRecord[]>(BILLING_URL, '/coupons'),
  getLeads: () => fetchService<LeadRecord[]>(BILLING_URL, '/crm/leads'),
  getTickets: () => fetchService<TicketRecord[]>(BILLING_URL, '/crm/tickets'),
  getCampaigns: () => fetchService<CampaignRecord[]>(BILLING_URL, '/crm/campaigns'),
  getAuditLogs: () => fetchService<AuditRecord[]>(BILLING_URL, '/crm/audit-logs'),
  getActivityLogs: () => fetchService<ActivityRecord[]>(BILLING_URL, '/crm/activity-logs'),
  getBranding: () => fetchService<BrandingRecord>(BILLING_URL, '/branding'),
};

export const identityApi = {
  getUsers: (query?: { page?: number; page_size?: number; role?: string; status?: string }) => {
    const params = new URLSearchParams();
    if (query?.page) params.set('page', String(query.page));
    if (query?.page_size) params.set('page_size', String(query.page_size));
    if (query?.role) params.set('role', query.role);
    if (query?.status) params.set('status', query.status);
    const qs = params.toString();
    return fetchService<UserRecord[]>(IDENTITY_URL, `/users${qs ? `?${qs}` : ''}`);
  },
};

export const aiAdminApi = {
  getDashboard: () => fetchService<AiDashboardRecord>(AI_URL, '/analytics/dashboard'),
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
  getClasses: () => fetchService<ClassRecord[]>(ERP_URL, '/classes'),
  getSchools: () => fetchService<SchoolRecord[]>(ERP_URL, '/schools'),
};
