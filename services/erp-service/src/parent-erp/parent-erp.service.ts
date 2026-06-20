import { ForbiddenException, Injectable } from '@nestjs/common';
import { ParentLinkStatus } from '@eduai/database';
import { PrismaService } from '../prisma/prisma.service';
import { AttendanceService } from '../attendance/attendance.service';
import { FeesService } from '../fees/fees.service';
import { ExamsService } from '../exams/exams.service';
import { AssignmentsService } from '../assignments/assignments.service';
import type { UserContext } from '../common/decorators';

@Injectable()
export class ParentErpService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly attendanceService: AttendanceService,
    private readonly feesService: FeesService,
    private readonly examsService: ExamsService,
    private readonly assignmentsService: AssignmentsService,
  ) {}

  async getChildDashboard(user: UserContext, studentId: string) {
    await this.assertLinked(user, studentId);

    const [attendance, fees, exams, homework, notifications] = await Promise.all([
      this.attendanceService.getStudentAttendance(user, studentId),
      this.feesService.getStudentFees(user, studentId),
      this.examsService.getStudentResults(user, studentId),
      this.assignmentsService.getStudentHomework(user, studentId),
      this.prisma.notification.findMany({
        where: { tenantId: user.tenantId, userId: user.sub },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    return { studentId, attendance, fees, exams, homework, notifications };
  }

  private async assertLinked(user: UserContext, studentId: string) {
    const link = await this.prisma.parentStudentLink.findFirst({
      where: {
        tenantId: user.tenantId,
        parentId: user.sub,
        studentId,
        status: ParentLinkStatus.verified,
        deletedAt: null,
      },
    });
    if (!link) throw new ForbiddenException('Not linked to this student');
  }
}
