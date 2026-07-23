import type { Metadata } from 'next';
import { Inter, Noto_Sans_Devanagari, Plus_Jakarta_Sans } from 'next/font/google';
import { SentryInit } from '@/components/sentry-init';
import '@eduai/ui/globals.css';

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
  title: 'EduAI Admin',
  description: 'Platform and tenant administration',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${display.variable} ${notoDevanagari.variable} font-sans antialiased`}
      >
        <SentryInit />
        {children}
      </body>
    </html>
  );
}
