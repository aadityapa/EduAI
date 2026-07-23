import { ForbiddenException, NotFoundException } from '@nestjs/common';

/**
 * Enforce that a resource belongs to the caller's tenant.
 * Prefer NotFound for cross-tenant reads to avoid leaking existence.
 */
export function assertSameTenant(
  resourceTenantId: string | null | undefined,
  actorTenantId: string,
  options?: { leakExistence?: boolean; message?: string },
): void {
  if (!resourceTenantId || resourceTenantId !== actorTenantId) {
    if (options?.leakExistence) {
      throw new ForbiddenException(options.message ?? 'Cross-tenant access denied');
    }
    throw new NotFoundException(options?.message ?? 'Resource not found');
  }
}

/** Build a Prisma-friendly where clause always scoped to tenant. */
export function tenantWhere<T extends Record<string, unknown>>(
  tenantId: string,
  extra: T = {} as T,
): T & { tenantId: string } {
  return { ...extra, tenantId };
}
