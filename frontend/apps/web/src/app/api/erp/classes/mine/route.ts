import { auth } from '@/auth';
import { NextResponse } from 'next/server';

const ERP_URL = process.env.ERP_SERVICE_URL ?? process.env.NEXT_PUBLIC_ERP_SERVICE_URL ?? 'http://localhost:3005';

async function proxy(path: string, init?: RequestInit) {
  const session = await auth();
  const token = session?.user?.accessToken;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const res = await fetch(`${ERP_URL}/api/v1${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  });

  const json = await res.json();
  return NextResponse.json(json, { status: res.status });
}

export async function GET() {
  return proxy('/classes/mine');
}
