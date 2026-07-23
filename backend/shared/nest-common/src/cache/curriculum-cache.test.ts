import { describe, expect, it, beforeEach } from 'vitest';
import { JsonCache, MemoryJsonKvStore } from './json-cache.js';
import { CurriculumCacheKeys } from './curriculum-keys.js';
import {
  invalidateCurriculumCache,
  resetCurriculumCacheForTests,
} from './curriculum-cache.js';

describe('JsonCache', () => {
  it('round-trips JSON values', async () => {
    const cache = new JsonCache(new MemoryJsonKvStore(), 60);
    await cache.set('a', { n: 1 });
    expect(await cache.get<{ n: number }>('a')).toEqual({ n: 1 });
  });

  it('invalidates by prefix', async () => {
    const store = new MemoryJsonKvStore();
    const cache = new JsonCache(store, 60);
    await cache.set('catalog:t1:all', [1]);
    await cache.set('catalog:t1:board=x', [2]);
    await cache.set('catalog:t2:all', [3]);
    const n = await cache.invalidatePrefix('catalog:t1');
    expect(n).toBe(2);
    expect(await cache.get('catalog:t1:all')).toBeNull();
    expect(await cache.get('catalog:t2:all')).toEqual([3]);
  });
});

describe('CurriculumCacheKeys', () => {
  it('stable-sorts filter keys', () => {
    const a = CurriculumCacheKeys.catalog('t1', { boardId: 'b', classLevel: 10 });
    const b = CurriculumCacheKeys.catalog('t1', { classLevel: 10, boardId: 'b' });
    expect(a).toBe(b);
  });
});

describe('invalidateCurriculumCache', () => {
  beforeEach(() => {
    resetCurriculumCacheForTests();
  });

  it('clears quiz key', async () => {
    const { getCurriculumCache } = await import('./curriculum-cache.js');
    const cache = getCurriculumCache();
    await cache.set(CurriculumCacheKeys.quiz('q1'), { id: 'q1' });
    await invalidateCurriculumCache({ type: 'quiz', quizId: 'q1' }, cache);
    expect(await cache.get(CurriculumCacheKeys.quiz('q1'))).toBeNull();
  });
});
