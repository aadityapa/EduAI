import { auth } from '@/auth';
import {
  billingApi,
  erpApi,
  identityApi,
  aiAdminApi,
  learningApi,
  AdminApiError,
  type PaginationMeta,
  type UserRecord,
  type UsersListQuery,
} from './admin-api';

export type FetchResult<T> = { data: T | null; error?: string };

async function wrap<T>(fn: () => Promise<T>): Promise<FetchResult<T>> {
  try {
    return { data: await fn() };
  } catch (e) {
    const message = e instanceof AdminApiError ? e.message : 'Service unavailable';
    return { data: null, error: message };
  }
}

export async function getPlatformOverview() {
  const [revenue, erp, usersRaw, ai] = await Promise.all([
    wrap(() => billingApi.getRevenue()),
    wrap(() => erpApi.getAnalytics()),
    wrap(() => identityApi.getUsers({ page: 1, page_size: 1 })),
    wrap(() => aiAdminApi.getDashboard()),
  ]);

  const users: FetchResult<{ total: number }> = usersRaw.error
    ? { data: null, error: usersRaw.error }
    : {
        data: { total: usersRaw.data?.pagination?.total_items ?? usersRaw.data?.data.length ?? 0 },
      };

  return { revenue, erp, users, ai };
}

export async function getRevenuePageData() {
  const [revenue, invoices] = await Promise.all([
    wrap(() => billingApi.getRevenue()),
    wrap(() => billingApi.getInvoices()),
  ]);
  return { revenue, invoices };
}

export async function getLeadsPageData() {
  return wrap(() => billingApi.getLeads());
}

export async function getTicketsPageData() {
  return wrap(() => billingApi.getTickets());
}

export async function getCouponsPageData() {
  return wrap(() => billingApi.getCoupons());
}

export async function getCampaignsPageData() {
  return wrap(() => billingApi.getCampaigns());
}

export async function getAuditPageData() {
  const [audit, activity] = await Promise.all([
    wrap(() => billingApi.getAuditLogs()),
    wrap(() => billingApi.getActivityLogs()),
  ]);
  return { audit, activity };
}

export async function getSubscriptionsPageData() {
  return wrap(() => billingApi.getSubscriptions());
}

export async function getAiAnalyticsPageData() {
  return wrap(() => aiAdminApi.getDashboard());
}

export async function getBrandingPageData() {
  return wrap(() => billingApi.getBranding());
}

export async function getTenantsPageData() {
  return wrap(() => billingApi.getSubscriptions());
}

export async function getSchoolsPageData() {
  return wrap(() => erpApi.getSchools());
}

export async function getAnalyticsPageData() {
  const [erp, revenue] = await Promise.all([
    wrap(() => erpApi.getAnalytics()),
    wrap(() => billingApi.getRevenue()),
  ]);
  return { erp, revenue };
}

export async function getContentPageData() {
  return wrap(() => learningApi.getCourses());
}

export async function getUsersPageData(query?: UsersListQuery): Promise<{
  data: UserRecord[] | null;
  pagination: PaginationMeta | null;
  error?: string;
}> {
  try {
    const result = await identityApi.getUsers({
      page: query?.page ?? 1,
      page_size: query?.page_size ?? 20,
      role: query?.role,
      status: query?.status,
    });
    return { data: result.data, pagination: result.pagination ?? null };
  } catch (e) {
    const message = e instanceof AdminApiError ? e.message : 'Service unavailable';
    return { data: null, pagination: null, error: message };
  }
}

export async function getShellChromeData() {
  const [subs, activity] = await Promise.all([
    wrap(() => billingApi.getSubscriptions()),
    wrap(() => billingApi.getActivityLogs()),
  ]);
  return { subs, activity };
}

export async function requireAdminSession() {
  const session = await auth();
  if (!session?.user?.accessToken) return null;
  return session;
}
