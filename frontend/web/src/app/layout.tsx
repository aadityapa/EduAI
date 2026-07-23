import type { Metadata } from 'next';
import { Inter, Noto_Sans_Devanagari, Plus_Jakarta_Sans } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { SentryInit } from '@/components/sentry-init';
import '@eduai/ui/globals.css';

/**
 * Typography (Phase 1):
 * - Inter — UI body / chrome (CLS-safe via next/font; replaces blocking Google CSS @import)
 * - Plus Jakarta Sans — display / learner-friendly surfaces (`font-display` / `font-learner`)
 * - Noto Sans Devanagari — Hindi / Marathi coverage
 * Stitch reference faces (Google Sans Flex / Roboto) are documented in the design system;
 * next/font does not ship Google Sans Flex, so Inter + Plus Jakarta are the shipping stack.
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const display = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-noto-devanagari',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'EduAI — Learn Smarter',
  description: 'AI-powered digital learning for Classes 1–10',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${display.variable} ${notoDevanagari.variable} font-sans antialiased`}
      >
        <SentryInit app="web" />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          themes={['light', 'dark', 'high-contrast']}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
