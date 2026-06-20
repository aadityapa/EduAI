import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { JwtClaims } from '@eduai/shared';
import { resolveJwtSecret } from '@eduai/shared';
import type { UserContext } from '../common/decorators';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: resolveJwtSecret(config.get<string>('JWT_SECRET')),
    });
  }

  validate(payload: JwtClaims): UserContext {
    if (!payload.sub || !payload.tenant_id) {
      throw new UnauthorizedException('Invalid token claims');
    }
    return {
      sub: payload.sub,
      email: payload.email,
      tenantId: payload.tenant_id,
      schoolId: payload.school_id,
      roles: payload.roles ?? [],
      permissions: payload.permissions ?? [],
    };
  }
}
