import { useCallback, useEffect, useState } from 'react';
import { cacheGet, cacheSet } from '../offline/cache';

export type ResourceState<T> = {
  data: T | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  offline: boolean;
  reload: () => Promise<void>;
};

/**
 * Fetch with AsyncStorage fallback + pull-to-refresh.
 * On network failure, serves last cached payload and sets `offline`.
 */
export function useCachedResource<T>(
  cacheId: string | null,
  fetcher: (() => Promise<T>) | null,
  options?: { ttlMs?: number | null; enabled?: boolean },
): ResourceState<T> {
  const enabled = options?.enabled !== false && !!cacheId && !!fetcher;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);

  const load = useCallback(
    async (isRefresh = false) => {
      if (!cacheId || !fetcher || !enabled) {
        setLoading(false);
        return;
      }
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      try {
        const fresh = await fetcher();
        setData(fresh);
        await cacheSet(cacheId, fresh, options?.ttlMs ?? 24 * 60 * 60 * 1000);
        setOffline(false);
      } catch (e) {
        const cached = await cacheGet<T>(cacheId);
        if (cached != null) {
          setData(cached);
          setOffline(true);
          setError(null);
        } else {
          setError(e instanceof Error ? e.message : 'Something went wrong');
          setOffline(true);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [cacheId, fetcher, enabled, options?.ttlMs],
  );

  useEffect(() => {
    void load(false);
  }, [load]);

  return {
    data,
    loading,
    refreshing,
    error,
    offline,
    reload: () => load(true),
  };
}
