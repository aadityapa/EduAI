import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CostService {
  constructor(private readonly prisma: PrismaService) {}

  async checkQuota(tenantId: string, userId: string, tokensNeeded: number): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const usage = await this.prisma.aiQuotaUsage.findUnique({
      where: { tenantId_userId_usageDate: { tenantId, userId, usageDate: today } },
    });

    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { aiMonthlyTokenBudget: true },
    });

    const dailyBudget = Math.floor((tenant?.aiMonthlyTokenBudget ?? 1_000_000) / 30);
    const usedToday = usage?.tokensUsed ?? 0;

    if (usedToday + tokensNeeded > dailyBudget) {
      throw new ForbiddenException('Daily AI token quota exceeded');
    }
  }

  async getTenantCostSummary(tenantId: string) {
    const records = await this.prisma.aiQuotaUsage.findMany({
      where: { tenantId },
      orderBy: { usageDate: 'desc' },
      take: 30,
    });

    const totalTokens = records.reduce((sum, r) => sum + r.tokensUsed, 0);
    const totalQueries = records.reduce((sum, r) => sum + r.queryCount, 0);
    const estimatedCostUsd = (totalTokens / 1_000_000) * 2.5;

    return { totalTokens, totalQueries, estimatedCostUsd, daily: records };
  }
}
