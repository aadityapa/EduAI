import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import type { RoleCode } from '@eduai/shared';

export interface UserContext {
  sub: string;
  email: string;
  tenantId: string;
  schoolId?: string;
  roles: RoleCode[];
  permissions: string[];
}

export const PERMISSIONS_KEY = 'permissions';
export const ANY_PERMISSIONS_KEY = 'anyPermissions';

export const RequirePermission = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

export const RequireAnyPermission = (...permissions: string[]) =>
  SetMetadata(ANY_PERMISSIONS_KEY, permissions);

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserContext => {
    const request = ctx.switchToHttp().getRequest<{ user: UserContext }>();
    return request.user;
  },
);

export const Public = () => SetMetadata('isPublic', true);

export const INTERNAL_KEY = 'isInternal';

export const Internal = () => SetMetadata(INTERNAL_KEY, true);
