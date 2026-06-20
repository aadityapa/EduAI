import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface AuditLogEntry {
  tenantId: string;
  userId: string;
  action: string;
  feature: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AuditService {
  private readonly logs: AuditLogEntry[] = [];

  constructor(private readonly prisma: PrismaService) {}

  async log(entry: AuditLogEntry): Promise<void> {
    this.logs.push({ ...entry, metadata: entry.metadata ?? {} });
    if (this.logs.length > 1000) {
      this.logs.shift();
    }
  }

  async getRecentLogs(tenantId: string, limit = 50): Promise<AuditLogEntry[]> {
    return this.logs.filter((l) => l.tenantId === tenantId).slice(-limit);
  }

  async logAiRequest(
    tenantId: string,
    userId: string,
    feature: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.log({
      tenantId,
      userId,
      action: 'ai.request',
      feature,
      metadata,
    });
  }
}
