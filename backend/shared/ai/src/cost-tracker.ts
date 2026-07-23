import type { TokenUsage } from './types.js';
import { estimateCostUsd } from './pricing.js';

export interface CostRecord {
  tenantId?: string;
  userId?: string;
  provider: string;
  model: string;
  feature: string;
  tokensUsed: TokenUsage;
  estimatedCostUsd?: number;
  tier?: string;
  cached?: boolean;
  timestamp: Date;
}

export interface CostTracker {
  record(record: CostRecord): void | Promise<void>;
  getUsage(filter?: { tenantId?: string; userId?: string }): Promise<{
    totalTokens: number;
    promptTokens: number;
    completionTokens: number;
    requestCount: number;
    estimatedCostUsd: number;
    byFeature: Record<string, number>;
    byProvider: Record<string, number>;
    byModel: Record<string, number>;
  }>;
}

export class InMemoryCostTracker implements CostTracker {
  private readonly records: CostRecord[] = [];

  record(record: CostRecord): void {
    const estimatedCostUsd =
      record.estimatedCostUsd ?? estimateCostUsd(record.model, record.tokensUsed.total);
    this.records.push({
      ...record,
      estimatedCostUsd,
      timestamp: record.timestamp ?? new Date(),
    });
  }

  async getUsage(filter?: { tenantId?: string; userId?: string }): Promise<{
    totalTokens: number;
    promptTokens: number;
    completionTokens: number;
    requestCount: number;
    estimatedCostUsd: number;
    byFeature: Record<string, number>;
    byProvider: Record<string, number>;
    byModel: Record<string, number>;
  }> {
    const filtered = this.records.filter((r) => {
      if (filter?.tenantId && r.tenantId !== filter.tenantId) return false;
      if (filter?.userId && r.userId !== filter.userId) return false;
      return true;
    });

    let totalTokens = 0;
    let promptTokens = 0;
    let completionTokens = 0;
    let estimatedCostUsd = 0;
    const byFeature: Record<string, number> = {};
    const byProvider: Record<string, number> = {};
    const byModel: Record<string, number> = {};

    for (const r of filtered) {
      totalTokens += r.tokensUsed.total;
      promptTokens += r.tokensUsed.prompt;
      completionTokens += r.tokensUsed.completion;
      estimatedCostUsd += r.estimatedCostUsd ?? estimateCostUsd(r.model, r.tokensUsed.total);
      byFeature[r.feature] = (byFeature[r.feature] ?? 0) + r.tokensUsed.total;
      byProvider[r.provider] = (byProvider[r.provider] ?? 0) + r.tokensUsed.total;
      byModel[r.model] = (byModel[r.model] ?? 0) + r.tokensUsed.total;
    }

    return {
      totalTokens,
      promptTokens,
      completionTokens,
      requestCount: filtered.length,
      estimatedCostUsd: Math.round(estimatedCostUsd * 1_000_000) / 1_000_000,
      byFeature,
      byProvider,
      byModel,
    };
  }

  clear(): void {
    this.records.length = 0;
  }
}
