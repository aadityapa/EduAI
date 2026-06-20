'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button, Avatar, AvatarFallback, LanguageSwitcher, cn } from '@eduai/ui';
import { useSession } from 'next-auth/react';
import { LocaleProvider, localeOptions, useLocale } from '@/components/locale-provider';

interface DashboardShellProps {
  title: string;
  portal: string;
  children: React.ReactNode;
}

const studentNav = [
  { href: '/student/dashboard', key: 'dashboard' as const },
  { href: '/student/courses', key: 'courses' as const },
  { href: '/student/hub', key: 'hub' as const },
  { href: '/student/ai/tutor', key: 'aiTutor' as const },
  { href: '/student/ai/homework', key: 'aiHomework' as const },
  { href: '/student/ai/planner', key: 'aiPlanner' as const },
  { href: '/student/gamification', key: 'gamification' as const },
];

function DashboardShellInner({ title, portal, children }: DashboardShellProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { locale, setLocale, t } = useLocale();

  const initials = session?.user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const navLabels: Record<(typeof studentNav)[number]['key'], string> = {
    dashboard: t('common.nav.dashboard'),
    courses: t('common.nav.courses'),
    hub: t('common.nav.hub'),
    aiTutor: t('ai.nav.tutor'),
    aiHomework: t('ai.nav.homework'),
    aiPlanner: t('ai.nav.planner'),
    gamification: t('gamification.title'),
  };

  return (
    <div className="portal-background min-h-screen">
      <header className="glass-card sticky top-0 z-10 mx-4 mt-4 rounded-xl px-6 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{portal}</p>
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <LanguageSwitcher
              value={locale}
              onChange={(value) => setLocale(value as typeof locale)}
              locales={localeOptions()}
              label={t('common.language')}
              className="w-36"
              showIcon
            />
            <Avatar>
              <AvatarFallback>{initials ?? 'U'}</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: '/login' })}>
              {t('common.nav.logout')}
            </Button>
          </div>
        </div>

        {portal === 'student' && (
          <nav className="mt-4 flex flex-wrap gap-2 border-t border-border/50 pt-4">
            {studentNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  {navLabels[item.key]}
                </Link>
              );
            })}
          </nav>
        )}
      </header>
      <main className="mx-auto max-w-6xl p-6">{children}</main>
      <footer className="pb-6 text-center text-xs text-muted-foreground">
        <Link href="/login">EduAI</Link> · Sprint 3 AI Platform
      </footer>
    </div>
  );
}

export function DashboardShell(props: DashboardShellProps) {
  return (
    <LocaleProvider>
      <DashboardShellInner {...props} />
    </LocaleProvider>
  );
}
