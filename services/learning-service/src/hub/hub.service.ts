import { Injectable } from '@nestjs/common';
import { ContentStatus } from '@eduai/database';
import { PrismaService } from '../prisma/prisma.service';
import type { UserContext } from '../common/decorators';
import type { HubQuery } from './dto/hub.dto';

@Injectable()
export class HubService {
  constructor(private readonly prisma: PrismaService) {}

  async getLearningHub(user: UserContext, query: HubQuery) {
    const boards = await this.prisma.board.findMany({
      where: query.boardId ? { id: query.boardId } : undefined,
      orderBy: { name: 'asc' },
      include: {
        subjects: {
          where: {
            ...(query.classLevel !== undefined && { classLevel: query.classLevel }),
            ...(query.subjectId && { id: query.subjectId }),
          },
          orderBy: { sortOrder: 'asc' },
          include: {
            chapters: {
              where: {
                deletedAt: null,
                ...(query.chapterId && { id: query.chapterId }),
              },
              orderBy: [{ sortOrder: 'asc' }, { chapterNumber: 'asc' }],
              include: {
                lessons: {
                  where: {
                    deletedAt: null,
                    status: ContentStatus.published,
                  },
                  orderBy: { sortOrder: 'asc' },
                  select: {
                    id: true,
                    title: true,
                    type: true,
                    durationMinutes: true,
                    sortOrder: true,
                  },
                },
              },
            },
            courses: {
              where: {
                tenantId: user.tenantId,
                deletedAt: null,
                status: ContentStatus.published,
              },
              select: {
                id: true,
                title: true,
                thumbnailUrl: true,
              },
            },
          },
        },
      },
    });

    const lessonIds = boards.flatMap((board) =>
      board.subjects.flatMap((subject) =>
        subject.chapters.flatMap((chapter) => chapter.lessons.map((l) => l.id)),
      ),
    );

    const progressMap = new Map<string, { status: string; timeSpentSeconds: number }>();
    if (lessonIds.length > 0) {
      const progressRecords = await this.prisma.lessonProgress.findMany({
        where: {
          tenantId: user.tenantId,
          userId: user.sub,
          lessonId: { in: lessonIds },
        },
        select: {
          lessonId: true,
          status: true,
          timeSpentSeconds: true,
        },
      });
      for (const record of progressRecords) {
        progressMap.set(record.lessonId, {
          status: record.status,
          timeSpentSeconds: record.timeSpentSeconds,
        });
      }
    }

    return {
      filters: {
        boardId: query.boardId ?? null,
        classLevel: query.classLevel ?? null,
        subjectId: query.subjectId ?? null,
        chapterId: query.chapterId ?? null,
      },
      boards: boards.map((board) => ({
        id: board.id,
        code: board.code,
        name: board.name,
        subjects: board.subjects.map((subject) => ({
          id: subject.id,
          code: subject.code,
          name: subject.name,
          classLevel: subject.classLevel,
          iconUrl: subject.iconUrl,
          courses: subject.courses,
          chapters: subject.chapters.map((chapter) => ({
            id: chapter.id,
            name: chapter.name,
            chapterNumber: chapter.chapterNumber,
            description: chapter.description,
            lessons: chapter.lessons.map((lesson) => ({
              ...lesson,
              progress: progressMap.get(lesson.id) ?? {
                status: 'not_started',
                timeSpentSeconds: 0,
              },
            })),
          })),
        })),
      })),
    };
  }
}
