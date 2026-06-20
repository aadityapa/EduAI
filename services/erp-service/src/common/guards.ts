import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { hasAnyPermission, hasPermission } from '@eduai/auth';
import {
  ANY_PERMISSIONS_KEY,
  INTERNAL_KEY,
  PERMISSIONS_KEY,
  UserContext,
} from './decorators';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const isInternal = this.reflector.getAllAndOverride<boolean>(INTERNAL_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isInternal) return true;

    return super.canActivate(context);
  }

  handleRequest<TUser = UserContext>(err: Error | null, user: TUser | false): TUser {
    if (err || !user) {
      throw err ?? new UnauthorizedException('Invalid or missing token');
    }
    return user;
  }
}

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required?.length) return true;

    const request = context.switchToHttp().getRequest<{ user: UserContext }>();
    const user = request.user;
    if (!user) throw new UnauthorizedException();

    if (!hasPermission(user.permissions, required)) {
      throw new ForbiddenException('Insufficient permissions');
    }
    return true;
  }
}

@Injectable()
export class AnyPermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(ANY_PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required?.length) return true;

    const request = context.switchToHttp().getRequest<{ user: UserContext }>();
    const user = request.user;
    if (!user) throw new UnauthorizedException();

    if (!hasAnyPermission(user.permissions, required)) {
      throw new ForbiddenException('Insufficient permissions');
    }
    return true;
  }
}

@Injectable()
export class InternalApiGuard implements CanActivate {
  constructor(
    private config: ConfigService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isInternal = this.reflector.getAllAndOverride<boolean>(INTERNAL_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!isInternal) return true;

    const expectedKey = this.config.get<string>('INTERNAL_API_KEY');
    if (!expectedKey) {
      throw new ForbiddenException('Internal API not configured');
    }

    const request = context.switchToHttp().getRequest<{ headers: Record<string, string> }>();
    const provided = request.headers['x-internal-api-key'];
    if (provided !== expectedKey) {
      throw new ForbiddenException('Invalid internal API key');
    }
    return true;
  }
}
