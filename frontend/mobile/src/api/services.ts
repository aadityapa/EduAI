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
    noRetry: true,
  });
}

export async function fetchCourses(token: string, tenantSlug = 'demo') {
  return apiFetch<unknown[]>(API_URLS.learning, '/courses', { token, tenantSlug });
}

export async function fetchCourseLessons(token: string, courseId: string, tenantSlug = 'demo') {
  return apiFetch<unknown[]>(API_URLS.learning, `/courses/${courseId}/lessons`, {
    token,
    tenantSlug,
  });
}

export async function fetchMyEnrollments(token: string, tenantSlug = 'demo') {
  return apiFetch<unknown[]>(API_URLS.learning, '/enrollments/me', { token, tenantSlug });
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

export async function fetchLeaderboard(token: string, tenantSlug = 'demo') {
  return apiFetch<unknown[]>(API_URLS.learning, '/gamification/leaderboard', {
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
    noRetry: true,
  });
}

export async function fetchStudyPlans(token: string, tenantSlug = 'demo') {
  return apiFetch<unknown[]>(API_URLS.ai, '/planner/plans', { token, tenantSlug });
}

export async function generateStudyPlan(
  token: string,
  body: {
    subjects: string[];
    goals: string;
    availableHoursPerWeek: number;
    examDate?: string;
  },
  tenantSlug = 'demo',
) {
  return apiFetch<{ plan: Record<string, unknown> }>(API_URLS.ai, '/planner/generate', {
    method: 'POST',
    token,
    tenantSlug,
    body: JSON.stringify(body),
    noRetry: true,
  });
}

export async function fetchTeacherDashboard(token: string, tenantSlug = 'demo') {
  return apiFetch<Record<string, unknown>>(API_URLS.erp, '/teacher/dashboard', {
    token,
    tenantSlug,
  });
}

export async function fetchTeacherClasses(token: string, tenantSlug = 'demo') {
  return apiFetch<unknown[]>(API_URLS.erp, '/classes/mine', { token, tenantSlug });
}

export async function fetchTeacherAssignments(token: string, tenantSlug = 'demo') {
  return apiFetch<unknown[]>(API_URLS.erp, '/assignments/mine', { token, tenantSlug });
}

export async function fetchClassAttendance(
  token: string,
  classId: string,
  tenantSlug = 'demo',
) {
  return apiFetch<unknown[]>(API_URLS.erp, `/attendance/class/${classId}`, {
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

export async function fetchNotifications(token: string, tenantSlug = 'demo') {
  return apiFetch<unknown[]>(API_URLS.erp, '/notifications', { token, tenantSlug });
}

export async function markNotificationRead(
  token: string,
  id: string,
  tenantSlug = 'demo',
) {
  return apiFetch(API_URLS.erp, `/notifications/${id}/read`, {
    method: 'PATCH',
    token,
    tenantSlug,
    noRetry: true,
  });
}
