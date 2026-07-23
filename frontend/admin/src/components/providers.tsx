'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Toaster, TooltipProvider } from '@eduai/ui';
import { AdminLocaleProvider } from '@/components/admin-locale-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <AdminLocaleProvider>
          <TooltipProvider>
            {children}
            <Toaster richColors closeButton position="top-right" />
          </TooltipProvider>
        </AdminLocaleProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
