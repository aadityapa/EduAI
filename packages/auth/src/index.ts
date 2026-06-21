export {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  getPermissionsForRoles,
  hasPermission,
  hasAnyPermission,
  hasRole,
  isAdminRole,
} from './permissions';
export type { PermissionDef } from './permissions';
export { safeAuthRedirect } from './safe-redirect';

export interface AuthUserSession {
  id: string;
  email: string;
  name: string;
  tenantId: string;
  schoolId?: string;
  roles: string[];
  permissions: string[];
  accessToken?: string;
}

export interface CredentialsLoginInput {
  email: string;
  password: string;
  tenantId?: string;
  tenantSlug?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export const AUTH_COOKIE_NAMES = {
  sessionToken: 'eduai.session-token',
  callbackUrl: 'eduai.callback-url',
  csrfToken: 'eduai.csrf-token',
} as const;

export const AUTH_RATE_LIMITS = {
  login: { windowMs: 15 * 60 * 1000, maxAttempts: 5 },
  register: { windowMs: 60 * 60 * 1000, maxAttempts: 10 },
  refresh: { windowMs: 60 * 1000, maxAttempts: 30 },
} as const;

/** Auth.js-compatible session max age (15 min access via JWT, 7d session) */
export const SESSION_CONFIG = {
  maxAge: 7 * 24 * 60 * 60,
  updateAge: 24 * 60 * 60,
  strategy: 'jwt' as const,
};
