import { describe, expect, it } from 'vitest';
import { getDashboardRoute, isValidEmail, resolvePostLoginDestination, ROLES, slugify, wrapResponse } from './index';

describe('shared utils', () => {
  it('validates email', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('invalid')).toBe(false);
  });

  it('slugifies strings', () => {
    expect(slugify('Hello World!')).toBe('hello-world');
  });

  it('wraps API response', () => {
    const res = wrapResponse({ ok: true });
    expect(res.data).toEqual({ ok: true });
    expect(res.meta.request_id).toBeDefined();
  });

  it('resolves dashboard route by role priority', () => {
    expect(getDashboardRoute([ROLES.STUDENT, ROLES.TEACHER])).toBe('/teacher/dashboard');
    expect(getDashboardRoute([ROLES.PLATFORM_ADMIN])).toBe('/admin/dashboard');
  });

  it('sends admin roles to admin portal URL', () => {
    process.env.NEXT_PUBLIC_ADMIN_URL = 'http://localhost:3002';
    expect(resolvePostLoginDestination([ROLES.PLATFORM_ADMIN])).toBe(
      'http://localhost:3002/dashboard',
    );
    expect(resolvePostLoginDestination([ROLES.STUDENT])).toBe('/student/dashboard');
  });
});
