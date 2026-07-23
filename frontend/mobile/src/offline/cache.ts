import AsyncStorage from '@react-native-async-storage/async-storage';

const OFFLINE_PREFIX = 'eduai_cache_v1_';

export type CacheEntry<T> = {
  data: T;
  cachedAt: number;
  /** Optional TTL in ms; null = forever until overwritten. */
  ttlMs: number | null;
};

export function cacheKey(key: string): string {
  return `${OFFLINE_PREFIX}${key}`;
}

export function isCacheFresh(entry: CacheEntry<unknown>, now = Date.now()): boolean {
  if (entry.ttlMs == null) return true;
  return now - entry.cachedAt < entry.ttlMs;
}

export async function cacheSet<T>(
  key: string,
  data: T,
  ttlMs: number | null = 24 * 60 * 60 * 1000,
): Promise<void> {
  const entry: CacheEntry<T> = { data, cachedAt: Date.now(), ttlMs };
  await AsyncStorage.setItem(cacheKey(key), JSON.stringify(entry));
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(cacheKey(key));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CacheEntry<T> | T;
    // Legacy bare payloads (pre Phase 5)
    if (parsed && typeof parsed === 'object' && 'data' in parsed && 'cachedAt' in parsed) {
      const entry = parsed as CacheEntry<T>;
      if (!isCacheFresh(entry)) return null;
      return entry.data;
    }
    return parsed as T;
  } catch {
    return null;
  }
}

export async function cacheGetEntry<T>(key: string): Promise<CacheEntry<T> | null> {
  const raw = await AsyncStorage.getItem(cacheKey(key));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CacheEntry<T> | T;
    if (parsed && typeof parsed === 'object' && 'data' in parsed && 'cachedAt' in parsed) {
      return parsed as CacheEntry<T>;
    }
    return { data: parsed as T, cachedAt: 0, ttlMs: null };
  } catch {
    return null;
  }
}

export async function cacheClear(key: string): Promise<void> {
  await AsyncStorage.removeItem(cacheKey(key));
}
