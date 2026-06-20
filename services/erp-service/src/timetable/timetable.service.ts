import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { UserContext } from '../common/decorators';

@Injectable()
export class TimetableService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyTimetable(user: UserContext) {
    const enrollments = await this.prisma.classEnrollment.findMany({
      where: { tenantId: user.tenantId, studentId: user.sub, status: 'active' },
      select: { classId: true },
    });
    const classIds = enrollments.map((e) => e.classId);

    const teacherClasses = await this.prisma.academicClass.findMany({
      where: { tenantId: user.tenantId, teacherId: user.sub, status: 'active' },
      select: { id: true },
    });
    classIds.push(...teacherClasses.map((c) => c.id));

    const uniqueIds = [...new Set(classIds)];
    if (!uniqueIds.length) return { slots: [] };

    const slots = await this.prisma.timetableSlot.findMany({
      where: { tenantId: user.tenantId, classId: { in: uniqueIds } },
      include: { class: { select: { id: true, name: true, section: true } } },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });

    return { slots };
  }

  async getClassTimetable(user: UserContext, classId: string) {
    const slots = await this.prisma.timetableSlot.findMany({
      where: { tenantId: user.tenantId, classId },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
    return { classId, slots };
  }
}
