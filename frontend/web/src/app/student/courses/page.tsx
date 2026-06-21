import Link from 'next/link';
import { Suspense } from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import { ApiError } from '@/components/api-error';
import { CourseFilters } from '@/components/course-filters';
import { PageMotion } from '@/components/page-motion';
import { getCourses, getMyEnrollments, LearningApiError } from '@/lib/learning-api';
import { CourseCard, StitchPageHeader } from '@eduai/ui';

interface CoursesPageProps {
  searchParams: Promise<{ classLevel?: string; boardId?: string; subjectId?: string }>;
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (!session.user.roles.includes('student')) redirect('/dashboard');

  const params = await searchParams;
  const classLevel = params.classLevel ? Number(params.classLevel) : undefined;

  let courses = null;
  let enrollments = null;
  let loadError: string | null = null;

  try {
    [courses, enrollments] = await Promise.all([
      getCourses({
        classLevel: Number.isFinite(classLevel) ? classLevel : undefined,
        boardId: params.boardId,
        subjectId: params.subjectId,
      }),
      getMyEnrollments(),
    ]);
  } catch (err) {
    loadError = err instanceof LearningApiError ? err.message : 'Failed to load courses';
  }

  const enrolledIds = new Set(enrollments?.map((e) => e.courseId) ?? []);

  return (
    <DashboardShell title="Courses" portal="student">
      <PageMotion>
        <div className="space-y-6">
          <StitchPageHeader title="Course Catalog" description="Browse and enroll in courses for your class and board." />
          <Suspense fallback={null}>
            <CourseFilters />
          </Suspense>

          {loadError && <ApiError message={loadError} />}

          {!loadError && !courses?.length && (
            <p className="text-sm text-muted-foreground">No courses match your filters.</p>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses?.map((course) => (
              <Link key={course.id} href={`/student/courses/${course.id}`}>
                <CourseCard
                  title={course.title}
                  description={course.description ?? undefined}
                  subject={`${course.subject.name} · Class ${course.classLevel}`}
                  status={enrolledIds.has(course.id) ? 'in_progress' : 'not_started'}
                  imageUrl={course.thumbnailUrl ?? undefined}
                  actionLabel={enrolledIds.has(course.id) ? 'Continue' : 'View'}
                  className="h-full cursor-pointer transition-transform hover:scale-[1.01]"
                />
              </Link>
            ))}
          </div>
        </div>
      </PageMotion>
    </DashboardShell>
  );
}
