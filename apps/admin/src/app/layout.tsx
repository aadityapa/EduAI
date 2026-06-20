import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@eduai/ui/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'EduAI Admin',
  description: 'Platform and tenant administration',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
