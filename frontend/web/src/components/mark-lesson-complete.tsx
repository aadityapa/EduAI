'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast, Button } from '@eduai/ui';
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
  const [done, setDone] = useState(completed);

  if (done) {
    return (
      <Button variant="secondary" disabled>
        Completed
      </Button>
    );
  }

  return (
    <Button
      disabled={pending}
      loading={pending}
      onClick={() => {
        startTransition(async () => {
          try {
            await updateLessonProgressAction(lessonId, { status: 'completed' });
            setDone(true);
            toast.success('Lesson completed — XP unlocked!');
            router.refresh();
          } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Could not update progress');
          }
        });
      }}
    >
      {pending ? 'Saving…' : label}
    </Button>
  );
}
