import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { UserContext } from '../common/decorators';

@Injectable()
export class ClassesService {
  constructor(private readonly prisma: PrismaService) {}

  async listClasses(user: UserContext) {
    return this.prisma.academicClass.findMany({
      where: { tenantId: user.tenantId, status: 'active' },
      include: {
        school: { select: { id: true, name: true, code: true } },
        _count: { select: { enrollments: true } },
      },
      orderBy: [{ classLevel: 'asc' }, { section: 'asc' }],
    });
  }

  async getClass(user: UserContext, classId: string) {
    const cls = await this.prisma.academicClass.findFirst({
      where: { id: classId, tenantId: user.tenantId },
      include: {
        school: { select: { id: true, name: true } },
        enrollments: {
          where: { status: 'active' },
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                classLevel: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });
    if (!cls) throw new NotFoundException('Class not found');
    return cls;
  }

  async getTeacherClasses(user: UserContext) {
    return this.prisma.academicClass.findMany({
      where: {
        tenantId: user.tenantId,
        OR: [{ teacherId: user.sub }],
        status: 'active',
      },
      include: {
        _count: { select: { enrollments: true, assignments: true } },
        enrollments: {
          where: { status: 'active' },
          include: {
            student: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
      },
    });
  }
}
