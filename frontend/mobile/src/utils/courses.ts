import { tokens } from '../theme/tokens';

const COURSE_ACCENTS = [tokens.colors.primaryBright, tokens.colors.secondary, tokens.colors.tertiary];
const COURSE_ICONS = ['∑', '⚗', '📜', '📐', '🌍'];

export type CourseCarouselItem = {
  id: string;
  title: string;
  progress: number;
  icon: string;
  accent: string;
};

export function mapEnrollmentsToCourses(enrollments: unknown[]): CourseCarouselItem[] {
  return enrollments.slice(0, 6).map((raw, i) => {
    const e = raw as {
      id?: string;
      course?: { title?: string; subject?: { name?: string } };
      progress?: number;
    };
    const title = e.course?.subject?.name ?? e.course?.title ?? `Course ${i + 1}`;
    return {
      id: e.id ?? String(i),
      title,
      progress: e.progress ?? [85, 42, 90, 60, 30][i % 5],
      icon: COURSE_ICONS[i % COURSE_ICONS.length],
      accent: COURSE_ACCENTS[i % COURSE_ACCENTS.length],
    };
  });
}
