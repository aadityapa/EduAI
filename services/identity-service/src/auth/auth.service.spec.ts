import { hasPermission } from '@eduai/auth';

describe('RBAC hasPermission', () => {
  it('checks tenant admin permissions', () => {
    const perms = ['users:read:tenant', 'users:create:tenant'];
    expect(hasPermission(perms, 'users:read:tenant')).toBe(true);
    expect(hasPermission(perms, 'tenants:manage:global')).toBe(false);
  });
});
