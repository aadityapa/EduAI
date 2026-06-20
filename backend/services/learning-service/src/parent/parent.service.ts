import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ParentLinkStatus } from '@eduai/database';
import { PrismaService } from '../prisma/prisma.service';
import type { UserContext } from '../common/decorators';
import type { LinkParentDto } from './dto/parent.dto';
import { ProgressService } from '../progress/progress.service';
import { QuizzesService } from '../quizzes/quizzes.service';

@Injectable()
export class ParentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly progressService: ProgressService,
    private readonly quizzesService: QuizzesService,
  ) {}

  async getChildren(user: UserContext) {
    const links = await this.prisma.parentStudentLink.findMany({
      where: {
        tenantId: user.tenantId,
        parentId: user.sub,
        deletedAt: null,
        status: ParentLinkStatus.verified,
      },
      include: {
        student: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            classLevel: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return links.map((link) => ({
      linkId: link.id,
      relationship: link.relationship,
      status: link.status,
      student: link.student,
    }));
  }

  async linkChild(user: UserContext, dto: LinkParentDto) {
    const student = await this.prisma.user.findFirst({
      where: {
        tenantId: user.tenantId,
        email: dto.studentEmail.toLowerCase(),
        deletedAt: null,
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found with that email');
    }

    if (student.id === user.sub) {
      throw new ConflictException('Cannot link yourself as a child');
    }

    const existing = await this.prisma.parentStudentLink.findFirst({
      where: {
        tenantId: user.tenantId,
        parentId: user.sub,
        studentId: student.id,
        deletedAt: null,
      },
    });

    if (existing) {
      return {
        linkId: existing.id,
        status: existing.status,
        student: {
          id: student.id,
          email: student.email,
          firstName: student.firstName,
          lastName: student.lastName,
        },
      };
    }

    const link = await this.prisma.parentStudentLink.create({
      data: {
        tenantId: user.tenantId,
        parentId: user.sub,
        studentId: student.id,
        relationship: dto.relationship ?? 'parent',
        status: ParentLinkStatus.pending,
      },
    });

    return {
      linkId: link.id,
      status: link.status,
      student: {
        id: student.id,
        email: student.email,
        firstName: student.firstName,
        lastName: student.lastName,
      },
    };
  }

  async getChildReport(user: UserContext, studentId: string) {
    await this.assertLinkedParent(user, studentId);

    const student = await this.prisma.user.findFirst({
      where: {
        id: studentId,
        tenantId: user.tenantId,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        classLevel: true,
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const [progress, quizzes, enrollments] = await Promise.all([
      this.progressService.getStudentProgress(user.tenantId, studentId),
      this.quizzesService.getStudentQuizSummary(user.tenantId, studentId),
      this.prisma.courseEnrollment.findMany({
        where: {
          tenantId: user.tenantId,
          userId: studentId,
          status: 'active',
        },
        include: {
          course: { select: { id: true, title: true, classLevel: true } },
        },
      }),
    ]);

    const xp = await this.prisma.userXp.findUnique({ where: { userId: studentId } });
    const streak = await this.prisma.userStreak.findUnique({ where: { userId: studentId } });

    return {
      student,
      enrollments: enrollments.map((e) => ({
        courseId: e.courseId,
        title: e.course.title,
        classLevel: e.course.classLevel,
        enrolledAt: e.enrolledAt,
      })),
      progress,
      quizzes,
      gamification: {
        totalXp: xp?.totalXp ?? 0,
        currentLevel: xp?.currentLevel ?? 1,
        currentStreak: streak?.currentStreak ?? 0,
        longestStreak: streak?.longestStreak ?? 0,
      },
    };
  }

  private async assertLinkedParent(user: UserContext, studentId: string) {
    const link = await this.prisma.parentStudentLink.findFirst({
      where: {
        tenantId: user.tenantId,
        parentId: user.sub,
        studentId,
        deletedAt: null,
        status: ParentLinkStatus.verified,
      },
    });

    if (!link) {
      throw new ForbiddenException('Not linked to this student');
    }
  }
}
