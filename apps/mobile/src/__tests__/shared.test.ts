import { describe, it, expect } from 'vitest';
import { SELF_REGISTER_ROLES, resolveJwtSecret } from '@eduai/shared';

describe('resolveJwtSecret', () => {
  it('returns env value when set', () => {
    expect(resolveJwtSecret('my-secret')).toBe('my-secret');
  });

  it('returns dev fallback when unset in non-production', () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    expect(resolveJwtSecret(undefined)).toBe('change-me-in-production');
    process.env.NODE_ENV = prev;
  });
});

describe('SELF_REGISTER_ROLES', () => {
  it('allows only student and parent', () => {
    expect(SELF_REGISTER_ROLES).toEqual(['student', 'parent']);
  });
});
