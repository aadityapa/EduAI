import { Injectable, NotFoundException } from '@nestjs/common';
import { ContentStatus } from '@eduai/database';
import { PrismaService } from '../prisma/prisma.service';
import type { UserContext } from '../common/decorators';
import type { ListCoursesQuery } from './dto/courses.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async listCatalog(user: UserContext, query: ListCoursesQuery) {
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

    return courses.map((course) => this.mapCourse(course));
  }

  async getById(user: UserContext, courseId: string) {
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

    return this.mapCourse(course);
  }

  async getLessons(user: UserContext, courseId: string) {
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

    return {
      courseId: course.id,
      chapters: chapters.map((chapter) => ({
        id: chapter.id,
        name: chapter.name,
        chapterNumber: chapter.chapterNumber,
        description: chapter.description,
        lessons: chapter.lessons,
      })),
    };
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
