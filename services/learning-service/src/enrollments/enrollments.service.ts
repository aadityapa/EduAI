import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContentStatus } from '@eduai/database';
import { PrismaService } from '../prisma/prisma.service';
import type { UserContext } from '../common/decorators';

@Injectable()
export class EnrollmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async enroll(user: UserContext, courseId: string) {
    const course = await this.prisma.course.findFirst({
      where: {
        id: courseId,
        tenantId: user.tenantId,
        deletedAt: null,
        status: ContentStatus.published,
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const existing = await this.prisma.courseEnrollment.findUnique({
      where: {
        tenantId_courseId_userId: {
          tenantId: user.tenantId,
          courseId,
          userId: user.sub,
        },
      },
    });

    if (existing) {
      if (existing.status === 'active') {
        throw new ConflictException('Already enrolled in this course');
      }
      const updated = await this.prisma.courseEnrollment.update({
        where: { id: existing.id },
        data: { status: 'active', enrolledAt: new Date() },
        include: { course: { select: { id: true, title: true } } },
      });
      return this.mapEnrollment(updated);
    }

    const enrollment = await this.prisma.courseEnrollment.create({
      data: {
        tenantId: user.tenantId,
        courseId,
        userId: user.sub,
        status: 'active',
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            classLevel: true,
            thumbnailUrl: true,
          },
        },
      },
    });

    return this.mapEnrollment(enrollment);
  }

  async getMyEnrollments(user: UserContext) {
    const enrollments = await this.prisma.courseEnrollment.findMany({
      where: {
        tenantId: user.tenantId,
        userId: user.sub,
        status: 'active',
      },
      include: {
        course: {
          include: {
            board: { select: { id: true, code: true, name: true } },
            subject: { select: { id: true, code: true, name: true } },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    return enrollments.map((enrollment) => this.mapEnrollment(enrollment));
  }

  private mapEnrollment(enrollment: {
    id: string;
    courseId: string;
    userId: string;
    status: string;
    enrolledAt: Date;
    course: {
      id: string;
      title: string;
      classLevel?: number;
      thumbnailUrl?: string | null;
      board?: { id: string; code: string; name: string };
      subject?: { id: string; code: string; name: string };
    };
  }) {
    return {
      id: enrollment.id,
      courseId: enrollment.courseId,
      userId: enrollment.userId,
      status: enrollment.status,
      enrolledAt: enrollment.enrolledAt,
      course: enrollment.course,
    };
  }
}
