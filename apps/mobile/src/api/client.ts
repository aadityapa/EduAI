import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

export const API_URLS = {
  identity: (extra.identityUrl as string) ?? 'http://localhost:3001',
  learning: (extra.learningUrl as string) ?? 'http://localhost:3003',
  ai: (extra.aiUrl as string) ?? 'http://localhost:3004',
  erp: (extra.erpUrl as string) ?? 'http://localhost:3005',
};

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(
  baseUrl: string,
  path: string,
  options: RequestInit & { token?: string; tenantSlug?: string } = {},
): Promise<T> {
  const { token, tenantSlug, ...init } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (tenantSlug) headers['x-tenant-slug'] = tenantSlug;

  const res = await fetch(`${baseUrl}/api/v1${path}`, { ...init, headers });
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(res.status, json?.error?.message ?? json?.message ?? res.statusText);
  }
  return (json.data ?? json) as T;
}
