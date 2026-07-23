/**
 * Minimal key-value store for response caching.
 * In-memory by default; Redis adapter injected when REDIS_URL is available.
 */

export interface KvStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSec: number): Promise<void>;
  del?(key: string): Promise<void>;
}

export class MemoryKvStore implements KvStore {
  private readonly store = new Map<string, { value: string; expiresAt: number }>();

  async get(key: string): Promise<string | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key: string, value: string, ttlSec: number): Promise<void> {
    this.store.set(key, { value, expiresAt: Date.now() + ttlSec * 1000 });
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }

  size(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }
}

/** Redis-compatible client subset (ioredis / node-redis). */
export interface RedisLikeClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, expiryMode: 'EX', ttlSec: number): Promise<unknown>;
  del(key: string): Promise<unknown>;
}

export class RedisKvStore implements KvStore {
  constructor(
    private readonly redis: RedisLikeClient,
    private readonly keyPrefix = 'eduai:ai:cache:',
  ) {}

  private prefix(key: string): string {
    return `${this.keyPrefix}${key}`;
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.redis.get(this.prefix(key));
    } catch {
      return null;
    }
  }

  async set(key: string, value: string, ttlSec: number): Promise<void> {
    try {
      await this.redis.set(this.prefix(key), value, 'EX', ttlSec);
    } catch {
      // best-effort cache
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(this.prefix(key));
    } catch {
      // ignore
    }
  }
}
