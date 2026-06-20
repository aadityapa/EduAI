import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { UserContext } from '../common/decorators';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTenantSubscription(user: UserContext) {
    const sub = await this.prisma.tenantSubscription.findFirst({
      where: { tenantId: user.tenantId },
      include: { plan: true },
      orderBy: { createdAt: 'desc' },
    });
    if (!sub) throw new NotFoundException('No subscription found');
    return sub;
  }

  async listAllSubscriptions(user: UserContext) {
    const isGlobal = user.permissions.includes('tenants:manage:global');
    return this.prisma.tenantSubscription.findMany({
      where: isGlobal ? undefined : { tenantId: user.tenantId },
      include: {
        plan: true,
        tenant: { select: { id: true, slug: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
