import { auth } from '@/auth';
import type { ApiResponse } from '@eduai/shared';

const BASE_URL =
  process.env.NEXT_PUBLIC_IDENTITY_SERVICE_URL ??
  process.env.IDENTITY_SERVICE_URL ??
  'http://localhost:3001';

export class IdentityApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'IdentityApiError';
  }
}

async function fetchIdentity<T>(path: string, init?: RequestInit): Promise<T> {
  const session = await auth();
  const accessToken = session?.user?.accessToken;
  if (!accessToken) throw new IdentityApiError(401, 'Not authenticated');

  const res = await fetch(`${BASE_URL}/api/v1${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...init?.headers,
    },
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
    throw new IdentityApiError(res.status, message);
  }

  const json = (await res.json()) as ApiResponse<T>;
  return json.data;
}

export interface ConsentRow {
  id: string;
  purpose: string;
  status: string;
  subject_user_id: string;
  policy_version: string;
  parental_method: string | null;
  created_at: string;
}

export interface DsrRow {
  id: string;
  type: string;
  status: string;
  subject_user_id: string;
  due_at: string;
  completed_at: string | null;
}

export async function listMyConsent(): Promise<ConsentRow[]> {
  return fetchIdentity<ConsentRow[]>('/consent');
}

export async function listMyDsr(): Promise<DsrRow[]> {
  return fetchIdentity<DsrRow[]>('/privacy/dsr');
}

export async function grantConsent(body: {
  purpose: string;
  subjectUserId?: string;
  parentalMethod?: string;
}): Promise<ConsentRow & { verificationCodeHint?: string }> {
  return fetchIdentity('/consent', { method: 'POST', body: JSON.stringify(body) });
}

export async function verifyParentalConsent(id: string, code: string): Promise<ConsentRow> {
  return fetchIdentity(`/consent/${id}/verify`, {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
}

export async function requestDataExport(): Promise<DsrRow> {
  return fetchIdentity('/privacy/dsr', {
    method: 'POST',
    body: JSON.stringify({ type: 'access_export' }),
  });
}

export async function requestDataErasure(purposeNote?: string): Promise<DsrRow> {
  return fetchIdentity('/privacy/dsr', {
    method: 'POST',
    body: JSON.stringify({ type: 'erasure', purposeNote }),
  });
}
