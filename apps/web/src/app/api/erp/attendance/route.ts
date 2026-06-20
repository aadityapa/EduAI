import { auth } from '@/auth';
import { NextResponse } from 'next/server';

const ERP_URL = process.env.ERP_SERVICE_URL ?? process.env.NEXT_PUBLIC_ERP_SERVICE_URL ?? 'http://localhost:3005';

export async function POST(request: Request) {
  const session = await auth();
  const token = session?.user?.accessToken;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.text();
  const res = await fetch(`${ERP_URL}/api/v1/attendance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body,
  });

  const json = await res.json();
  return NextResponse.json(json, { status: res.status });
}
