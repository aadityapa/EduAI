import * as crypto from 'crypto';

const ALGO = 'aes-256-gcm';
const IV_LEN = 12;
const TAG_LEN = 16;
const PREFIX = 'enc:v1:';

/**
 * Field-level encryption for highest-sensitivity PII (phone, guardian contacts, OTP hashes).
 * Key: FIELD_ENCRYPTION_KEY — 32-byte secret as base64 or 64-char hex.
 * When unset outside production, plaintext is returned (dev convenience).
 * In production without a key, encrypt throws (fail closed).
 */
export function resolveFieldEncryptionKey(envValue?: string): Buffer | null {
  const raw = envValue ?? process.env.FIELD_ENCRYPTION_KEY;
  if (!raw) {
    if (process.env.NODE_ENV === 'production') {
      return null;
    }
    return null;
  }
  if (/^[0-9a-fA-F]{64}$/.test(raw)) {
    return Buffer.from(raw, 'hex');
  }
  const buf = Buffer.from(raw, 'base64');
  if (buf.length !== 32) {
    throw new Error('FIELD_ENCRYPTION_KEY must be 32 bytes (base64) or 64 hex chars');
  }
  return buf;
}

export function isFieldEncryptionConfigured(): boolean {
  return resolveFieldEncryptionKey() !== null;
}

export function encryptField(plaintext: string, keyEnv?: string): string {
  const key = resolveFieldEncryptionKey(keyEnv);
  if (!key) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FIELD_ENCRYPTION_KEY is required to encrypt PII in production');
    }
    return plaintext;
  }
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${PREFIX}${Buffer.concat([iv, tag, encrypted]).toString('base64url')}`;
}

export function decryptField(ciphertext: string, keyEnv?: string): string {
  if (!ciphertext.startsWith(PREFIX)) {
    return ciphertext;
  }
  const key = resolveFieldEncryptionKey(keyEnv);
  if (!key) {
    throw new Error('FIELD_ENCRYPTION_KEY required to decrypt field');
  }
  const raw = Buffer.from(ciphertext.slice(PREFIX.length), 'base64url');
  const iv = raw.subarray(0, IV_LEN);
  const tag = raw.subarray(IV_LEN, IV_LEN + TAG_LEN);
  const data = raw.subarray(IV_LEN + TAG_LEN);
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
}

/** One-way hash for OTP / verification codes (never store plaintext codes). */
export function hashVerificationSecret(value: string, salt?: string): string {
  const s = salt ?? process.env.FIELD_ENCRYPTION_KEY ?? 'eduai-dev-verification-salt';
  return crypto.createHmac('sha256', s).update(value).digest('hex');
}
