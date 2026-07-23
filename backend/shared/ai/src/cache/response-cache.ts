import { createHash } from 'node:crypto';
import type { CompletionResult } from '../types.js';
import { MemoryKvStore, type KvStore } from './kv-store.js';

export interface CacheEntry {
  result: CompletionResult;
  expiresAt: number;
}

export interface ResponseCacheOptions {
  ttlMs?: number;
  maxEntries?: number;
  /** Optional external store (Redis). Falls back to in-memory. */
  kv?: KvStore;
  keyPrefix?: string;
}

/**
 * Exact-match semantic-lite cache (hash of feature + messages + model).
 * Vector / embedding similarity cache is deferred (see phase-7-completion).
 */
export class ResponseCache {
  private readonly memory = new MemoryKvStore();
  private readonly kv: KvStore;
  private readonly ttlMs: number;
  private readonly ttlSec: number;
  private readonly maxEntries: number;
  private readonly keyPrefix: string;
  private localSize = 0;

  constructor(options: ResponseCacheOptions = {}) {
    this.ttlMs = options.ttlMs ?? 5 * 60 * 1000;
    this.ttlSec = Math.max(1, Math.floor(this.ttlMs / 1000));
    this.maxEntries = options.maxEntries ?? 500;
    this.kv = options.kv ?? this.memory;
    this.keyPrefix = options.keyPrefix ?? '';
  }

  private hashKey(feature: string, messages: string, model?: string): string {
    return (
      this.keyPrefix +
      createHash('sha256')
        .update(`${feature}:${model ?? 'default'}:${messages}`)
        .digest('hex')
    );
  }

  /** Sync get for in-memory path (tests / legacy). Prefer getAsync. */
  get(feature: string, messages: string, model?: string): CompletionResult | null {
    const key = this.hashKey(feature, messages, model);
    // Only synchronous when using MemoryKvStore without Redis
    if (this.kv !== this.memory) return null;
    const sync = this.memory as MemoryKvStore;
    // MemoryKvStore is async API; peek via internal for sync compat is not exposed —
    // use cached sync map for memory-only mode
    return this.syncGet(key);
  }

  private syncStore = new Map<string, CacheEntry>();

  private syncGet(key: string): CompletionResult | null {
    const entry = this.syncStore.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.syncStore.delete(key);
      this.localSize = Math.max(0, this.localSize - 1);
      return null;
    }
    return entry.result;
  }

  private syncSet(key: string, result: CompletionResult): void {
    if (this.syncStore.size >= this.maxEntries) {
      const oldest = this.syncStore.keys().next().value;
      if (oldest) {
        this.syncStore.delete(oldest);
        this.localSize = Math.max(0, this.localSize - 1);
      }
    }
    this.syncStore.set(key, { result, expiresAt: Date.now() + this.ttlMs });
    this.localSize = this.syncStore.size;
  }

  set(feature: string, messages: string, result: CompletionResult, model?: string): void {
    const key = this.hashKey(feature, messages, model);
    this.syncSet(key, result);
    void this.kv.set(key, JSON.stringify(result), this.ttlSec);
  }

  async getAsync(
    feature: string,
    messages: string,
    model?: string,
  ): Promise<CompletionResult | null> {
    const key = this.hashKey(feature, messages, model);
    const local = this.syncGet(key);
    if (local) return local;

    try {
      const raw = await this.kv.get(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as CompletionResult;
      this.syncSet(key, parsed);
      return parsed;
    } catch {
      return null;
    }
  }

  async setAsync(
    feature: string,
    messages: string,
    result: CompletionResult,
    model?: string,
  ): Promise<void> {
    const key = this.hashKey(feature, messages, model);
    this.syncSet(key, result);
    await this.kv.set(key, JSON.stringify(result), this.ttlSec);
  }

  clear(): void {
    this.syncStore.clear();
    this.localSize = 0;
    this.memory.clear();
  }

  size(): number {
    return this.syncStore.size || this.localSize;
  }
}
