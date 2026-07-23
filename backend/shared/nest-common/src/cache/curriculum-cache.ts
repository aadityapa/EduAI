import Redis from 'ioredis';
import {
  JsonCache,
  MemoryJsonKvStore,
  RedisJsonKvStore,
} from './json-cache.js';
import {
  CURRICULUM_CACHE_TTL_SEC,
  CurriculumCacheKeys,
  type CurriculumInvalidationTarget,
} from './curriculum-keys.js';

let shared: JsonCache | null = null;
let redisClient: Redis | null = null;

/**
 * Curriculum / catalog JSON cache.
 * Redis when REDIS_URL is set; otherwise in-process memory (dev-safe).
 */
export function getCurriculumCache(redisUrl = process.env.REDIS_URL): JsonCache {
  if (shared) return shared;

  const ttl = CURRICULUM_CACHE_TTL_SEC;
  if (redisUrl) {
    try {
      redisClient = new Redis(redisUrl, {
        maxRetriesPerRequest: 1,
        enableReadyCheck: false,
        lazyConnect: true,
      });
      void redisClient.connect().catch(() => {
        redisClient = null;
      });
      shared = new JsonCache(
        new RedisJsonKvStore(redisClient, 'eduai:curriculum:'),
        ttl,
      );
      return shared;
    } catch {
      // fall through to memory
    }
  }

  shared = new JsonCache(new MemoryJsonKvStore(), ttl);
  return shared;
}

/** Explicit invalidation — call after curriculum publish / update / soft-delete. */
export async function invalidateCurriculumCache(
  target: CurriculumInvalidationTarget,
  cache = getCurriculumCache(),
): Promise<void> {
  if (target.type === 'quiz') {
    await cache.del(CurriculumCacheKeys.quiz(target.quizId));
    return;
  }
  if (target.type === 'course') {
    await cache.del(CurriculumCacheKeys.course(target.tenantId, target.courseId));
    await cache.del(CurriculumCacheKeys.courseLessons(target.tenantId, target.courseId));
    await cache.invalidatePrefix(`catalog:${target.tenantId}`);
    await cache.invalidatePrefix(`hub:${target.tenantId}`);
    return;
  }
  await cache.invalidatePrefix(`catalog:${target.tenantId}`);
  await cache.invalidatePrefix(`hub:${target.tenantId}`);
  await cache.invalidatePrefix(`course:${target.tenantId}`);
  await cache.invalidatePrefix(`course-lessons:${target.tenantId}`);
}

/** Test helper */
export function resetCurriculumCacheForTests(): void {
  shared = null;
  if (redisClient) {
    void redisClient.quit().catch(() => undefined);
    redisClient = null;
  }
}
