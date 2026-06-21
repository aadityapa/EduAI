'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster, TooltipProvider } from '@eduai/ui';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TooltipProvider>
        {children}
        <Toaster richColors closeButton position="top-right" />
      </TooltipProvider>
    </SessionProvider>
  );
}
