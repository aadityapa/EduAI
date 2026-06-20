import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@eduai/database';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async withTenantContext<T>(tenantId: string, fn: () => Promise<T>): Promise<T> {
    await this.$executeRawUnsafe(`SELECT set_config('app.tenant_id', '${tenantId}', true)`);
    try {
      return await fn();
    } finally {
      await this.$executeRawUnsafe(`SELECT set_config('app.tenant_id', '', true)`);
    }
  }
}
