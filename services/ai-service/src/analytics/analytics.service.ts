import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CostService } from '../cost/cost.service';
import type { UserContext } from '../common/decorators';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly costService: CostService,
  ) {}

  async getUsage(user: UserContext, targetUserId?: string) {
    const canViewTenant =
      user.permissions.includes('ai:quota:manage:tenant') ||
      user.permissions.includes('analytics:read:tenant');

    let userId = user.sub;

    if (targetUserId && targetUserId !== user.sub) {
      if (!canViewTenant) {
        throw new ForbiddenException('Cannot view other user usage');
      }
      userId = targetUserId;
    }

    const tenantFilter = canViewTenant && !targetUserId ? {} : { userId };

    const usageRecords = await this.prisma.aiQuotaUsage.findMany({
      where: {
        tenantId: user.tenantId,
        ...tenantFilter,
      },
      orderBy: { usageDate: 'desc' },
      take: 30,
    });

    const totals = usageRecords.reduce(
      (acc, r) => ({
        queryCount: acc.queryCount + r.queryCount,
        tokensUsed: acc.tokensUsed + r.tokensUsed,
      }),
      { queryCount: 0, tokensUsed: 0 },
    );

    const tenant = await this.prisma.tenant.findUnique({
      where: { id: user.tenantId },
      select: { aiMonthlyTokenBudget: true },
    });

    const costSummary = await this.costService.getTenantCostSummary(user.tenantId);

    const conversationCounts = await this.prisma.aiConversation.groupBy({
      by: ['type'],
      where: { tenantId: user.tenantId, ...tenantFilter },
      _count: { id: true },
    });

    const featureUsage = conversationCounts.map((c) => ({
      feature: c.type,
      count: c._count.id,
    }));

    return {
      tenantId: user.tenantId,
      userId: targetUserId ?? (canViewTenant && !targetUserId ? undefined : userId),
      monthlyTokenBudget: tenant?.aiMonthlyTokenBudget ?? 0,
      totals,
      estimatedCostUsd: costSummary.estimatedCostUsd,
      featureUsage,
      daily: usageRecords.map((r) => ({
        date: r.usageDate.toISOString().split('T')[0],
        queryCount: r.queryCount,
        tokensUsed: r.tokensUsed,
        estimatedCostUsd: (r.tokensUsed / 1_000_000) * 2.5,
      })),
    };
  }

  async getTenantDashboard(user: UserContext) {
    const canView =
      user.permissions.includes('ai:quota:manage:tenant') ||
      user.permissions.includes('analytics:read:tenant');
    if (!canView) {
      throw new ForbiddenException('Admin access required');
    }

    const perUser = await this.prisma.aiQuotaUsage.groupBy({
      by: ['userId'],
      where: { tenantId: user.tenantId },
      _sum: { tokensUsed: true, queryCount: true },
      orderBy: { _sum: { tokensUsed: 'desc' } },
      take: 20,
    });

    const costSummary = await this.costService.getTenantCostSummary(user.tenantId);

    return {
      tenantId: user.tenantId,
      totalTokens: costSummary.totalTokens,
      totalQueries: costSummary.totalQueries,
      estimatedCostUsd: costSummary.estimatedCostUsd,
      topUsers: perUser.map((u) => ({
        userId: u.userId,
        tokensUsed: u._sum.tokensUsed ?? 0,
        queryCount: u._sum.queryCount ?? 0,
        estimatedCostUsd: ((u._sum.tokensUsed ?? 0) / 1_000_000) * 2.5,
      })),
      featureUsage: await this.prisma.aiConversation.groupBy({
        by: ['type'],
        where: { tenantId: user.tenantId },
        _count: { id: true },
      }),
    };
  }
}
