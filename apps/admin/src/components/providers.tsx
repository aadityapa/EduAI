'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Toaster, TooltipProvider } from '@eduai/ui';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <TooltipProvider>
          {children}
          <Toaster richColors closeButton position="top-right" />
        </TooltipProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
