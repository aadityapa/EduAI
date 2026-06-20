'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import {
  Button,
  Avatar,
  AvatarFallback,
  LanguageSwitcher,
  cn,
  ScrollArea,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@eduai/ui';
import { LocaleProvider, localeOptions, useLocale } from '@/components/locale-provider';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Flame,
  GraduationCap,
  Home,
  LayoutDashboard,
  LogOut,
  Moon,
  Sparkles,
  Sun,
  Trophy,
} from 'lucide-react';

interface DashboardShellProps {
  title: string;
  portal: string;
  children: React.ReactNode;
}

const studentNav = [
  { href: '/student/dashboard', key: 'dashboard' as const, icon: LayoutDashboard },
  { href: '/student/courses', key: 'courses' as const, icon: BookOpen },
  { href: '/student/hub', key: 'hub' as const, icon: Home },
  { href: '/student/ai/tutor', key: 'aiTutor' as const, icon: Sparkles },
  { href: '/student/ai/homework', key: 'aiHomework' as const, icon: GraduationCap },
  { href: '/student/ai/planner', key: 'aiPlanner' as const, icon: Flame },
  { href: '/student/gamification', key: 'gamification' as const, icon: Trophy },
];

const teacherNav = [
  { href: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/teacher/classes', label: 'Classes', icon: BookOpen },
  { href: '/teacher/attendance', label: 'Attendance', icon: GraduationCap },
  { href: '/teacher/assignments', label: 'Assignments', icon: Home },
  { href: '/teacher/quizzes/builder', label: 'Quiz Builder', icon: Sparkles },
  { href: '/teacher/ai/generator', label: 'AI Generator', icon: Flame },
  { href: '/teacher/reports', label: 'Reports', icon: Trophy },
];

const parentNav = [
  { href: '/parent/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/parent/fees', label: 'Fees', icon: BookOpen },
  { href: '/parent/notifications', label: 'Notifications', icon: Home },
  { href: '/parent/ai/tutor', label: 'AI Assistant', icon: Sparkles },
];

function DashboardShellInner({ title, portal, children }: DashboardShellProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { locale, setLocale, t } = useLocale();
  const { theme, setTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

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

  const navItems =
    portal === 'student'
      ? studentNav.map((item) => ({ href: item.href, label: navLabels[item.key], icon: item.icon }))
      : portal === 'teacher'
        ? teacherNav
        : parentNav;

  const renderNavLink = (item: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }) => {
    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
    const Icon = item.icon;

    const link = (
      <Link
        href={item.href}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
          active
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          collapsed && 'justify-center px-2',
        )}
        aria-current={active ? 'page' : undefined}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip key={item.href}>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side="right">{item.label}</TooltipContent>
        </Tooltip>
      );
    }

    return <div key={item.href}>{link}</div>;
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="portal-background flex min-h-screen">
        <motion.aside
          initial={false}
          animate={{ width: collapsed ? 72 : 240 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-y-0 left-0 z-30 flex flex-col border-r border-sidebar-border bg-sidebar"
        >
          <div className={cn('flex h-16 items-center border-b border-sidebar-border px-4', collapsed && 'justify-center')}>
            {!collapsed ? (
              <Link href={`/${portal}/dashboard`} className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">EduAI</p>
                  <p className="text-[10px] capitalize text-muted-foreground">{portal} Portal</p>
                </div>
              </Link>
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
            )}
          </div>

          <ScrollArea className="flex-1 px-3 py-4">
            <div className="space-y-0.5">{navItems.map(renderNavLink)}</div>
          </ScrollArea>

          <div className="border-t border-sidebar-border p-3">
            <Button
              variant="ghost"
              size={collapsed ? 'icon' : 'sm'}
              className={cn('w-full', !collapsed && 'justify-start')}
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <><ChevronLeft className="mr-2 h-4 w-4" /> Collapse</>}
            </Button>
          </div>
        </motion.aside>

        <div className={cn('flex flex-1 flex-col transition-all duration-200', collapsed ? 'ml-[72px]' : 'ml-[240px]')}>
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{portal}</p>
              <h1 className="text-lg font-semibold">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher
                value={locale}
                onChange={(value) => setLocale(value as typeof locale)}
                locales={localeOptions()}
                label={t('common.language')}
                className="hidden w-36 sm:flex"
                showIcon
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
              <Separator orientation="vertical" className="mx-1 h-6" />
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">{initials ?? 'U'}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: '/login' })}>
                <LogOut className="mr-2 h-4 w-4 hidden sm:inline" />
                {t('common.nav.logout')}
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="mx-auto max-w-6xl"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>

          <footer className="border-t py-4 text-center text-xs text-muted-foreground">
            <Link href="/login">EduAI</Link> · AI-Powered Learning Platform
          </footer>
        </div>
      </div>
    </TooltipProvider>
  );
}

export function DashboardShell(props: DashboardShellProps) {
  return (
    <LocaleProvider>
      <DashboardShellInner {...props} />
    </LocaleProvider>
  );
}
