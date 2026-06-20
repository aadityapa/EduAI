import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { UserContext } from '../common/decorators';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async listMine(user: UserContext, unreadOnly = false) {
    return this.prisma.notification.findMany({
      where: {
        tenantId: user.tenantId,
        userId: user.sub,
        ...(unreadOnly ? { readAt: null } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markRead(user: UserContext, id: string) {
    return this.prisma.notification.updateMany({
      where: { id, tenantId: user.tenantId, userId: user.sub },
      data: { readAt: new Date() },
    });
  }

  async markAllRead(user: UserContext) {
    return this.prisma.notification.updateMany({
      where: { tenantId: user.tenantId, userId: user.sub, readAt: null },
      data: { readAt: new Date() },
    });
  }
}
