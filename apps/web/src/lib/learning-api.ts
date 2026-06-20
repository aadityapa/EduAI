import { auth } from '@/auth';
import type { ApiResponse } from '@eduai/shared';

const BASE_URL = process.env.NEXT_PUBLIC_LEARNING_SERVICE_URL ?? 'http://localhost:3003';

export class LearningApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'LearningApiError';
  }
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  classLevel: number;
  thumbnailUrl: string | null;
  status: string;
  sortOrder: number;
  board: { id: string; code: string; name: string };
  subject: { id: string; code: string; name: string; iconUrl: string | null };
}

export interface CourseLesson {
  id: string;
  title: string;
  type: string;
  durationMinutes: number | null;
  sortOrder: number;
  status: string;
}

export interface CourseLessons {
  courseId: string;
  chapters: Array<{
    id: string;
    name: string;
    chapterNumber: number;
    description: string | null;
    lessons: CourseLesson[];
  }>;
}

export interface Enrollment {
  id: string;
  courseId: string;
  userId: string;
  status: string;
  enrolledAt: string;
  course: Course & { classLevel?: number; thumbnailUrl?: string | null };
}

export interface ProgressSummary {
  total: number;
  completed: number;
  inProgress: number;
  totalTimeSpentSeconds: number;
}

export interface LessonProgressRecord {
  id: string;
  lessonId: string;
  status: string;
  score: number | null;
  timeSpentSeconds: number;
  startedAt: string | null;
  completedAt: string | null;
  lesson: {
    id: string;
    title: string;
    type: string;
    durationMinutes: number | null;
    chapter: {
      id: string;
      name: string;
      subject: { id: string; name: string; code: string };
    };
  };
}

export interface MyProgress {
  summary: ProgressSummary;
  lessons: LessonProgressRecord[];
}

export interface HubLesson {
  id: string;
  title: string;
  type: string;
  durationMinutes: number | null;
  sortOrder: number;
  progress: { status: string; timeSpentSeconds: number };
}

export interface LearningHub {
  filters: {
    boardId: string | null;
    classLevel: number | null;
    subjectId: string | null;
    chapterId: string | null;
  };
  boards: Array<{
    id: string;
    code: string;
    name: string;
    subjects: Array<{
      id: string;
      code: string;
      name: string;
      classLevel: number;
      iconUrl: string | null;
      courses: Array<{ id: string; title: string; thumbnailUrl: string | null }>;
      chapters: Array<{
        id: string;
        name: string;
        chapterNumber: number;
        description: string | null;
        lessons: HubLesson[];
      }>;
    }>;
  }>;
}

export interface QuizOption {
  id: string;
  label: string;
  sortOrder: number;
}

export interface QuizQuestionData {
  id: string;
  type: 'mcq' | 'multi_select' | 'true_false' | 'fill_blank';
  stem: string;
  marks: number;
  sortOrder: number;
  options: QuizOption[];
}

export interface Quiz {
  id: string;
  title: string;
  timeLimitMinutes: number | null;
  passingScore: number;
  lessonId: string | null;
  questions: QuizQuestionData[];
}

export interface QuizAttemptStart {
  attemptId: string;
  quizId: string;
  status: string;
  startedAt: string;
}

export interface QuizSubmitResult {
  attemptId: string;
  quizId: string;
  score: number;
  passed: boolean;
  status: string;
  submittedAt: string | null;
  evaluation: {
    totalMarks: number;
    earnedMarks: number;
    scorePercent: number;
    passed: boolean;
    questions: Array<{
      questionId: string;
      type: string;
      marks: number;
      earnedMarks: number;
      isCorrect: boolean;
    }>;
  };
}

export interface GamificationProfile {
  xp: { totalXp: number; currentLevel: number };
  coins: { balance: number };
  badges: Array<{
    id: string;
    earnedAt: string;
    badge: {
      id: string;
      code: string;
      name: string;
      description: string | null;
      iconUrl: string | null;
      category: string | null;
    };
  }>;
  streak: {
    currentStreak: number;
    longestStreak: number;
    lastActivityDate: string | null;
    freezeTokens: number;
  };
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  totalXp: number;
  currentLevel: number;
  user: {
    id: string;
    firstName: string;
    lastName: string | null;
    avatarUrl: string | null;
  };
}

export interface ParentChildLink {
  linkId: string;
  relationship: string;
  status: string;
  student: {
    id: string;
    email: string;
    firstName: string;
    lastName: string | null;
    classLevel: number | null;
    avatarUrl: string | null;
  };
}

export interface ChildReport {
  student: {
    id: string;
    email: string;
    firstName: string;
    lastName: string | null;
    classLevel: number | null;
  };
  enrollments: Array<{
    courseId: string;
    title: string;
    classLevel: number;
    enrolledAt: string;
  }>;
  progress: MyProgress;
  quizzes: Array<{
    attemptId: string;
    quizId: string;
    quizTitle: string;
    score: number | null;
    passed: boolean;
    submittedAt: string | null;
  }>;
  gamification: {
    totalXp: number;
    currentLevel: number;
    currentStreak: number;
    longestStreak: number;
  };
}

export interface ListCoursesQuery {
  boardId?: string;
  classLevel?: number;
  subjectId?: string;
}

export interface HubQuery {
  boardId?: string;
  classLevel?: number;
  subjectId?: string;
  chapterId?: string;
}

async function fetchWithToken<T>(accessToken: string, path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}/api/v1${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...init?.headers,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = (await res.json()) as { error?: { message?: string } };
      message = body.error?.message ?? message;
    } catch {
      // ignore parse errors
    }
    throw new LearningApiError(res.status, message);
  }

  const json = (await res.json()) as ApiResponse<T>;
  return json.data;
}

async function fetchAuthenticated<T>(path: string, init?: RequestInit): Promise<T> {
  const session = await auth();
  const accessToken = session?.user?.accessToken;
  if (!accessToken) {
    throw new LearningApiError(401, 'Not authenticated');
  }
  return fetchWithToken(accessToken, path, init);
}

function buildQuery(params?: Record<string, string | number | undefined>): string {
  if (!params) return '';
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export async function getCourses(query?: ListCoursesQuery): Promise<Course[]> {
  return fetchAuthenticated(`/courses${buildQuery(query as Record<string, string | number | undefined>)}`);
}

export async function getCourse(id: string): Promise<Course> {
  return fetchAuthenticated(`/courses/${id}`);
}

export async function getCourseLessons(id: string): Promise<CourseLessons> {
  return fetchAuthenticated(`/courses/${id}/lessons`);
}

export async function enrollCourse(id: string): Promise<Enrollment> {
  return fetchAuthenticated(`/courses/${id}/enroll`, { method: 'POST' });
}

export async function getMyEnrollments(): Promise<Enrollment[]> {
  return fetchAuthenticated('/enrollments/me');
}

export async function getMyProgress(): Promise<MyProgress> {
  return fetchAuthenticated('/progress/me');
}

export async function updateLessonProgress(
  lessonId: string,
  body: { status?: string; timeSpent?: number },
): Promise<LessonProgressRecord> {
  return fetchAuthenticated(`/progress/lessons/${lessonId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function getHub(query?: HubQuery): Promise<LearningHub> {
  return fetchAuthenticated(`/hub${buildQuery(query as Record<string, string | number | undefined>)}`);
}

export async function getQuiz(id: string): Promise<Quiz> {
  return fetchAuthenticated(`/quizzes/${id}`);
}

export async function startQuizAttempt(id: string): Promise<QuizAttemptStart> {
  return fetchAuthenticated(`/quizzes/${id}/attempts`, { method: 'POST' });
}

export async function submitQuizAttempt(
  attemptId: string,
  body: { answers: Record<string, unknown>; timeSpent?: number },
): Promise<QuizSubmitResult> {
  return fetchAuthenticated(`/quizzes/attempts/${attemptId}/submit`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getGamification(): Promise<GamificationProfile> {
  return fetchAuthenticated('/gamification/me');
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  return fetchAuthenticated('/gamification/leaderboard');
}

export async function getParentChildren(): Promise<ParentChildLink[]> {
  return fetchAuthenticated('/parent/children');
}

export async function linkParentChild(body: {
  studentEmail: string;
  relationship?: string;
}): Promise<{ linkId: string; status: string; student: ParentChildLink['student'] }> {
  return fetchAuthenticated('/parent/link', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getChildReport(studentId: string): Promise<ChildReport> {
  return fetchAuthenticated(`/parent/children/${studentId}/report`);
}

export function findLessonInHub(hub: LearningHub, lessonId: string) {
  for (const board of hub.boards) {
    for (const subject of board.subjects) {
      for (const chapter of subject.chapters) {
        const lesson = chapter.lessons.find((item) => item.id === lessonId);
        if (lesson) {
          return { board, subject, chapter, lesson };
        }
      }
    }
  }
  return null;
}
