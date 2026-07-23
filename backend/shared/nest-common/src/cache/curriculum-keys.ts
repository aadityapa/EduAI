/** Curriculum cache key helpers + TTLs (aggressive reads, explicit invalidation). */

export const CURRICULUM_CACHE_TTL_SEC = Number(process.env.CURRICULUM_CACHE_TTL_SEC ?? 300);
export const QUIZ_CACHE_TTL_SEC = Number(process.env.QUIZ_CACHE_TTL_SEC ?? 300);

export const CurriculumCacheKeys = {
  catalog(tenantId: string, filters: Record<string, string | number | undefined | null>): string {
    const parts = Object.entries(filters)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('&');
    return `catalog:${tenantId}:${parts || 'all'}`;
  },

  course(tenantId: string, courseId: string): string {
    return `course:${tenantId}:${courseId}`;
  },

  courseLessons(tenantId: string, courseId: string): string {
    return `course-lessons:${tenantId}:${courseId}`;
  },

  hubTree(
    tenantId: string,
    filters: {
      boardId?: string;
      classLevel?: number;
      subjectId?: string;
      chapterId?: string;
    },
  ): string {
    return CurriculumCacheKeys.catalog(tenantId, {
      boardId: filters.boardId,
      classLevel: filters.classLevel,
      subjectId: filters.subjectId,
      chapterId: filters.chapterId,
      kind: 'hub',
    }).replace('catalog:', 'hub:');
  },

  quiz(quizId: string): string {
    return `quiz:${quizId}`;
  },

  tenantPrefix(tenantId: string): string {
    return `:${tenantId}:`;
  },
};

export type CurriculumInvalidationTarget =
  | { type: 'tenant'; tenantId: string }
  | { type: 'course'; tenantId: string; courseId: string }
  | { type: 'quiz'; quizId: string };
