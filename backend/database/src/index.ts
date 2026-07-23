import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaRead: PrismaClient | undefined;
};

function createClient(datasourceUrl?: string): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    ...(datasourceUrl ? { datasources: { db: { url: datasourceUrl } } } : {}),
  });
}

export const prisma =
  globalForPrisma.prisma ?? createClient(process.env.DATABASE_URL);

/**
 * Read-replica client when DATABASE_READ_URL is set; otherwise primary.
 * Use for analytics / catalog reads that tolerate replication lag.
 * See backend/docs/operations/connection-pooling.md
 */
export const prismaRead =
  globalForPrisma.prismaRead ??
  createClient(process.env.DATABASE_READ_URL || process.env.DATABASE_URL);

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaRead = prismaRead;
}

export * from '@prisma/client';
export { prisma as db };

/** Set tenant context for RLS-ready queries (application-level for now) */
export async function withTenantContext<T>(
  tenantId: string,
  fn: (client: PrismaClient) => Promise<T>,
): Promise<T> {
  return fn(prisma);
}

/** Prefer read replica for heavy SELECT-only workloads when configured. */
export async function withReadReplica<T>(
  fn: (client: PrismaClient) => Promise<T>,
): Promise<T> {
  return fn(prismaRead);
}

export function isReadReplicaConfigured(): boolean {
  return Boolean(process.env.DATABASE_READ_URL);
}

export async function disconnectDb(): Promise<void> {
  await Promise.all([prisma.$disconnect(), prismaRead.$disconnect()]);
}
