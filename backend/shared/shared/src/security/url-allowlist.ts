/**
 * SSRF protection: only allow https URLs against an explicit host allowlist.
 * Blocks link-local, metadata endpoints, and private IP literals.
 */

const BLOCKED_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^169\.254\./,
  /^0\.0\.0\.0$/,
  /^\[::1\]$/,
  /^metadata\.google\.internal$/i,
  /^metadata$/i,
];

export interface UrlAllowlistOptions {
  /** Allowed hostnames (exact or suffix like `.cdn.example.com`). */
  allowedHosts?: string[];
  /** Allow http in non-production only. Default false. */
  allowHttpInDev?: boolean;
}

const DEFAULT_HOSTS = [
  'eduai-uploads.s3.ap-south-1.amazonaws.com',
  'cdn.eduai.local',
  'images.unsplash.com',
  'i.imgur.com',
];

function hostAllowed(hostname: string, allowed: string[]): boolean {
  const host = hostname.toLowerCase();
  return allowed.some((rule) => {
    const r = rule.toLowerCase();
    if (r.startsWith('.')) return host.endsWith(r) || host === r.slice(1);
    return host === r || host.endsWith(`.${r}`);
  });
}

export function isBlockedInternalHost(hostname: string): boolean {
  return BLOCKED_HOST_PATTERNS.some((re) => re.test(hostname));
}

/**
 * Validate a user-supplied URL for server-side fetch / OCR.
 * @throws Error with message suitable for BadRequestException
 */
export function assertSafeExternalUrl(rawUrl: string, options: UrlAllowlistOptions = {}): URL {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error('Invalid URL');
  }

  const allowHttp =
    options.allowHttpInDev === true && process.env.NODE_ENV !== 'production';
  if (parsed.protocol !== 'https:' && !(allowHttp && parsed.protocol === 'http:')) {
    throw new Error('Only https URLs are allowed');
  }

  if (isBlockedInternalHost(parsed.hostname)) {
    throw new Error('URL host is not allowed');
  }

  const allowed = options.allowedHosts?.length
    ? options.allowedHosts
    : (process.env.UPLOAD_URL_ALLOWLIST?.split(',').map((s) => s.trim()).filter(Boolean) ??
      DEFAULT_HOSTS);

  if (!hostAllowed(parsed.hostname, allowed)) {
    throw new Error(`URL host not in allowlist: ${parsed.hostname}`);
  }

  return parsed;
}

export function getUploadUrlAllowlist(): string[] {
  return (
    process.env.UPLOAD_URL_ALLOWLIST?.split(',').map((s) => s.trim()).filter(Boolean) ??
    DEFAULT_HOSTS
  );
}
