import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@eduai/database';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /** Set PostgreSQL session variable for RLS tenant isolation */
  async withTenantContext<T>(tenantId: string, fn: () => Promise<T>): Promise<T> {
    await this.$executeRawUnsafe(`SELECT set_config('app.tenant_id', '${tenantId}', true)`);
    try {
      return await fn();
    } finally {
      await this.$executeRawUnsafe(`SELECT set_config('app.tenant_id', '', true)`);
    }
  }

  async logActivity(
    tenantId: string,
    userId: string | null,
    action: string,
    resourceType?: string,
    resourceId?: string,
    metadata?: Record<string, unknown>,
  ) {
    await this.activityLog.create({
      data: {
        tenantId,
        userId,
        action,
        resourceType,
        resourceId,
        metadata: (metadata ?? {}) as Prisma.InputJsonValue,
      },
    });
  }
}
