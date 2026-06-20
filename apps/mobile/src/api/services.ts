import { apiFetch, API_URLS } from './client';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName?: string;
    roles: string[];
    permissions: string[];
  };
}

export async function login(
  email: string,
  password: string,
  tenantSlug = 'demo',
): Promise<AuthTokens> {
  return apiFetch<AuthTokens>(API_URLS.identity, '/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    tenantSlug,
  });
}

export async function fetchCourses(token: string, tenantSlug = 'demo') {
  return apiFetch<unknown[]>(API_URLS.learning, '/courses', { token, tenantSlug });
}

export async function fetchHub(token: string, tenantSlug = 'demo') {
  return apiFetch<Record<string, unknown>>(API_URLS.learning, '/hub', { token, tenantSlug });
}

export async function fetchGamification(token: string, tenantSlug = 'demo') {
  return apiFetch<Record<string, unknown>>(API_URLS.learning, '/gamification/me', {
    token,
    tenantSlug,
  });
}

export async function tutorChat(
  token: string,
  message: string,
  tenantSlug = 'demo',
) {
  return apiFetch<{ reply: string }>(API_URLS.ai, '/tutor/chat', {
    method: 'POST',
    token,
    tenantSlug,
    body: JSON.stringify({ message }),
  });
}

export async function fetchTeacherDashboard(token: string, tenantSlug = 'demo') {
  return apiFetch<Record<string, unknown>>(API_URLS.erp, '/teacher/dashboard', {
    token,
    tenantSlug,
  });
}

export async function fetchParentChildren(token: string, tenantSlug = 'demo') {
  return apiFetch<unknown[]>(API_URLS.learning, '/parent/children', { token, tenantSlug });
}

export async function fetchFees(token: string, tenantSlug = 'demo') {
  return apiFetch<unknown[]>(API_URLS.erp, '/fees/children', { token, tenantSlug });
}
