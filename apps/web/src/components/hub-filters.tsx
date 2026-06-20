'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input, Label } from '@eduai/ui';

export function HubFilters({ boards }: { boards: Array<{ id: string; name: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <form
      className="glass-card grid gap-4 rounded-xl p-4 md:grid-cols-2 lg:grid-cols-4"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const params = new URLSearchParams();
        for (const key of ['boardId', 'classLevel', 'subjectId', 'chapterId']) {
          const value = form.get(key)?.toString().trim();
          if (value) params.set(key, value);
        }
        router.push(`/student/hub${params.toString() ? `?${params}` : ''}`);
      }}
    >
      <div className="space-y-1.5">
        <Label htmlFor="boardId">Board</Label>
        <select
          id="boardId"
          name="boardId"
          defaultValue={searchParams.get('boardId') ?? ''}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">All boards</option>
          {boards.map((board) => (
            <option key={board.id} value={board.id}>
              {board.name}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="classLevel">Class</Label>
        <Input
          id="classLevel"
          name="classLevel"
          type="number"
          min={1}
          max={12}
          placeholder="Class"
          defaultValue={searchParams.get('classLevel') ?? ''}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="subjectId">Subject ID</Label>
        <Input
          id="subjectId"
          name="subjectId"
          placeholder="Subject UUID"
          defaultValue={searchParams.get('subjectId') ?? ''}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="chapterId">Chapter ID</Label>
        <Input
          id="chapterId"
          name="chapterId"
          placeholder="Chapter UUID"
          defaultValue={searchParams.get('chapterId') ?? ''}
        />
      </div>
      <div className="flex flex-wrap gap-2 md:col-span-2 lg:col-span-4">
        <Button type="submit">Apply filters</Button>
        {searchParams.toString() && (
          <Button type="button" variant="outline" onClick={() => router.push('/student/hub')}>
            Clear
          </Button>
        )}
      </div>
    </form>
  );
}
