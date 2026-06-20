import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { UserContext } from '../common/decorators';

@Injectable()
export class CrmService {
  constructor(private readonly prisma: PrismaService) {}

  async listLeads() {
    return this.prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
  }

  async listTickets(user: UserContext) {
    return this.prisma.supportTicket.findMany({
      where: { tenantId: user.tenantId },
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async listCampaigns() {
    return this.prisma.marketingCampaign.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
  }

  async listActivityLogs(user: UserContext) {
    return this.prisma.activityLog.findMany({
      where: { tenantId: user.tenantId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async listAuditLogs(user: UserContext) {
    return this.prisma.auditLog.findMany({
      where: { tenantId: user.tenantId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
