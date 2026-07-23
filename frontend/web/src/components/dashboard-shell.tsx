'use client';

import { signOut } from 'next-auth/react';
import { getPortalLoginUrl } from '@eduai/shared';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import {
  Button,
  Avatar,
  AvatarFallback,
  Input,
  LanguageSwitcher,
  cn,
  ScrollArea,
  Separator,
  StitchMobileBottomNav,
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
  Search,
  Shield,
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
  { href: '/teacher/dashboard', key: 'dashboard' as const, icon: LayoutDashboard },
  { href: '/teacher/classes', key: 'classes' as const, icon: BookOpen },
  { href: '/teacher/attendance', key: 'attendance' as const, icon: GraduationCap },
  { href: '/teacher/assignments', key: 'assignments' as const, icon: Home },
  { href: '/teacher/quizzes/builder', key: 'quizBuilder' as const, icon: Sparkles },
  { href: '/teacher/ai/generator', key: 'aiGenerator' as const, icon: Flame },
  { href: '/teacher/reports', key: 'reports' as const, icon: Trophy },
];

const parentNav = [
  { href: '/parent/dashboard', key: 'dashboard' as const, icon: LayoutDashboard },
  { href: '/parent/fees', key: 'fees' as const, icon: BookOpen },
  { href: '/parent/notifications', key: 'notifications' as const, icon: Home },
  { href: '/parent/ai/tutor', key: 'aiAssistant' as const, icon: Sparkles },
  { href: '/parent/privacy', key: 'privacy' as const, icon: Shield },
];

function DashboardShellInner({ title, portal, children }: DashboardShellProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { locale, setLocale, t } = useLocale();
  const { theme, setTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const initials = session?.user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const studentLabels: Record<(typeof studentNav)[number]['key'], string> = {
    dashboard: t('common.nav.dashboard'),
    courses: t('common.nav.courses'),
    hub: t('common.nav.hub'),
    aiTutor: t('ai.nav.tutor'),
    aiHomework: t('ai.nav.homework'),
    aiPlanner: t('ai.nav.planner'),
    gamification: t('gamification.title'),
  };

  const teacherLabels: Record<(typeof teacherNav)[number]['key'], string> = {
    dashboard: t('common.nav.dashboard'),
    classes: t('teacher.nav.classes'),
    attendance: t('teacher.nav.attendance'),
    assignments: t('teacher.nav.assignments'),
    quizBuilder: t('teacher.nav.quizBuilder'),
    aiGenerator: t('ai.nav.generator'),
    reports: t('teacher.nav.reports'),
  };

  const parentLabels: Record<(typeof parentNav)[number]['key'], string> = {
    dashboard: t('common.nav.dashboard'),
    fees: t('parent.nav.fees'),
    notifications: t('parent.nav.notifications'),
    aiAssistant: t('parent.nav.aiAssistant'),
    privacy: t('parent.nav.privacy'),
  };

  const navItems =
    portal === 'student'
      ? studentNav.map((item) => ({ href: item.href, label: studentLabels[item.key], icon: item.icon }))
      : portal === 'teacher'
        ? teacherNav.map((item) => ({ href: item.href, label: teacherLabels[item.key], icon: item.icon }))
        : parentNav.map((item) => ({ href: item.href, label: parentLabels[item.key], icon: item.icon }));

  const density =
    portal === 'teacher' ? 'portal-dense' : portal === 'parent' ? 'portal-calm' : 'portal-joyful';

  const mainMaxWidth =
    portal === 'teacher' ? 'max-w-7xl' : portal === 'parent' ? 'max-w-5xl' : 'max-w-6xl';

  const mainPadding =
    portal === 'teacher' ? 'p-4 md:p-5' : portal === 'parent' ? 'p-6 md:p-8' : 'p-6';

  const renderNavLink = (item: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }) => {
    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
    const Icon = item.icon;

    const link = (
      <Link
        href={item.href}
        prefetch
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors motion-safe:transition-all',
          active
            ? 'stitch-nav-active shadow-sm'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          collapsed && 'justify-center px-2',
          portal === 'teacher' && !collapsed && 'py-1.5',
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
      <div className={cn('portal-background flex min-h-screen', density)}>
        <motion.aside
          initial={false}
          animate={{ width: collapsed ? 72 : portal === 'teacher' ? 220 : 240 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          className="fixed inset-y-0 start-0 z-30 flex flex-col border-e border-sidebar-border bg-sidebar"
        >
          <div
            className={cn(
              'flex h-14 items-center border-b border-sidebar-border px-4',
              portal === 'student' && 'h-16',
              collapsed && 'justify-center',
            )}
          >
            {!collapsed ? (
              <Link href={`/${portal}/dashboard`} prefetch className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold font-display">EduAI</p>
                  <p className="text-[10px] capitalize text-muted-foreground">
                    {t(`shell.portal.${portal}` as 'shell.portal.student', `${portal} Portal`)}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
            )}
          </div>

          <ScrollArea className={cn('flex-1 px-3 py-4', portal === 'teacher' && 'py-2')}>
            <div className={cn('space-y-1', portal === 'teacher' && 'space-y-0.5')}>
              {navItems.map(renderNavLink)}
            </div>
          </ScrollArea>

          {portal === 'teacher' && !collapsed && (
            <div className="border-t border-sidebar-border p-3">
              <Button asChild className="w-full rounded-full font-bold" size="sm">
                <Link href="/teacher/quizzes/builder" prefetch>
                  {t('teacher.nav.quizBuilder')}
                </Link>
              </Button>
            </div>
          )}

          {portal === 'student' && !collapsed && (
            <div className="border-t border-sidebar-border p-3">
              <Button asChild className="w-full rounded-full font-bold">
                <Link href="/student/hub" prefetch>
                  {t('shell.startLearning')}
                </Link>
              </Button>
            </div>
          )}

          <div className="border-t border-sidebar-border p-3">
            <Button
              variant="ghost"
              size={collapsed ? 'icon' : 'sm'}
              className={cn('w-full', !collapsed && 'justify-start')}
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? t('shell.expand') : t('shell.collapse')}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <>
                  <ChevronLeft className="me-2 h-4 w-4" />
                  {t('shell.collapse')}
                </>
              )}
            </Button>
          </div>
        </motion.aside>

        <div
          className={cn(
            'flex flex-1 flex-col motion-safe:transition-all motion-safe:duration-200',
            collapsed ? 'ms-[72px]' : portal === 'teacher' ? 'ms-[220px]' : 'ms-[240px]',
          )}
        >
          <header
            className={cn(
              'sticky top-0 z-20 flex items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-md md:px-6',
              portal === 'student' ? 'h-16' : 'h-14',
            )}
          >
            {portal === 'student' ? (
              <div className="relative hidden max-w-xl flex-1 md:block">
                <Search className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t('shell.searchPlaceholder')}
                  className="stitch-command-search w-full ps-10"
                  aria-label={t('shell.searchPlaceholder')}
                />
              </div>
            ) : (
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {t(`shell.portal.${portal}` as 'shell.portal.teacher', portal)}
                </p>
                <h1 className={cn('font-semibold', portal === 'teacher' ? 'text-base' : 'text-lg')}>
                  {title}
                </h1>
              </div>
            )}
            <div className="flex items-center gap-2">
              {portal === 'student' && (
                <div className="md:hidden">
                  <p className="text-sm font-semibold">{title}</p>
                </div>
              )}
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
                aria-label={t('shell.toggleTheme')}
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
              <Separator orientation="vertical" className="mx-1 h-6" />
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-xs text-primary">
                  {initials ?? 'U'}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: getPortalLoginUrl('web') })}
              >
                <LogOut className="me-2 hidden h-4 w-4 sm:inline" />
                {t('common.nav.logout')}
              </Button>
            </div>
          </header>

          <main className={cn('flex-1', mainPadding, portal === 'student' && 'pb-20 md:pb-6')}>
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                className={cn('mx-auto', mainMaxWidth)}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>

          <footer className="border-t py-4 text-center text-xs text-muted-foreground">
            <Link href="/login" prefetch>
              EduAI
            </Link>{' '}
            · {t('shell.footerTagline')}
          </footer>
          {portal === 'student' && <StitchMobileBottomNav activePath={pathname} />}
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
