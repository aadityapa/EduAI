'use client';

import { useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Button, cn } from '@eduai/ui';

interface LessonFocusToggleProps {
  children: React.ReactNode;
}

/** Optional focus mode — expands lesson content and dims chrome distractions. */
export function LessonFocusToggle({ children }: LessonFocusToggleProps) {
  const [focus, setFocus] = useState(false);

  return (
    <div
      className={cn(
        'relative space-y-4 motion-safe:transition-all',
        focus && 'rounded-2xl bg-background p-4 shadow-lg ring-1 ring-border md:p-6',
      )}
    >
      <div className="flex justify-end">
        <Button
          type="button"
          variant={focus ? 'secondary' : 'outline'}
          size="sm"
          className="rounded-full"
          onClick={() => setFocus((v) => !v)}
          aria-pressed={focus}
        >
          {focus ? (
            <>
              <Minimize2 className="me-2 h-4 w-4" aria-hidden="true" />
              Exit focus
            </>
          ) : (
            <>
              <Maximize2 className="me-2 h-4 w-4" aria-hidden="true" />
              Focus mode
            </>
          )}
        </Button>
      </div>
      {children}
    </div>
  );
}
