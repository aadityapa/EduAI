import { describe, it, expect, vi } from 'vitest';
import { backoffDelay, defaultShouldRetry, withRetry } from '../api/retry';
import { ApiError } from '../api/errors';
import { cacheKey, isCacheFresh, type CacheEntry } from '../offline/cache';
import { tokens } from '../theme/tokens';
import { mapEnrollmentsToCourses } from '../utils/courses';

describe('withRetry', () => {
  it('returns on first success', async () => {
    const fn = vi.fn().mockResolvedValue(42);
    await expect(withRetry(fn, { retries: 3, sleep: async () => undefined })).resolves.toBe(42);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries then succeeds', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('net'))
      .mockResolvedValueOnce('ok');
    await expect(
      withRetry(fn, { retries: 3, baseDelayMs: 1, maxDelayMs: 2, sleep: async () => undefined }),
    ).resolves.toBe('ok');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('does not retry 4xx ApiError', async () => {
    const fn = vi.fn().mockRejectedValue(new ApiError(401, 'Unauthorized'));
    await expect(
      withRetry(fn, { retries: 3, sleep: async () => undefined }),
    ).rejects.toMatchObject({ status: 401 });
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('defaultShouldRetry', () => {
  it('retries 503 and network errors', () => {
    expect(defaultShouldRetry(new ApiError(503, 'down'))).toBe(true);
    expect(defaultShouldRetry(new Error('failed'))).toBe(true);
  });

  it('skips 400-level', () => {
    expect(defaultShouldRetry(new ApiError(404, 'missing'))).toBe(false);
  });
});

describe('backoffDelay', () => {
  it('grows exponentially and caps', () => {
    expect(backoffDelay(1, 100, 1000)).toBeGreaterThanOrEqual(100);
    expect(backoffDelay(10, 100, 250)).toBeLessThanOrEqual(350);
  });
});

describe('offline cache helpers', () => {
  it('prefixes keys', () => {
    expect(cacheKey('courses')).toBe('eduai_cache_v1_courses');
  });

  it('detects fresh vs stale entries', () => {
    const fresh: CacheEntry<number> = { data: 1, cachedAt: Date.now(), ttlMs: 60_000 };
    const stale: CacheEntry<number> = { data: 1, cachedAt: Date.now() - 120_000, ttlMs: 60_000 };
    expect(isCacheFresh(fresh)).toBe(true);
    expect(isCacheFresh(stale)).toBe(false);
    expect(isCacheFresh({ data: 1, cachedAt: 0, ttlMs: null })).toBe(true);
  });
});

describe('tokens', () => {
  it('mirrors Stitch primary and tertiary', () => {
    expect(tokens.colors.primary).toBe('#1A73E8');
    expect(tokens.colors.tertiary).toBe('#9334E6');
    expect(tokens.spacing.unit).toBe(4);
  });
});

describe('mapEnrollmentsToCourses', () => {
  it('maps enrollment payloads to carousel cards', () => {
    const cards = mapEnrollmentsToCourses([
      { id: 'e1', course: { title: 'Algebra', subject: { name: 'Math' } }, progress: 40 },
    ]);
    expect(cards).toHaveLength(1);
    expect(cards[0].title).toBe('Math');
    expect(cards[0].progress).toBe(40);
  });

  it('handles empty list', () => {
    expect(mapEnrollmentsToCourses([])).toEqual([]);
  });
});
