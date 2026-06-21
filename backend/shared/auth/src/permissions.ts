import type { RoleCode } from '@eduai/shared';

export interface PermissionDef {
  code: string;
  resource: string;
  action: string;
  scope: string;
  description?: string;
}

function perm(
  resource: string,
  action: string,
  scope: string,
  description?: string,
): PermissionDef {
  return {
    code: `${resource}:${action}:${scope}`,
    resource,
    action,
    scope,
    description,
  };
}

/** Core permission catalog — Sprint 1 subset + admin essentials */
export const PERMISSIONS: PermissionDef[] = [
  // User management
  perm('users', 'create', 'tenant', 'Create users within tenant'),
  perm('users', 'read', 'tenant', 'Read all tenant users'),
  perm('users', 'read', 'school', 'Read school users'),
  perm('users', 'read', 'class', 'Read class users'),
  perm('users', 'read', 'own', 'Read own profile'),
  perm('users', 'update', 'tenant', 'Update tenant users'),
  perm('users', 'update', 'school', 'Update school users'),
  perm('users', 'update', 'own', 'Update own profile'),
  perm('users', 'delete', 'tenant', 'Delete tenant users'),
  perm('users', 'assign_role', 'school', 'Assign roles within school'),
  perm('users', 'link_parent', 'own', 'Link parent to child'),
  perm('users', 'read', 'linked', 'Read linked student data'),

  // Tenants
  perm('tenants', 'manage', 'global', 'Platform tenant management'),
  perm('tenants', 'read', 'own', 'Read own tenant'),
  perm('tenants', 'configure', 'own', 'Configure own tenant'),

  // Audit
  perm('audit', 'read', 'tenant', 'Read tenant audit logs'),
  perm('audit', 'read', 'global', 'Read global audit logs'),

  // Analytics
  perm('analytics', 'read', 'tenant', 'Read tenant analytics'),
  perm('analytics', 'read', 'school', 'Read school analytics'),
  perm('analytics', 'read', 'global', 'Read global analytics'),

  // Content (stubs for future sprints)
  perm('content', 'read', 'tenant', 'Read tenant content'),
  perm('content', 'create', 'tenant', 'Create tenant content'),
  perm('content', 'publish', 'tenant', 'Publish tenant content'),

  // Learning
  perm('lessons', 'read', 'class', 'Read class lessons'),
  perm('lessons', 'complete', 'own', 'Complete own lessons'),
  perm('lessons', 'assign', 'class', 'Assign lessons to class'),
  perm('progress', 'read', 'own', 'Read own progress'),
  perm('progress', 'read', 'class', 'Read class progress'),
  perm('progress', 'read', 'linked', 'Read linked student progress'),

  // AI (4-segment codes per RBAC design)
  { code: 'ai:tutor:use:own', resource: 'ai', action: 'tutor:use', scope: 'own', description: 'Use AI tutor' },
  { code: 'ai:homework:use:own', resource: 'ai', action: 'homework:use', scope: 'own', description: 'Use homework assistant' },
  { code: 'ai:qpg:use:school', resource: 'ai', action: 'qpg:use', scope: 'school', description: 'Use question paper generator' },
  { code: 'ai:quota:manage:tenant', resource: 'ai', action: 'quota:manage', scope: 'tenant', description: 'Manage AI quota' },

  // Assessments
  perm('assessments', 'create', 'class', 'Create assessments'),
  perm('assessments', 'take', 'own', 'Take assessments'),
  perm('assessments', 'grade', 'class', 'Grade assessments'),
  perm('assessments', 'read', 'own', 'Read own assessment results'),
  perm('assessments', 'read', 'class', 'Read class assessment results'),
  perm('assessments', 'read', 'linked', 'Read linked student assessments'),
  perm('mock_tests', 'take', 'own', 'Take mock tests'),

  // ERP
  perm('attendance', 'write', 'class', 'Mark class attendance'),
  perm('attendance', 'read', 'school', 'Read school attendance'),
  perm('attendance', 'read', 'linked', 'Read linked student attendance'),
  perm('enrollment', 'manage', 'school', 'Manage school enrollment'),

  // Gamification
  perm('gamification', 'read', 'own', 'Read own gamification'),
  perm('gamification', 'read', 'class', 'Read class gamification'),
  perm('gamification', 'configure', 'school', 'Configure school gamification'),
  perm('leaderboard', 'read', 'class', 'Read class leaderboard'),

  // Billing
  perm('billing', 'manage', 'own', 'Manage own billing'),
  perm('billing', 'manage', 'tenant', 'Manage tenant billing'),
  perm('billing', 'read', 'school', 'Read school billing'),
  perm('billing', 'manage', 'linked', 'Manage linked child billing'),

  // Notifications
  perm('notifications', 'send', 'school', 'Send school notifications'),

  // Consent
  perm('consent', 'manage', 'linked', 'Manage linked child consent'),
];

/** Role → permission codes per docs/architecture/rbac-design.md */
export const ROLE_PERMISSIONS: Record<RoleCode, string[]> = {
  platform_admin: PERMISSIONS.map((p) => p.code),

  tenant_admin: [
    'users:create:tenant',
    'users:read:tenant',
    'users:update:tenant',
    'users:delete:tenant',
    'users:read:own',
    'users:update:own',
    'tenants:read:own',
    'tenants:configure:own',
    'audit:read:tenant',
    'analytics:read:tenant',
    'content:create:tenant',
    'content:read:tenant',
    'content:publish:tenant',
    'ai:quota:manage:tenant',
    'billing:manage:tenant',
    'billing:manage:own',
  ],

  school_admin: [
    'users:create:tenant',
    'users:read:tenant',
    'users:read:school',
    'users:update:school',
    'users:assign_role:school',
    'users:read:own',
    'users:update:own',
    'audit:read:tenant',
    'analytics:read:school',
    'content:read:tenant',
    'lessons:assign:class',
    'progress:read:class',
    'attendance:read:school',
    'enrollment:manage:school',
    'gamification:configure:school',
    'billing:read:school',
    'notifications:send:school',
    'ai:qpg:use:school',
  ],

  teacher: [
    'users:read:school',
    'users:read:class',
    'users:read:own',
    'users:update:own',
    'content:read:tenant',
    'lessons:read:class',
    'lessons:assign:class',
    'progress:read:class',
    'assessments:create:class',
    'assessments:grade:class',
    'assessments:read:class',
    'attendance:write:class',
    'attendance:read:school',
    'analytics:read:school',
    'ai:tutor:use:own',
    'ai:homework:use:own',
    'ai:qpg:use:school',
    'gamification:read:class',
    'leaderboard:read:class',
    'notifications:send:school',
    'billing:manage:own',
  ],

  student: [
    'users:read:own',
    'users:update:own',
    'lessons:read:class',
    'lessons:complete:own',
    'progress:read:own',
    'ai:tutor:use:own',
    'ai:homework:use:own',
    'assessments:take:own',
    'assessments:read:own',
    'mock_tests:take:own',
    'gamification:read:own',
    'leaderboard:read:class',
    'billing:manage:own',
  ],

  parent: [
    'users:read:own',
    'users:update:own',
    'users:link_parent:own',
    'users:read:linked',
    'progress:read:linked',
    'assessments:read:linked',
    'attendance:read:linked',
    'billing:manage:linked',
    'consent:manage:linked',
    'ai:tutor:use:own',
  ],
};

export function getPermissionsForRoles(roles: RoleCode[]): string[] {
  const set = new Set<string>();
  for (const role of roles) {
    const perms = ROLE_PERMISSIONS[role] ?? [];
    for (const p of perms) set.add(p);
  }
  return Array.from(set).sort();
}

export function hasPermission(userPermissions: string[], required: string | string[]): boolean {
  const requiredList = Array.isArray(required) ? required : [required];
  return requiredList.every((p) => userPermissions.includes(p));
}

export function hasAnyPermission(userPermissions: string[], required: string[]): boolean {
  return required.some((p) => userPermissions.includes(p));
}

export function hasRole(userRoles: RoleCode[], role: RoleCode): boolean {
  return userRoles.includes(role);
}

export function isAdminRole(roles: RoleCode[]): boolean {
  return roles.some((r) =>
    ['platform_admin', 'tenant_admin', 'school_admin'].includes(r),
  );
}
