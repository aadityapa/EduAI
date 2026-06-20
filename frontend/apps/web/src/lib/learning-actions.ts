'use server';

import { revalidatePath } from 'next/cache';
import {
  enrollCourse,
  linkParentChild,
  startQuizAttempt,
  submitQuizAttempt,
  updateLessonProgress,
} from '@/lib/learning-api';

export async function enrollCourseAction(courseId: string) {
  const result = await enrollCourse(courseId);
  revalidatePath('/student/courses');
  revalidatePath(`/student/courses/${courseId}`);
  revalidatePath('/student/dashboard');
  return result;
}

export async function updateLessonProgressAction(
  lessonId: string,
  body: { status?: string; timeSpent?: number },
) {
  const result = await updateLessonProgress(lessonId, body);
  revalidatePath(`/student/lessons/${lessonId}`);
  revalidatePath('/student/dashboard');
  revalidatePath('/student/hub');
  return result;
}

export async function startQuizAttemptAction(quizId: string) {
  return startQuizAttempt(quizId);
}

export async function submitQuizAttemptAction(
  attemptId: string,
  body: { answers: Record<string, unknown>; timeSpent?: number },
) {
  const result = await submitQuizAttempt(attemptId, body);
  revalidatePath('/student/gamification');
  revalidatePath('/student/dashboard');
  return result;
}

export async function linkParentChildAction(body: {
  studentEmail: string;
  relationship?: string;
}) {
  const result = await linkParentChild(body);
  revalidatePath('/parent/dashboard');
  return result;
}
