import { createHash } from 'node:crypto';
import type { CompletionResult } from '../types.js';

export interface CacheEntry {
  result: CompletionResult;
  expiresAt: number;
}

export interface ResponseCacheOptions {
  ttlMs?: number;
  maxEntries?: number;
}

export class ResponseCache {
  private readonly store = new Map<string, CacheEntry>();
  private readonly ttlMs: number;
  private readonly maxEntries: number;

  constructor(options: ResponseCacheOptions = {}) {
    this.ttlMs = options.ttlMs ?? 5 * 60 * 1000;
    this.maxEntries = options.maxEntries ?? 500;
  }

  private hashKey(feature: string, messages: string, model?: string): string {
    return createHash('sha256')
      .update(`${feature}:${model ?? 'default'}:${messages}`)
      .digest('hex');
  }

  get(feature: string, messages: string, model?: string): CompletionResult | null {
    const key = this.hashKey(feature, messages, model);
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.result;
  }

  set(feature: string, messages: string, result: CompletionResult, model?: string): void {
    if (this.store.size >= this.maxEntries) {
      const oldest = this.store.keys().next().value;
      if (oldest) this.store.delete(oldest);
    }
    const key = this.hashKey(feature, messages, model);
    this.store.set(key, { result, expiresAt: Date.now() + this.ttlMs });
  }

  clear(): void {
    this.store.clear();
  }

  size(): number {
    return this.store.size;
  }
}
