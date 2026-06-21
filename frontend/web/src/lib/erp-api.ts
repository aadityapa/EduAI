import { auth } from '@/auth';
import type { ApiResponse } from '@eduai/shared';

const BASE_URL = process.env.NEXT_PUBLIC_ERP_SERVICE_URL ?? 'http://localhost:3005';

export class ErpApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ErpApiError';
  }
}

async function fetchAuthenticated<T>(path: string, init?: RequestInit): Promise<T> {
  const session = await auth();
  const accessToken = session?.user?.accessToken;
  if (!accessToken) throw new ErpApiError(401, 'Not authenticated');

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
    throw new ErpApiError(res.status, message);
  }

  const json = (await res.json()) as ApiResponse<T>;
  return json.data;
}

export async function getTeacherDashboard() {
  return fetchAuthenticated<{
    classCount: number;
    classes: Array<{ id: string; name: string; section: string; classLevel: number; studentCount: number }>;
    activeAssignments: number;
    pendingGrading: number;
    todayAttendanceMarked: number;
  }>('/teacher/dashboard');
}

export async function getTeacherClasses() {
  return fetchAuthenticated<Array<{ id: string; name: string; section: string; _count: { enrollments: number } }>>(
    '/classes/mine',
  );
}

export async function getClassDetail(classId: string) {
  return fetchAuthenticated<{
    id: string;
    name: string;
    section: string;
    enrollments: Array<{ student: { id: string; firstName: string; lastName: string | null; email: string } }>;
  }>(`/classes/${classId}`);
}

export async function getClassAttendance(classId: string, date?: string) {
  const qs = date ? `?date=${date}` : '';
  return fetchAuthenticated<{ records: Array<{ id: string; status: string; student: { firstName: string; lastName: string | null } }> }>(
    `/attendance/class/${classId}${qs}`,
  );
}

export async function getMyAssignments() {
  return fetchAuthenticated<Array<{ id: string; title: string; dueDate: string; status: string; class: { name: string; section: string } }>>(
    '/assignments/mine',
  );
}

export async function getParentChildDashboard(studentId: string) {
  return fetchAuthenticated<Record<string, unknown>>(`/parent/children/${studentId}/dashboard`);
}

export async function getParentFees() {
  return fetchAuthenticated<Array<{ student: { firstName: string; lastName: string | null }; summary: { totalDue: number; totalPaid: number } }>>(
    '/fees/children',
  );
}

export async function getMyNotifications() {
  return fetchAuthenticated<Array<{ id: string; title: string; body: string; readAt: string | null; createdAt: string }>>(
    '/notifications',
  );
}

export async function getMyTimetable() {
  return fetchAuthenticated<{ slots: Array<{ dayOfWeek: number; startTime: string; endTime: string; subject: string }> }>(
    '/timetable/me',
  );
}
