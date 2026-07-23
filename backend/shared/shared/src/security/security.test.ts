import { afterEach, describe, expect, it } from 'vitest';
import {
  assertSafeExternalUrl,
  clearFailedLogin,
  decryptField,
  encryptField,
  hashVerificationSecret,
  isBlockedInternalHost,
  recordFailedLogin,
  resetAnomalyStateForTests,
  resolveAuthSecret,
  validateUploadFile,
} from '../index';

describe('resolveAuthSecret (Phase 9 fail-closed)', () => {
  const prev = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = prev;
  });

  it('returns configured secret', () => {
    expect(resolveAuthSecret('a'.repeat(32))).toHaveLength(32);
  });

  it('throws in production when missing', () => {
    process.env.NODE_ENV = 'production';
    expect(() => resolveAuthSecret(undefined)).toThrow(/AUTH_SECRET/);
  });

  it('uses dev fallback outside production', () => {
    process.env.NODE_ENV = 'development';
    expect(resolveAuthSecret(undefined).length).toBeGreaterThanOrEqual(32);
  });
});

describe('field encryption', () => {
  const keyHex = 'ab'.repeat(32);

  it('round-trips with hex key', () => {
    const enc = encryptField('9876543210', keyHex);
    expect(enc.startsWith('enc:v1:')).toBe(true);
    expect(decryptField(enc, keyHex)).toBe('9876543210');
  });

  it('hashes verification secrets stably', () => {
    expect(hashVerificationSecret('123456', 'salt')).toBe(
      hashVerificationSecret('123456', 'salt'),
    );
    expect(hashVerificationSecret('123456', 'salt')).not.toBe(
      hashVerificationSecret('000000', 'salt'),
    );
  });
});

describe('SSRF url allowlist', () => {
  it('blocks metadata and private hosts', () => {
    expect(isBlockedInternalHost('169.254.169.254')).toBe(true);
    expect(isBlockedInternalHost('127.0.0.1')).toBe(true);
    expect(() =>
      assertSafeExternalUrl('https://169.254.169.254/latest/meta-data/', {
        allowedHosts: ['169.254.169.254'],
      }),
    ).toThrow(/not allowed/);
  });

  it('allows listed https hosts', () => {
    const u = assertSafeExternalUrl(
      'https://eduai-uploads.s3.ap-south-1.amazonaws.com/homework/a.png',
    );
    expect(u.hostname).toContain('amazonaws.com');
  });

  it('rejects unlisted hosts', () => {
    expect(() => assertSafeExternalUrl('https://evil.example/x')).toThrow(/allowlist/);
  });
});

describe('file upload validation', () => {
  it('accepts safe pdf under limit', () => {
    expect(
      validateUploadFile({
        filename: 'notes.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 1024,
      }).ok,
    ).toBe(true);
  });

  it('rejects path traversal and oversized', () => {
    expect(
      validateUploadFile({
        filename: '../etc/passwd',
        mimeType: 'text/plain',
        sizeBytes: 10,
      }).ok,
    ).toBe(false);
    expect(
      validateUploadFile({
        filename: 'big.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 50 * 1024 * 1024,
      }).ok,
    ).toBe(false);
  });
});

describe('login anomaly hooks', () => {
  afterEach(() => {
    resetAnomalyStateForTests();
  });

  it('flags after threshold failures', async () => {
    const opts = { tenantId: 't1', email: 'a@b.com', ip: '1.2.3.4', threshold: 3 };
    expect((await recordFailedLogin(opts)).anomalous).toBe(false);
    expect((await recordFailedLogin(opts)).anomalous).toBe(false);
    expect((await recordFailedLogin(opts)).anomalous).toBe(true);
    clearFailedLogin(opts);
  });
});
