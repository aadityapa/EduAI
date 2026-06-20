import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { getPermissionsForRoles } from '@eduai/auth';
import type { JwtClaims, RoleCode } from '@eduai/shared';
import { Prisma } from '@eduai/database';
import type { LoginDto, RegisterDto } from './dto/auth.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto, tenantIdHeader?: string, ip?: string) {
    const tenantId = await this.resolveTenantId(tenantIdHeader);
    const user = await this.prisma.user.findFirst({
      where: {
        tenantId,
        email: dto.email.toLowerCase(),
        deletedAt: null,
      },
      include: {
        userRoles: { include: { role: true } },
      },
    });

    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status === 'suspended') {
      throw new UnauthorizedException('Account suspended');
    }

    const roles = user.userRoles.map((ur) => ur.role.code as RoleCode);
    const permissions = getPermissionsForRoles(roles);
    const tokens = await this.issueTokens(user, roles, permissions);

    const refreshHash = this.hashToken(tokens.refreshToken);
    await this.prisma.userSession.create({
      data: {
        tenantId: user.tenantId,
        userId: user.id,
        refreshTokenHash: refreshHash,
        deviceInfo: (dto.device ?? {}) as Prisma.InputJsonValue,
        ipAddress: ip,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    await this.audit(user.tenantId, user.id, 'auth:login', ip);

    return {
      ...tokens,
      user: { ...this.mapUser(user, roles), permissions },
    };
  }

  async register(dto: RegisterDto, tenantIdHeader?: string, ip?: string) {
    const tenantId = await this.resolveTenantId(tenantIdHeader);
    const email = dto.email.toLowerCase();

    const existing = await this.prisma.user.findFirst({
      where: { tenantId, email, deletedAt: null },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const roleCode = (dto.role ?? 'student') as RoleCode;
    const role = await this.prisma.role.findFirst({
      where: { tenantId, code: roleCode },
    });
    if (!role) {
      throw new NotFoundException(`Role ${roleCode} not found`);
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        tenantId,
        email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        status: 'pending_verification',
        userRoles: {
          create: { roleId: role.id, tenantId },
        },
      },
      include: { userRoles: { include: { role: true } } },
    });

    const roles = user.userRoles.map((ur) => ur.role.code as RoleCode);
    await this.audit(tenantId, user.id, 'auth:register', ip);

    return { user: this.mapUser(user, roles) };
  }

  async refresh(refreshToken: string) {
    const hash = this.hashToken(refreshToken);
    const session = await this.prisma.userSession.findFirst({
      where: { refreshTokenHash: hash, expiresAt: { gt: new Date() } },
      include: {
        user: { include: { userRoles: { include: { role: true } } } },
      },
    });

    if (!session) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = session.user;
    const roles = user.userRoles.map((ur) => ur.role.code as RoleCode);
    const permissions = getPermissionsForRoles(roles);
    const tokens = await this.issueTokens(user, roles, permissions);

    await this.prisma.userSession.update({
      where: { id: session.id },
      data: {
        refreshTokenHash: this.hashToken(tokens.refreshToken),
        lastActiveAt: new Date(),
      },
    });

    return tokens;
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      const hash = this.hashToken(refreshToken);
      await this.prisma.userSession.deleteMany({
        where: { userId, refreshTokenHash: hash },
      });
    }
    return { success: true };
  }

  async logoutAll(userId: string) {
    await this.prisma.userSession.deleteMany({ where: { userId } });
    return { success: true };
  }

  private async issueTokens(
    user: {
      id: string;
      email: string;
      tenantId: string;
      schoolId: string | null;
    },
    roles: RoleCode[],
    permissions: string[],
  ) {
    const payload: JwtClaims = {
      sub: user.id,
      email: user.email,
      tenant_id: user.tenantId,
      school_id: user.schoolId ?? undefined,
      roles,
      permissions,
    };

    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN') ?? '15m',
    });

    const refreshToken = crypto.randomBytes(48).toString('base64url');

    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
      tokenType: 'Bearer' as const,
    };
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private async resolveTenantId(tenantIdHeader?: string): Promise<string> {
    if (tenantIdHeader) {
      const tenant = await this.prisma.tenant.findUnique({
        where: { id: tenantIdHeader },
      });
      if (tenant) return tenant.id;
    }

    const slug = this.config.get('DEFAULT_TENANT_SLUG') ?? 'demo';
    const tenant = await this.prisma.tenant.findFirst({
      where: { slug, deletedAt: null },
    });
    if (!tenant) {
      throw new NotFoundException('Tenant not found. Run db:seed first.');
    }
    return tenant.id;
  }

  private mapUser(
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string | null;
      tenantId: string;
      schoolId: string | null;
      locale: string;
      classLevel: number | null;
      status: string;
    },
    roles: RoleCode[],
  ) {
    return {
      id: user.id,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      tenant_id: user.tenantId,
      school_id: user.schoolId,
      roles,
      class_level: user.classLevel,
      locale: user.locale,
      status: user.status,
    };
  }

  private async audit(tenantId: string, actorId: string, action: string, ip?: string) {
    await this.prisma.auditLog.create({
      data: {
        tenantId,
        actorId,
        action,
        ipAddress: ip,
      },
    });
  }
}
