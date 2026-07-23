import { Injectable, NotFoundException } from '@nestjs/common';
import { ContentStatus } from '@eduai/database';
import {
  CurriculumCacheKeys,
  CURRICULUM_CACHE_TTL_SEC,
  getCurriculumCache,
} from '@eduai/nest-common';
import { PrismaService } from '../prisma/prisma.service';
import type { UserContext } from '../common/decorators';
import type { ListCoursesQuery } from './dto/courses.dto';

@Injectable()
export class CoursesService {
  private readonly cache = getCurriculumCache();

  constructor(private readonly prisma: PrismaService) {}

  async listCatalog(user: UserContext, query: ListCoursesQuery) {
    const cacheKey = CurriculumCacheKeys.catalog(user.tenantId, {
      boardId: query.boardId,
      classLevel: query.classLevel,
      subjectId: query.subjectId,
    });
    const cached = await this.cache.get<ReturnType<CoursesService['mapCourse']>[]>(cacheKey);
    if (cached) return cached;

    const courses = await this.prisma.course.findMany({
      where: {
        tenantId: user.tenantId,
        deletedAt: null,
        status: ContentStatus.published,
        ...(query.boardId && { boardId: query.boardId }),
        ...(query.classLevel !== undefined && { classLevel: query.classLevel }),
        ...(query.subjectId && { subjectId: query.subjectId }),
      },
      include: {
        board: { select: { id: true, code: true, name: true } },
        subject: { select: { id: true, code: true, name: true, iconUrl: true } },
      },
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
    });

    const mapped = courses.map((course) => this.mapCourse(course));
    await this.cache.set(cacheKey, mapped, CURRICULUM_CACHE_TTL_SEC);
    return mapped;
  }

  async getById(user: UserContext, courseId: string) {
    const cacheKey = CurriculumCacheKeys.course(user.tenantId, courseId);
    const cached = await this.cache.get<ReturnType<CoursesService['mapCourse']>>(cacheKey);
    if (cached) return cached;

    const course = await this.prisma.course.findFirst({
      where: {
        id: courseId,
        tenantId: user.tenantId,
        deletedAt: null,
        status: ContentStatus.published,
      },
      include: {
        board: { select: { id: true, code: true, name: true } },
        subject: { select: { id: true, code: true, name: true, iconUrl: true } },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const mapped = this.mapCourse(course);
    await this.cache.set(cacheKey, mapped, CURRICULUM_CACHE_TTL_SEC);
    return mapped;
  }

  async getLessons(user: UserContext, courseId: string) {
    const cacheKey = CurriculumCacheKeys.courseLessons(user.tenantId, courseId);
    const cached = await this.cache.get<{
      courseId: string;
      chapters: Array<{
        id: string;
        name: string;
        chapterNumber: number;
        description: string | null;
        lessons: unknown[];
      }>;
    }>(cacheKey);
    if (cached) return cached;

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

    const chapters = await this.prisma.chapter.findMany({
      where: {
        subjectId: course.subjectId,
        deletedAt: null,
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
            status: true,
          },
        },
      },
    });

    const payload = {
      courseId: course.id,
      chapters: chapters.map((chapter) => ({
        id: chapter.id,
        name: chapter.name,
        chapterNumber: chapter.chapterNumber,
        description: chapter.description,
        lessons: chapter.lessons,
      })),
    };
    await this.cache.set(cacheKey, payload, CURRICULUM_CACHE_TTL_SEC);
    return payload;
  }

  private mapCourse(course: {
    id: string;
    title: string;
    description: string | null;
    classLevel: number;
    thumbnailUrl: string | null;
    status: ContentStatus;
    sortOrder: number;
    boardId: string;
    subjectId: string;
    board: { id: string; code: string; name: string };
    subject: { id: string; code: string; name: string; iconUrl: string | null };
  }) {
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      classLevel: course.classLevel,
      thumbnailUrl: course.thumbnailUrl,
      status: course.status,
      sortOrder: course.sortOrder,
      board: course.board,
      subject: course.subject,
    };
  }
}
