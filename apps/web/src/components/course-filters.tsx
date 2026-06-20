'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input, Label } from '@eduai/ui';

export function CourseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <form
      className="glass-card flex flex-wrap items-end gap-4 rounded-xl p-4"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const params = new URLSearchParams();
        const classLevel = form.get('classLevel')?.toString().trim();
        if (classLevel) params.set('classLevel', classLevel);
        router.push(`/student/courses${params.toString() ? `?${params}` : ''}`);
      }}
    >
      <div className="space-y-1.5">
        <Label htmlFor="classLevel">Class level</Label>
        <Input
          id="classLevel"
          name="classLevel"
          type="number"
          min={1}
          max={12}
          placeholder="e.g. 8"
          defaultValue={searchParams.get('classLevel') ?? ''}
          className="w-32"
        />
      </div>
      <Button type="submit">Apply filters</Button>
      {searchParams.toString() && (
        <Button type="button" variant="outline" onClick={() => router.push('/student/courses')}>
          Clear
        </Button>
      )}
    </form>
  );
}
