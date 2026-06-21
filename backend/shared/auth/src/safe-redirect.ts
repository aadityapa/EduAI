import type { NextAuthConfig } from 'next-auth';
import { normalizeBrowserUrl } from '@eduai/shared';

/** Auth.js redirect callback — never send users to 0.0.0.0 (invalid in browsers). */
export const safeAuthRedirect: NonNullable<NextAuthConfig['callbacks']>['redirect'] = ({
  url,
  baseUrl,
}) => {
  const safeBase = normalizeBrowserUrl(baseUrl);
  if (url.startsWith('/')) {
    return `${safeBase}${url}`;
  }
  try {
    const target = new URL(url);
    const base = new URL(safeBase);
    if (target.origin === base.origin) {
      return normalizeBrowserUrl(url);
    }
  } catch {
    return `${safeBase}/login`;
  }
  return safeBase;
};
