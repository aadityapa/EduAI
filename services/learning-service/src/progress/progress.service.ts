import { Injectable, NotFoundException } from '@nestjs/common';
import { LessonProgressStatus } from '@eduai/database';
import { PrismaService } from '../prisma/prisma.service';
import type { UserContext } from '../common/decorators';
import type { UpdateLessonProgressDto } from './dto/progress.dto';
import { GamificationService } from '../gamification/gamification.service';

@Injectable()
export class ProgressService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gamificationService: GamificationService,
  ) {}

  async getMyProgress(user: UserContext) {
    const records = await this.prisma.lessonProgress.findMany({
      where: {
        tenantId: user.tenantId,
        userId: user.sub,
      },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            type: true,
            durationMinutes: true,
            chapter: {
              select: {
                id: true,
                name: true,
                subject: { select: { id: true, name: true, code: true } },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const summary = {
      total: records.length,
      completed: records.filter((r) => r.status === LessonProgressStatus.completed).length,
      inProgress: records.filter((r) => r.status === LessonProgressStatus.in_progress).length,
      totalTimeSpentSeconds: records.reduce((sum, r) => sum + r.timeSpentSeconds, 0),
    };

    return {
      summary,
      lessons: records.map((record) => ({
        id: record.id,
        lessonId: record.lessonId,
        status: record.status,
        score: record.score ? Number(record.score) : null,
        timeSpentSeconds: record.timeSpentSeconds,
        startedAt: record.startedAt,
        completedAt: record.completedAt,
        lesson: record.lesson,
      })),
    };
  }

  async updateLessonProgress(
    user: UserContext,
    lessonId: string,
    dto: UpdateLessonProgressDto,
  ) {
    const lesson = await this.prisma.lesson.findFirst({
      where: { id: lessonId, deletedAt: null },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const existing = await this.prisma.lessonProgress.findUnique({
      where: {
        tenantId_userId_lessonId: {
          tenantId: user.tenantId,
          userId: user.sub,
          lessonId,
        },
      },
    });

    const now = new Date();
    const nextStatus = dto.status ?? existing?.status ?? LessonProgressStatus.not_started;
    const wasCompleted = existing?.status === LessonProgressStatus.completed;
    const isCompleting =
      nextStatus === LessonProgressStatus.completed && !wasCompleted;

    const timeSpentSeconds =
      dto.timeSpent !== undefined
        ? dto.timeSpent
        : (existing?.timeSpentSeconds ?? 0);

    const data = {
      status: nextStatus,
      timeSpentSeconds,
      startedAt:
        nextStatus !== LessonProgressStatus.not_started
          ? (existing?.startedAt ?? now)
          : existing?.startedAt,
      completedAt:
        nextStatus === LessonProgressStatus.completed
          ? (existing?.completedAt ?? now)
          : existing?.completedAt,
    };

    const record = existing
      ? await this.prisma.lessonProgress.update({
          where: { id: existing.id },
          data,
        })
      : await this.prisma.lessonProgress.create({
          data: {
            tenantId: user.tenantId,
            userId: user.sub,
            lessonId,
            ...data,
          },
        });

    if (isCompleting) {
      await this.gamificationService.awardLessonComplete(user.tenantId, user.sub, lessonId);
    }

    return {
      id: record.id,
      lessonId: record.lessonId,
      status: record.status,
      timeSpentSeconds: record.timeSpentSeconds,
      startedAt: record.startedAt,
      completedAt: record.completedAt,
    };
  }

  async getStudentProgress(tenantId: string, studentId: string) {
    const records = await this.prisma.lessonProgress.findMany({
      where: { tenantId, userId: studentId },
      include: {
        lesson: { select: { id: true, title: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return {
      total: records.length,
      completed: records.filter((r) => r.status === LessonProgressStatus.completed).length,
      lessons: records.map((r) => ({
        lessonId: r.lessonId,
        title: r.lesson.title,
        status: r.status,
        timeSpentSeconds: r.timeSpentSeconds,
        completedAt: r.completedAt,
      })),
    };
  }
}
