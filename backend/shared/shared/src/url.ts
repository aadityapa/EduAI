/** Browsers cannot navigate to 0.0.0.0 — normalize bind-all addresses to localhost. */
export function normalizeBrowserUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === '0.0.0.0') {
      parsed.hostname = 'localhost';
    }
    return parsed.toString().replace(/\/$/, '');
  } catch {
    return url.replace(/0\.0\.0\.0/g, 'localhost').replace(/\/$/, '');
  }
}

/** Student / Teacher / Parent web portal base URL (browser-safe). */
export function getWebPortalUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_WEB_URL ??
    process.env.AUTH_URL ??
    'http://localhost:3000';
  return normalizeBrowserUrl(raw);
}

/** Admin CRM portal base URL (browser-safe). */
export function getAdminPortalUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_ADMIN_URL ??
    process.env.AUTH_URL_ADMIN ??
    'http://localhost:3002';
  return normalizeBrowserUrl(raw);
}

/** Absolute login URL for sign-out redirects (avoids invalid 0.0.0.0 hosts). */
export function getPortalLoginUrl(app: 'web' | 'admin'): string {
  const base = app === 'admin' ? getAdminPortalUrl() : getWebPortalUrl();
  return `${base}/login`;
}
