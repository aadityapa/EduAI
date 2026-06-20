import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { UserContext } from '../common/decorators';
import type { CreateUserDto, ListUsersQuery, UpdateProfileDto } from './dto/users.dto';
import * as bcrypt from 'bcryptjs';
import type { RoleCode } from '@eduai/shared';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.findUserOrThrow(userId);
    return this.toProfile(user);
  }

  async updateMe(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        locale: dto.locale,
        avatarUrl: dto.avatarUrl,
      },
      include: { userRoles: { include: { role: true } } },
    });
    return this.toProfile(user);
  }

  async listUsers(actor: UserContext, query: ListUsersQuery) {
    if (!actor.permissions.includes('users:read:tenant')) {
      throw new ForbiddenException();
    }

    const page = Number(query.page) || 1;
    const pageSize = Math.min(Number(query.page_size) || 20, 100);
    const skip = (page - 1) * pageSize;

    const where = {
      tenantId: actor.tenantId,
      deletedAt: null,
      ...(query.status ? { status: query.status as never } : {}),
      ...(query.role
        ? { userRoles: { some: { role: { code: query.role } } } }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { userRoles: { include: { role: true } } },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      items: items.map((u) => this.toProfile(u)),
      pagination: {
        page,
        page_size: pageSize,
        total_items: total,
        total_pages: Math.ceil(total / pageSize),
        has_next: page * pageSize < total,
        has_prev: page > 1,
      },
    };
  }

  async getUser(actor: UserContext, id: string) {
    const user = await this.findUserOrThrow(id);
    if (user.tenantId !== actor.tenantId) {
      throw new NotFoundException();
    }
    if (actor.sub !== id && !actor.permissions.includes('users:read:tenant')) {
      throw new ForbiddenException();
    }
    return this.toProfile(user);
  }

  async createUser(actor: UserContext, dto: CreateUserDto) {
    if (!actor.permissions.includes('users:create:tenant')) {
      throw new ForbiddenException();
    }

    const role = await this.prisma.role.findFirst({
      where: { tenantId: actor.tenantId, code: dto.role ?? 'student' },
    });
    if (!role) throw new NotFoundException('Role not found');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        tenantId: actor.tenantId,
        schoolId: dto.schoolId,
        email: dto.email.toLowerCase(),
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        status: 'active',
        emailVerifiedAt: new Date(),
        userRoles: { create: { roleId: role.id, tenantId: actor.tenantId, schoolId: dto.schoolId } },
      },
      include: { userRoles: { include: { role: true } } },
    });

    await this.prisma.auditLog.create({
      data: {
        tenantId: actor.tenantId,
        actorId: actor.sub,
        action: 'users:create:tenant',
        resourceType: 'user',
        resourceId: user.id,
      },
    });

    return this.toProfile(user);
  }

  async softDelete(actor: UserContext, id: string) {
    if (!actor.permissions.includes('users:delete:tenant')) {
      throw new ForbiddenException();
    }
    await this.prisma.user.update({
      where: { id, tenantId: actor.tenantId },
      data: { deletedAt: new Date(), status: 'inactive' },
    });
    return { deleted: true };
  }

  private async findUserOrThrow(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: { userRoles: { include: { role: true } } },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  private toProfile(user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string | null;
    phone: string | null;
    tenantId: string;
    schoolId: string | null;
    locale: string;
    classLevel: number | null;
    avatarUrl: string | null;
    status: string;
    createdAt: Date;
    userRoles: Array<{ role: { code: string } }>;
  }) {
    const roles = user.userRoles.map((ur) => ur.role.code as RoleCode);
    return {
      id: user.id,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      phone: user.phone,
      tenant_id: user.tenantId,
      school_id: user.schoolId,
      roles,
      class_level: user.classLevel,
      locale: user.locale,
      avatar_url: user.avatarUrl,
      status: user.status,
      created_at: user.createdAt.toISOString(),
    };
  }
}
