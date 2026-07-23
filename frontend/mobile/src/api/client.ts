import Constants from 'expo-constants';
import { withRetry } from './retry';
import { ApiError } from './errors';

export { ApiError };

const extra = Constants.expoConfig?.extra ?? {};

export const API_URLS = {
  identity: (extra.identityUrl as string) ?? 'http://localhost:3001',
  learning: (extra.learningUrl as string) ?? 'http://localhost:3003',
  ai: (extra.aiUrl as string) ?? 'http://localhost:3004',
  erp: (extra.erpUrl as string) ?? 'http://localhost:3005',
  billing: (extra.billingUrl as string) ?? 'http://localhost:3006',
};

export type ApiFetchOptions = RequestInit & {
  token?: string;
  tenantSlug?: string;
  /** Skip retry/backoff. Default false. */
  noRetry?: boolean;
};

export async function apiFetch<T>(
  baseUrl: string,
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { token, tenantSlug, noRetry, ...init } = options;

  const run = async () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(init.headers as Record<string, string>),
    };
    if (token) headers.Authorization = `Bearer ${token}`;
    if (tenantSlug) headers['x-tenant-slug'] = tenantSlug;

    let res: Response;
    try {
      res = await fetch(`${baseUrl}/api/v1${path}`, { ...init, headers });
    } catch (e) {
      throw e instanceof Error ? e : new Error('Network request failed');
    }

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new ApiError(res.status, json?.error?.message ?? json?.message ?? res.statusText);
    }
    return (json.data ?? json) as T;
  };

  if (noRetry) return run();
  return withRetry(run, { retries: 3, baseDelayMs: 300 });
}
