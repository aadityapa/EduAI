import { createHash } from 'node:crypto';

export interface PromptCacheEntry {
  systemPrompt: string;
  expiresAt: number;
}

export class PromptCache {
  private readonly store = new Map<string, PromptCacheEntry>();
  private readonly ttlMs: number;

  constructor(ttlMs = 60 * 60 * 1000) {
    this.ttlMs = ttlMs;
  }

  private key(feature: string, tenantId?: string): string {
    return createHash('sha256')
      .update(`${feature}:${tenantId ?? 'global'}`)
      .digest('hex');
  }

  get(feature: string, tenantId?: string): string | null {
    const entry = this.store.get(this.key(feature, tenantId));
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(this.key(feature, tenantId));
      return null;
    }
    return entry.systemPrompt;
  }

  set(feature: string, systemPrompt: string, tenantId?: string): void {
    this.store.set(this.key(feature, tenantId), {
      systemPrompt,
      expiresAt: Date.now() + this.ttlMs,
    });
  }

  clear(): void {
    this.store.clear();
  }
}
