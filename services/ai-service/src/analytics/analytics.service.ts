import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { UserContext } from '../common/decorators';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

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

    return {
      tenantId: user.tenantId,
      userId: targetUserId ?? (canViewTenant && !targetUserId ? undefined : userId),
      monthlyTokenBudget: tenant?.aiMonthlyTokenBudget ?? 0,
      totals,
      daily: usageRecords.map((r) => ({
        date: r.usageDate.toISOString().split('T')[0],
        queryCount: r.queryCount,
        tokensUsed: r.tokensUsed,
      })),
    };
  }
}
