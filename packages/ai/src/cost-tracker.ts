import type { TokenUsage } from './types.js';

export interface CostRecord {
  tenantId?: string;
  userId?: string;
  provider: string;
  model: string;
  feature: string;
  tokensUsed: TokenUsage;
  timestamp: Date;
}

export interface CostTracker {
  record(record: CostRecord): void | Promise<void>;
  getUsage(filter?: { tenantId?: string; userId?: string }): Promise<{
    totalTokens: number;
    promptTokens: number;
    completionTokens: number;
    requestCount: number;
    byFeature: Record<string, number>;
    byProvider: Record<string, number>;
  }>;
}

export class InMemoryCostTracker implements CostTracker {
  private readonly records: CostRecord[] = [];

  record(record: CostRecord): void {
    this.records.push({ ...record, timestamp: record.timestamp ?? new Date() });
  }

  async getUsage(filter?: { tenantId?: string; userId?: string }): Promise<{
    totalTokens: number;
    promptTokens: number;
    completionTokens: number;
    requestCount: number;
    byFeature: Record<string, number>;
    byProvider: Record<string, number>;
  }> {
    const filtered = this.records.filter((r) => {
      if (filter?.tenantId && r.tenantId !== filter.tenantId) return false;
      if (filter?.userId && r.userId !== filter.userId) return false;
      return true;
    });

    let totalTokens = 0;
    let promptTokens = 0;
    let completionTokens = 0;
    const byFeature: Record<string, number> = {};
    const byProvider: Record<string, number> = {};

    for (const r of filtered) {
      totalTokens += r.tokensUsed.total;
      promptTokens += r.tokensUsed.prompt;
      completionTokens += r.tokensUsed.completion;
      byFeature[r.feature] = (byFeature[r.feature] ?? 0) + r.tokensUsed.total;
      byProvider[r.provider] = (byProvider[r.provider] ?? 0) + r.tokensUsed.total;
    }

    return {
      totalTokens,
      promptTokens,
      completionTokens,
      requestCount: filtered.length,
      byFeature,
      byProvider,
    };
  }

  clear(): void {
    this.records.length = 0;
  }
}
