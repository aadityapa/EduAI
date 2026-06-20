import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { UserContext } from '../common/decorators';

@Injectable()
export class BrandingService {
  constructor(private readonly prisma: PrismaService) {}

  async getBranding(user: UserContext) {
    const branding = await this.prisma.tenantBranding.findUnique({
      where: { tenantId: user.tenantId },
    });
    if (!branding) {
      return {
        tenantId: user.tenantId,
        primaryColor: '#6366f1',
        secondaryColor: '#8b5cf6',
        accentColor: '#f59e0b',
        fontFamily: 'Inter',
      };
    }
    return branding;
  }

  async updateBranding(user: UserContext, data: Record<string, unknown>) {
    return this.prisma.tenantBranding.upsert({
      where: { tenantId: user.tenantId },
      create: {
        tenantId: user.tenantId,
        ...(data as object),
      },
      update: data as object,
    });
  }
}
