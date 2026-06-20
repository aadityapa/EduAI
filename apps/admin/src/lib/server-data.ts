import { auth } from '@/auth';
import { billingApi, erpApi, identityApi, aiAdminApi, AdminApiError } from './admin-api';

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
  const [revenue, erp, users, ai] = await Promise.all([
    wrap(() => billingApi.getRevenue()),
    wrap(() => erpApi.getAnalytics()),
    wrap(() => identityApi.getUsers({ page: 1, page_size: 1 })),
    wrap(() => aiAdminApi.getDashboard()),
  ]);

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

export async function requireAdminSession() {
  const session = await auth();
  if (!session?.user?.accessToken) return null;
  return session;
}
