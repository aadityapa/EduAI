export const ROLES = {
  PLATFORM_ADMIN: 'platform_admin',
  TENANT_ADMIN: 'tenant_admin',
  SCHOOL_ADMIN: 'school_admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
} as const;

export type RoleCode = (typeof ROLES)[keyof typeof ROLES];

/** Display names aligned with product docs */
export const ROLE_LABELS: Record<RoleCode, string> = {
  platform_admin: 'Super Admin',
  tenant_admin: 'Admin',
  school_admin: 'School Admin',
  teacher: 'Teacher',
  student: 'Student',
  parent: 'Parent',
};

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING_VERIFICATION: 'pending_verification',
} as const;

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export const TENANT_TYPES = {
  PLATFORM: 'platform',
  SCHOOL_GROUP: 'school_group',
  WHITE_LABEL: 'white_label',
} as const;

export type TenantType = (typeof TENANT_TYPES)[keyof typeof TENANT_TYPES];

export interface JwtClaims {
  sub: string;
  email: string;
  tenant_id: string;
  school_id?: string;
  roles: RoleCode[];
  permissions: string[];
  class_ids?: string[];
  linked_student_ids?: string[];
  subscription_tier?: string;
  iat?: number;
  exp?: number;
}

export interface ApiMeta {
  request_id: string;
  timestamp: string;
  pagination?: {
    page?: number;
    page_size?: number;
    total_items?: number;
    total_pages?: number;
    has_next?: boolean;
    has_prev?: boolean;
    next_cursor?: string;
  };
}

export interface ApiResponse<T> {
  data: T;
  meta: ApiMeta;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Array<{ field?: string; code: string; message: string }>;
    request_id: string;
    documentation_url?: string;
  };
}

export interface PaginationQuery {
  page?: number;
  page_size?: number;
  sort?: string;
}

export function createRequestId(): string {
  return crypto.randomUUID();
}

export function createApiMeta(requestId?: string): ApiMeta {
  return {
    request_id: requestId ?? createRequestId(),
    timestamp: new Date().toISOString(),
  };
}

export function wrapResponse<T>(data: T, requestId?: string): ApiResponse<T> {
  return { data, meta: createApiMeta(requestId) };
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const DASHBOARD_ROUTES: Record<RoleCode, string> = {
  platform_admin: '/admin/dashboard',
  tenant_admin: '/admin/dashboard',
  school_admin: '/admin/dashboard',
  teacher: '/teacher/dashboard',
  student: '/student/dashboard',
  parent: '/parent/dashboard',
};

/** Dev-only fallback; production requires JWT_SECRET env var */
export const DEV_JWT_SECRET = 'change-me-in-production';

export function resolveJwtSecret(envValue?: string): string {
  if (envValue) return envValue;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is required in production');
  }
  return DEV_JWT_SECRET;
}

const DEV_AUTH_SECRET = 'eduai-local-dev-auth-secret-32chars!!';

/** Auth.js requires AUTH_SECRET (min 32 chars). Uses dev fallback when unset. */
export function resolveAuthSecret(envValue?: string): string {
  const secret = envValue ?? process.env.AUTH_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV === 'production') {
    console.warn(
      '[EduAI] AUTH_SECRET is missing or too short. Set AUTH_SECRET (32+ chars) before production deploy.',
    );
  }
  return DEV_AUTH_SECRET;
}

/** Roles allowed on public self-registration */
export const SELF_REGISTER_ROLES: RoleCode[] = ['student', 'parent'];

export { withTimeout, DB_QUERY_TIMEOUT_MS } from './timeout.js';
export { PORTS, FRONTEND_APPS, BACKEND_SERVICES, serviceUrl } from './ports.js';

export function getDashboardRoute(roles: RoleCode[]): string {
  const priority: RoleCode[] = [
    ROLES.PLATFORM_ADMIN,
    ROLES.TENANT_ADMIN,
    ROLES.SCHOOL_ADMIN,
    ROLES.TEACHER,
    ROLES.PARENT,
    ROLES.STUDENT,
  ];
  for (const role of priority) {
    if (roles.includes(role)) {
      return DASHBOARD_ROUTES[role];
    }
  }
  return '/dashboard';
}

/** Admin CRM runs on a separate Next.js app (default :3002). */
export function getAdminPortalUrl(): string {
  const url = process.env.NEXT_PUBLIC_ADMIN_URL ?? 'http://localhost:3002';
  return url.replace(/\/$/, '');
}

const ADMIN_DASHBOARD_ROLES: RoleCode[] = [
  ROLES.PLATFORM_ADMIN,
  ROLES.TENANT_ADMIN,
  ROLES.SCHOOL_ADMIN,
];

/** Post-login destination — absolute URL for admin portal, path for web app. */
export function resolvePostLoginDestination(roles: RoleCode[]): string {
  if (roles.some((r) => ADMIN_DASHBOARD_ROLES.includes(r))) {
    return `${getAdminPortalUrl()}/dashboard`;
  }
  return getDashboardRoute(roles);
}

export function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}
