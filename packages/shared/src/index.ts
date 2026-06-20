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
