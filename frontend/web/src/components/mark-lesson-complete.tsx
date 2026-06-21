'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@eduai/ui';
import { updateLessonProgressAction } from '@/lib/learning-actions';

interface MarkLessonCompleteButtonProps {
  lessonId: string;
  completed?: boolean;
  label?: string;
}

export function MarkLessonCompleteButton({
  lessonId,
  completed = false,
  label = 'Mark as complete',
}: MarkLessonCompleteButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(completed);

  if (done) {
    return (
      <Button variant="secondary" disabled>
        Completed
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        disabled={pending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            try {
              await updateLessonProgressAction(lessonId, { status: 'completed' });
              setDone(true);
              router.refresh();
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Could not update progress');
            }
          });
        }}
      >
        {pending ? 'Saving…' : label}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
