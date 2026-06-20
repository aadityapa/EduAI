import { NotFoundException } from '@nestjs/common';
import { LessonProgressStatus } from '@eduai/database';
import type { RoleCode } from '@eduai/shared';
import { ProgressService } from './progress.service';

describe('ProgressService', () => {
  const user = {
    sub: 'user-1',
    email: 'student@test.com',
    tenantId: 'tenant-1',
    roles: ['student'] as RoleCode[],
    permissions: ['progress:read:own'],
  };

  let prisma: {
    lesson: { findFirst: jest.Mock };
    lessonProgress: {
      findUnique: jest.Mock;
      findMany: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
  };

  let gamificationService: { awardLessonComplete: jest.Mock };
  let service: ProgressService;

  beforeEach(() => {
    prisma = {
      lesson: {
        findFirst: jest.fn().mockResolvedValue({ id: 'lesson-1' }),
      },
      lessonProgress: {
        findUnique: jest.fn().mockResolvedValue(null),
        findMany: jest.fn().mockResolvedValue([]),
        create: jest.fn().mockResolvedValue({
          id: 'progress-1',
          lessonId: 'lesson-1',
          status: LessonProgressStatus.completed,
          timeSpentSeconds: 120,
          startedAt: new Date(),
          completedAt: new Date(),
        }),
        update: jest.fn(),
      },
    };

    gamificationService = {
      awardLessonComplete: jest.fn().mockResolvedValue({ xpAwarded: 10 }),
    };

    service = new ProgressService(prisma as never, gamificationService as never);
  });

  it('returns progress summary for user', async () => {
    prisma.lessonProgress.findMany.mockResolvedValue([
      {
        id: 'p1',
        lessonId: 'lesson-1',
        status: LessonProgressStatus.completed,
        score: null,
        timeSpentSeconds: 60,
        startedAt: new Date(),
        completedAt: new Date(),
        lesson: {
          id: 'lesson-1',
          title: 'Intro',
          type: 'video',
          durationMinutes: 10,
          chapter: {
            id: 'ch-1',
            name: 'Chapter 1',
            subject: { id: 'sub-1', name: 'Math', code: 'MATH' },
          },
        },
      },
    ]);

    const result = await service.getMyProgress(user);
    expect(result.summary.total).toBe(1);
    expect(result.summary.completed).toBe(1);
    expect(result.lessons).toHaveLength(1);
  });

  it('creates progress and awards gamification on completion', async () => {
    const result = await service.updateLessonProgress(user, 'lesson-1', {
      status: LessonProgressStatus.completed,
      timeSpent: 120,
    });

    expect(prisma.lessonProgress.create).toHaveBeenCalled();
    expect(gamificationService.awardLessonComplete).toHaveBeenCalledWith(
      user.tenantId,
      user.sub,
      'lesson-1',
    );
    expect(result.status).toBe(LessonProgressStatus.completed);
  });

  it('throws when lesson does not exist', async () => {
    prisma.lesson.findFirst.mockResolvedValue(null);

    await expect(
      service.updateLessonProgress(user, 'missing', {
        status: LessonProgressStatus.in_progress,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('does not re-award when lesson already completed', async () => {
    prisma.lessonProgress.findUnique.mockResolvedValue({
      id: 'progress-1',
      status: LessonProgressStatus.completed,
      timeSpentSeconds: 100,
      startedAt: new Date(),
      completedAt: new Date(),
    });
    prisma.lessonProgress.update.mockResolvedValue({
      id: 'progress-1',
      lessonId: 'lesson-1',
      status: LessonProgressStatus.completed,
      timeSpentSeconds: 150,
      startedAt: new Date(),
      completedAt: new Date(),
    });

    await service.updateLessonProgress(user, 'lesson-1', {
      status: LessonProgressStatus.completed,
      timeSpent: 150,
    });

    expect(gamificationService.awardLessonComplete).not.toHaveBeenCalled();
  });
});
