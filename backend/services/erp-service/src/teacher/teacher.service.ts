import { Injectable } from '@nestjs/common';
import { AssignmentStatus } from '@eduai/database';
import { PrismaService } from '../prisma/prisma.service';
import type { UserContext } from '../common/decorators';

@Injectable()
export class TeacherService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(user: UserContext) {
    const [classes, assignments, pendingGrading] = await Promise.all([
      this.prisma.academicClass.findMany({
        where: { tenantId: user.tenantId, teacherId: user.sub, status: 'active' },
        include: { _count: { select: { enrollments: true } } },
      }),
      this.prisma.assignment.count({
        where: {
          tenantId: user.tenantId,
          teacherId: user.sub,
          status: AssignmentStatus.published,
          dueDate: { gte: new Date() },
        },
      }),
      this.prisma.quizAttempt.count({
        where: {
          tenantId: user.tenantId,
          status: 'submitted',
        },
      }),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const classIds = classes.map((c) => c.id);
    const todayAttendance = classIds.length
      ? await this.prisma.attendanceRecord.count({
          where: { tenantId: user.tenantId, classId: { in: classIds }, date: today },
        })
      : 0;

    return {
      classCount: classes.length,
      classes: classes.map((c) => ({
        id: c.id,
        name: c.name,
        section: c.section,
        classLevel: c.classLevel,
        studentCount: c._count.enrollments,
      })),
      activeAssignments: assignments,
      pendingGrading,
      todayAttendanceMarked: todayAttendance,
    };
  }
}
