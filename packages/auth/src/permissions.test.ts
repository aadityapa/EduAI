import { describe, expect, it } from 'vitest';
import {
  getPermissionsForRoles,
  hasPermission,
  hasRole,
  isAdminRole,
  ROLE_PERMISSIONS,
} from './permissions';
import { ROLES } from '@eduai/shared';

describe('RBAC permissions', () => {
  it('maps student role permissions', () => {
    const perms = getPermissionsForRoles([ROLES.STUDENT]);
    expect(perms).toContain('lessons:complete:own');
    expect(perms).not.toContain('users:create:tenant');
  });

  it('platform admin has all permissions', () => {
    expect(ROLE_PERMISSIONS.platform_admin.length).toBeGreaterThan(30);
  });

  it('checks hasPermission', () => {
    const perms = getPermissionsForRoles([ROLES.TEACHER]);
    expect(hasPermission(perms, 'attendance:write:class')).toBe(true);
    expect(hasPermission(perms, 'tenants:manage:global')).toBe(false);
  });

  it('checks hasRole and isAdminRole', () => {
    expect(hasRole([ROLES.TEACHER], ROLES.TEACHER)).toBe(true);
    expect(isAdminRole([ROLES.SCHOOL_ADMIN])).toBe(true);
    expect(isAdminRole([ROLES.STUDENT])).toBe(false);
  });
});
