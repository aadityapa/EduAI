'use client';

import { cn } from '../lib/utils';
import type { ReactNode } from 'react';
import { Bot, MessageSquarePlus } from 'lucide-react';
import { ScrollArea } from '../components/scroll-area';

const DEFAULT_HISTORY = [
  { id: '1', title: 'Algebra help — quadratic equations' },
  { id: '2', title: 'Chemistry: periodic table review' },
  { id: '3', title: 'Essay outline for History' },
];

const SUBJECT_TUTORS = ['Mathematics', 'Science', 'English', 'History'];

export function StitchTutorShell({
  children,
  onNewChat,
  className,
}: {
  children: ReactNode;
  onNewChat?: () => void;
  className?: string;
}) {
  return (
    <div className={cn('flex h-[calc(100vh-4rem)] overflow-hidden rounded-xl border bg-card', className)}>
      <aside className="hidden w-64 flex-col border-r bg-background p-4 md:flex">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#9334E6] text-white shadow-[0_0_20px_rgba(134,33,217,0.15)]">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold">Learning Hub</p>
            <p className="text-xs text-muted-foreground">AI Tutor Online</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onNewChat}
          className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-3 text-sm font-bold text-primary transition hover:bg-primary/15"
        >
          <MessageSquarePlus className="h-4 w-4" />
          New Chat
        </button>
        <ScrollArea className="flex-1">
          <p className="mb-2 px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Recent History
          </p>
          <ul className="space-y-1">
            {DEFAULT_HISTORY.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
          <p className="mb-2 mt-4 px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Subject Tutors
          </p>
          <ul className="space-y-1">
            {SUBJECT_TUTORS.map((subject) => (
              <li key={subject}>
                <button
                  type="button"
                  className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition hover:bg-muted"
                >
                  {subject}
                </button>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
