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

  it('parent cannot manage tenant users or AI quota', () => {
    const perms = getPermissionsForRoles([ROLES.PARENT]);
    expect(perms).toContain('progress:read:linked');
    expect(perms).not.toContain('users:create:tenant');
    expect(perms).not.toContain('ai:quota:manage:tenant');
    expect(hasPermission(perms, 'billing:manage:linked')).toBe(true);
  });

  it('parent can manage linked consent and privacy', () => {
    const perms = getPermissionsForRoles([ROLES.PARENT]);
    expect(hasPermission(perms, 'consent:manage:linked')).toBe(true);
    expect(hasPermission(perms, 'privacy:manage:linked')).toBe(true);
    expect(hasPermission(perms, 'privacy:manage:tenant')).toBe(false);
  });

  it('student can request own DSR export/delete', () => {
    const perms = getPermissionsForRoles([ROLES.STUDENT]);
    expect(hasPermission(perms, 'privacy:export:own')).toBe(true);
    expect(hasPermission(perms, 'privacy:delete:own')).toBe(true);
    expect(hasPermission(perms, 'consent:manage:own')).toBe(true);
  });

  it('tenant_admin cannot access platform-global tenant manage', () => {
    const perms = getPermissionsForRoles([ROLES.TENANT_ADMIN]);
    expect(hasPermission(perms, 'billing:manage:tenant')).toBe(true);
    expect(hasPermission(perms, 'tenants:manage:global')).toBe(false);
  });

  it('matrix: student vs teacher assessment scope', () => {
    const student = getPermissionsForRoles([ROLES.STUDENT]);
    const teacher = getPermissionsForRoles([ROLES.TEACHER]);
    expect(hasPermission(student, 'assessments:take:own')).toBe(true);
    expect(hasPermission(student, 'assessments:grade:class')).toBe(false);
    expect(hasPermission(teacher, 'assessments:grade:class')).toBe(true);
  });
});
