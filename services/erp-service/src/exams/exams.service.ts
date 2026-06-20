import { ForbiddenException, Injectable } from '@nestjs/common';
import { ParentLinkStatus } from '@eduai/database';
import { PrismaService } from '../prisma/prisma.service';
import type { UserContext } from '../common/decorators';

@Injectable()
export class ExamsService {
  constructor(private readonly prisma: PrismaService) {}

  async listExams(user: UserContext, classId?: string) {
    return this.prisma.exam.findMany({
      where: {
        tenantId: user.tenantId,
        ...(classId ? { classId } : {}),
      },
      include: {
        class: { select: { id: true, name: true, section: true } },
        _count: { select: { results: true } },
      },
      orderBy: { examDate: 'desc' },
    });
  }

  async getStudentResults(user: UserContext, studentId: string) {
    await this.assertCanView(user, studentId);
    const results = await this.prisma.examResult.findMany({
      where: { tenantId: user.tenantId, studentId },
      include: {
        exam: {
          select: {
            id: true,
            title: true,
            subject: true,
            examDate: true,
            maxMarks: true,
          },
        },
      },
      orderBy: { exam: { examDate: 'desc' } },
    });

    return results.map((r) => ({
      resultId: r.id,
      marksObtained: r.marksObtained.toNumber(),
      grade: r.grade,
      remarks: r.remarks,
      exam: {
        ...r.exam,
        maxMarks: r.exam.maxMarks.toNumber(),
      },
    }));
  }

  private async assertCanView(user: UserContext, studentId: string) {
    if (user.sub === studentId) return;
    if (user.permissions.includes('assessments:read:class')) return;
    if (user.permissions.includes('assessments:read:linked')) {
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
    throw new ForbiddenException('Cannot view exam results');
  }
}
