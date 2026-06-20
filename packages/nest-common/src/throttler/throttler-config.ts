import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import Redis from 'ioredis';
import { RedisThrottlerStorage } from './redis-throttler.storage.js';

export interface ThrottlerPreset {
  name: string;
  ttl: number;
  limit: number;
}

const DEFAULT_PRESETS: ThrottlerPreset[] = [
  { name: 'default', ttl: 60000, limit: 120 },
  { name: 'auth', ttl: 900000, limit: 20 },
];

export function buildThrottlerModule(
  extraPresets: ThrottlerPreset[] = [],
  redisUrl?: string,
) {
  const throttlers = [...DEFAULT_PRESETS, ...extraPresets];
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
