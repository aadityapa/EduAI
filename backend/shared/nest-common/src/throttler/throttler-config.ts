import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import Redis from 'ioredis';
import { RedisThrottlerStorage } from './redis-throttler.storage.js';

export interface ThrottlerPreset {
  name: string;
  ttl: number;
  limit: number;
}

/**
 * Named throttler presets (apply via `@Throttle({ auth: { … } })` etc.).
 * - default: general API
 * - auth: login/register/refresh (stricter)
 * - mutate: POST/PATCH/DELETE high-value writes
 * - webhook: payment provider callbacks
 * - ai: generative endpoints (services may still add their own `ai` preset)
 */
export const DEFAULT_THROTTLER_PRESETS: ThrottlerPreset[] = [
  { name: 'default', ttl: 60_000, limit: 120 },
  { name: 'auth', ttl: 900_000, limit: 20 },
  { name: 'mutate', ttl: 60_000, limit: 40 },
  { name: 'webhook', ttl: 60_000, limit: 120 },
];

export function buildThrottlerModule(
  extraPresets: ThrottlerPreset[] = [],
  redisUrl?: string,
) {
  const byName = new Map<string, ThrottlerPreset>();
  for (const p of [...DEFAULT_THROTTLER_PRESETS, ...extraPresets]) {
    byName.set(p.name, p);
  }
  const throttlers = [...byName.values()];
  const options: ThrottlerModuleOptions = { throttlers };

  if (redisUrl) {
    const redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 2,
      enableReadyCheck: true,
      lazyConnect: true,
    });
    options.storage = new RedisThrottlerStorage(redis);
    redis.connect().catch(() => {
      // Fallback to in-memory if Redis unavailable at boot
    });
  }

  return ThrottlerModule.forRoot(options);
}
