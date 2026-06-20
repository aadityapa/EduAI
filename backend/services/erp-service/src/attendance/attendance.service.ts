import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ParentLinkStatus } from '@eduai/database';
import { PrismaService } from '../prisma/prisma.service';
import type { UserContext } from '../common/decorators';
import type { MarkAttendanceDto } from './dto/attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async markAttendance(user: UserContext, dto: MarkAttendanceDto) {
    const cls = await this.prisma.academicClass.findFirst({
      where: { id: dto.classId, tenantId: user.tenantId },
    });
    if (!cls) throw new NotFoundException('Class not found');

    const date = new Date(dto.date);
    const records = await Promise.all(
      dto.entries.map((entry) =>
        this.prisma.attendanceRecord.upsert({
          where: {
            tenantId_classId_studentId_date: {
              tenantId: user.tenantId,
              classId: dto.classId,
              studentId: entry.studentId,
              date,
            },
          },
          create: {
            tenantId: user.tenantId,
            classId: dto.classId,
            studentId: entry.studentId,
            date,
            status: entry.status,
            markedById: user.sub,
            notes: entry.notes,
          },
          update: {
            status: entry.status,
            markedById: user.sub,
            notes: entry.notes,
          },
        }),
      ),
    );

    await this.prisma.logActivity(user.tenantId, user.sub, 'attendance.mark', 'class', dto.classId, {
      date: dto.date,
      count: records.length,
    });

    return { classId: dto.classId, date: dto.date, records };
  }

  async getClassAttendance(user: UserContext, classId: string, date?: string) {
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const records = await this.prisma.attendanceRecord.findMany({
      where: {
        tenantId: user.tenantId,
        classId,
        date: targetDate,
      },
      include: {
        student: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { student: { firstName: 'asc' } },
    });

    return { classId, date: targetDate.toISOString().slice(0, 10), records };
  }

  async getStudentAttendance(user: UserContext, studentId: string, from?: string, to?: string) {
    await this.assertCanViewStudent(user, studentId);

    const where: Record<string, unknown> = {
      tenantId: user.tenantId,
      studentId,
    };
    if (from || to) {
      where.date = {};
      if (from) (where.date as Record<string, Date>).gte = new Date(from);
      if (to) (where.date as Record<string, Date>).lte = new Date(to);
    }

    const records = await this.prisma.attendanceRecord.findMany({
      where,
      include: { class: { select: { id: true, name: true, section: true } } },
      orderBy: { date: 'desc' },
      take: 90,
    });

    const summary = {
      present: records.filter((r) => r.status === 'present').length,
      absent: records.filter((r) => r.status === 'absent').length,
      late: records.filter((r) => r.status === 'late').length,
      excused: records.filter((r) => r.status === 'excused').length,
      total: records.length,
    };

    return { studentId, summary, records };
  }

  private async assertCanViewStudent(user: UserContext, studentId: string) {
    if (user.sub === studentId) return;
    if (user.permissions.includes('attendance:read:school')) return;

    if (user.permissions.includes('attendance:read:linked')) {
      const link = await this.prisma.parentStudentLink.findFirst({
        where: {
          tenantId: user.tenantId,
          parentId: user.sub,
          studentId,
          status: ParentLinkStatus.verified,
          deletedAt: null,
        },
      });
      if (link) return;
    }

    throw new ForbiddenException('Cannot view this student attendance');
  }
}
