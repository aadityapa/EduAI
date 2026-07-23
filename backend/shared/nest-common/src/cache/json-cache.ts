/**
 * Shared JSON cache (memory + optional Redis).
 * Used for curriculum and other read-heavy payloads.
 */

export interface JsonKvStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSec: number): Promise<void>;
  del(key: string): Promise<void>;
  /** Optional SCAN-style delete by prefix (Redis: KEYS/SCAN). */
  delByPrefix?(prefix: string): Promise<number>;
}

export class MemoryJsonKvStore implements JsonKvStore {
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

  async delByPrefix(prefix: string): Promise<number> {
    let n = 0;
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
        n += 1;
      }
    }
    return n;
  }

  clear(): void {
    this.store.clear();
  }
}

export interface RedisJsonClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, expiryMode: 'EX', ttlSec: number): Promise<unknown>;
  del(...keys: string[]): Promise<unknown>;
  keys(pattern: string): Promise<string[]>;
}

export class RedisJsonKvStore implements JsonKvStore {
  constructor(
    private readonly redis: RedisJsonClient,
    private readonly keyPrefix: string,
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
      // best-effort
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(this.prefix(key));
    } catch {
      // ignore
    }
  }

  async delByPrefix(logicalPrefix: string): Promise<number> {
    try {
      const pattern = `${this.keyPrefix}${logicalPrefix}*`;
      const keys = await this.redis.keys(pattern);
      if (keys.length === 0) return 0;
      await this.redis.del(...keys);
      return keys.length;
    } catch {
      return 0;
    }
  }
}

export class JsonCache {
  constructor(
    private readonly store: JsonKvStore,
    private readonly defaultTtlSec: number,
  ) {}

  async get<T>(key: string): Promise<T | null> {
    const raw = await this.store.get(key);
    if (raw == null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      await this.store.del(key);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSec = this.defaultTtlSec): Promise<void> {
    await this.store.set(key, JSON.stringify(value), ttlSec);
  }

  async del(key: string): Promise<void> {
    await this.store.del(key);
  }

  async invalidatePrefix(prefix: string): Promise<number> {
    if (this.store.delByPrefix) {
      return this.store.delByPrefix(prefix);
    }
    return 0;
  }
}
