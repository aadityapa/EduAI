'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@eduai/ui';
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
  const [error, setError] = useState<string | null>(null);
  const [enrolled, setEnrolled] = useState(alreadyEnrolled);

  if (enrolled) {
    return (
      <Button variant="secondary" disabled className="w-full sm:w-auto">
        Enrolled
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        className="w-full sm:w-auto"
        disabled={pending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            try {
              await enrollCourseAction(courseId);
              setEnrolled(true);
              router.refresh();
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Enrollment failed');
            }
          });
        }}
      >
        {pending ? 'Enrolling…' : label}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
