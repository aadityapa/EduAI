import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { UserContext } from '../common/decorators';
import type { UpdateBrandingDto } from './dto/branding.dto';

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
        primaryColor: '#1A73E8',
        secondaryColor: '#9334E6',
        accentColor: '#f59e0b',
        fontFamily: 'Inter',
      };
    }
    return branding;
  }

  async updateBranding(user: UserContext, data: UpdateBrandingDto) {
    const payload = {
      ...(data.primaryColor !== undefined ? { primaryColor: data.primaryColor } : {}),
      ...(data.secondaryColor !== undefined ? { secondaryColor: data.secondaryColor } : {}),
      ...(data.accentColor !== undefined ? { accentColor: data.accentColor } : {}),
      ...(data.fontFamily !== undefined ? { fontFamily: data.fontFamily } : {}),
      ...(data.logoUrl !== undefined ? { logoUrl: data.logoUrl } : {}),
      ...(data.faviconUrl !== undefined ? { faviconUrl: data.faviconUrl } : {}),
    };

    const branding = await this.prisma.tenantBranding.upsert({
      where: { tenantId: user.tenantId },
      create: {
        tenantId: user.tenantId,
        ...payload,
      },
      update: payload,
    });

    await this.prisma.auditLog.create({
      data: {
        tenantId: user.tenantId,
        actorId: user.sub,
        action: 'tenants:configure:own',
        resourceType: 'tenant_branding',
        resourceId: branding.id,
        metadata: payload,
      },
    });

    return branding;
  }
}
