'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast, Button } from '@eduai/ui';
import { enrollCourseAction } from '@/lib/learning-actions';

interface EnrollButtonProps {
  courseId: string;
  label?: string;
  alreadyEnrolled?: boolean;
}

export function EnrollButton({
  courseId,
  label = 'Enroll',
  alreadyEnrolled = false,
}: EnrollButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [enrolled, setEnrolled] = useState(alreadyEnrolled);

  if (enrolled) {
    return (
      <Button variant="secondary" disabled className="w-full sm:w-auto">
        Enrolled
      </Button>
    );
  }

  return (
    <Button
      className="w-full sm:w-auto"
      disabled={pending}
      loading={pending}
      onClick={() => {
        startTransition(async () => {
          try {
            await enrollCourseAction(courseId);
            setEnrolled(true);
            toast.success('Enrolled successfully');
            router.refresh();
          } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Enrollment failed');
          }
        });
      }}
    >
      {pending ? 'Enrolling…' : label}
    </Button>
  );
}
