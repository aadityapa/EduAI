import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { estimateCostUsd } from '@eduai/ai';
import { PrismaService } from '../prisma/prisma.service';

export interface QuotaCheckResult {
  allowed: boolean;
  used: number;
  budget: number;
  remaining: number;
  resetAt: string;
  tier: string;
}

@Injectable()
export class CostService {
  constructor(private readonly prisma: PrismaService) {}

  private startOfUtcDay(d = new Date()): Date {
    const day = new Date(d);
    day.setUTCHours(0, 0, 0, 0);
    return day;
  }

  private nextUtcMidnight(from = new Date()): Date {
    const next = this.startOfUtcDay(from);
    next.setUTCDate(next.getUTCDate() + 1);
    return next;
  }

  async getQuotaStatus(tenantId: string, userId: string): Promise<QuotaCheckResult> {
    const today = this.startOfUtcDay();
    const usage = await this.prisma.aiQuotaUsage.findUnique({
      where: { tenantId_userId_usageDate: { tenantId, userId, usageDate: today } },
    });

    const [tenant, subscription] = await Promise.all([
      this.prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { aiMonthlyTokenBudget: true, subscriptionTier: true },
      }),
      this.prisma.tenantSubscription.findFirst({
        where: { tenantId, status: { in: ['active', 'trialing'] } },
        include: { plan: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const monthlyBudget =
      subscription?.plan.aiTokenBudget ?? tenant?.aiMonthlyTokenBudget ?? 1_000_000;
    const dailyBudget = Math.max(1_000, Math.floor(monthlyBudget / 30));
    const used = usage?.tokensUsed ?? 0;

    return {
      allowed: used < dailyBudget,
      used,
      budget: dailyBudget,
      remaining: Math.max(0, dailyBudget - used),
      resetAt: this.nextUtcMidnight().toISOString(),
      tier: tenant?.subscriptionTier ?? 'starter',
    };
  }

  /**
   * Enforce per-user daily quota derived from tenant/plan monthly budget.
   * On exceed: HTTP 429 with upsell / queue guidance (never silent fail).
   */
  async checkQuota(tenantId: string, userId: string, tokensNeeded: number): Promise<QuotaCheckResult> {
    const status = await this.getQuotaStatus(tenantId, userId);

    if (status.used + tokensNeeded > status.budget) {
      const retryAfterSeconds = Math.max(
        60,
        Math.floor((new Date(status.resetAt).getTime() - Date.now()) / 1000),
      );
      throw new HttpException(
        {
          code: 'AI_QUOTA_EXCEEDED',
          message: 'Daily AI token quota exceeded',
          details: {
            used: status.used,
            budget: status.budget,
            remaining: status.remaining,
            resetAt: status.resetAt,
            tier: status.tier,
            action: status.tier === 'enterprise' ? 'queue' : 'upsell',
            upgradeHint:
              status.tier === 'enterprise'
                ? 'Your plan is at capacity. Requests can be queued until quota resets.'
                : 'Upgrade your plan for a higher AI token budget, or retry after reset.',
            queueSuggested: true,
            retryAfterSeconds,
          },
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return status;
  }

  async getTenantCostSummary(tenantId: string) {
    const records = await this.prisma.aiQuotaUsage.findMany({
      where: { tenantId },
      orderBy: { usageDate: 'desc' },
      take: 30,
    });

    const totalTokens = records.reduce((sum, r) => sum + r.tokensUsed, 0);
    const totalQueries = records.reduce((sum, r) => sum + r.queryCount, 0);
    // Blended dashboard estimate; live model rates applied when cost tracker records exist
    const estimatedCostUsd = estimateCostUsd('gpt-4o-mini', totalTokens);

    return { totalTokens, totalQueries, estimatedCostUsd, daily: records };
  }
}
