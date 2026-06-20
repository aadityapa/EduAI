import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { UserContext } from '../common/decorators';

@Injectable()
export class SchoolsService {
  constructor(private readonly prisma: PrismaService) {}

  async listSchools(user: UserContext) {
    const schools = await this.prisma.school.findMany({
      where: { tenantId: user.tenantId, deletedAt: null },
      include: {
        _count: { select: { users: true, academicClasses: true } },
      },
      orderBy: { name: 'asc' },
      take: 100,
    });

    return Promise.all(
      schools.map(async (school) => {
        const [students, teachers] = await Promise.all([
          this.prisma.user.count({
            where: {
              schoolId: school.id,
              deletedAt: null,
              userRoles: { some: { role: { code: 'student' } } },
            },
          }),
          this.prisma.user.count({
            where: {
              schoolId: school.id,
              deletedAt: null,
              userRoles: { some: { role: { code: 'teacher' } } },
            },
          }),
        ]);

        return {
          id: school.id,
          name: school.name,
          code: school.code,
          address: school.address,
          userCount: school._count.users,
          classCount: school._count.academicClasses,
          students,
          teachers,
        };
      }),
    );
  }
}
