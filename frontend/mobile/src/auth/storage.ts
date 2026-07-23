import * as SecureStore from 'expo-secure-store';
import type { AuthTokens } from '../api/services';
import { cacheGet, cacheSet, cacheClear } from '../offline/cache';

const TOKEN_KEY = 'eduai_tokens';
const PUSH_TOKEN_KEY = 'eduai_expo_push_token';

export async function saveTokens(tokens: AuthTokens): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(tokens));
}

export async function loadTokens(): Promise<AuthTokens | null> {
  const raw = await SecureStore.getItemAsync(TOKEN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthTokens;
  } catch {
    return null;
  }
}

export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function savePushToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(PUSH_TOKEN_KEY, token);
}

export async function loadPushToken(): Promise<string | null> {
  return SecureStore.getItemAsync(PUSH_TOKEN_KEY);
}

/** Re-export offline cache helpers used by screens. */
export { cacheGet, cacheSet, cacheClear };
