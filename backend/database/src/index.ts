import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
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

export async function disconnectDb(): Promise<void> {
  await prisma.$disconnect();
}
