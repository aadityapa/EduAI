'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Label } from '@eduai/ui';
import { linkParentChildAction } from '@/lib/learning-actions';

export function LinkChildForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const studentEmail = form.get('studentEmail')?.toString().trim();
        if (!studentEmail) return;

        setError(null);
        setSuccess(null);
        startTransition(async () => {
          try {
            const result = await linkParentChildAction({ studentEmail });
            setSuccess(
              `Link request ${result.status} for ${result.student.firstName} ${result.student.lastName ?? ''}`.trim(),
            );
            event.currentTarget.reset();
            router.refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not link student');
          }
        });
      }}
    >
      <div className="space-y-1.5">
        <Label htmlFor="studentEmail">Student email</Label>
        <Input
          id="studentEmail"
          name="studentEmail"
          type="email"
          placeholder="student@school.edu"
          required
        />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? 'Linking…' : 'Link child'}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-green-600 dark:text-green-400">{success}</p>}
    </form>
  );
}
