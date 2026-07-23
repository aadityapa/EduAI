'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { getPortalLoginUrl } from '@eduai/shared';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useMemo, useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  ScrollArea,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@eduai/ui';
import type { RoleCode } from '@eduai/shared';
import { ROLE_LABELS } from '@eduai/shared';
import {
  Bell,
  Building2,
  ChevronLeft,
  ChevronRight,
  Command,
  LogOut,
  Moon,
  Plus,
  Search,
  Settings,
  Sparkles,
  Star,
  Sun,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { CommandPalette } from './command-palette';
import { ADMIN_FAVORITES, ADMIN_NAV, type AdminNavItem } from '@/lib/admin-nav';
import { useAdminLocale } from '@/components/admin-locale-provider';

export interface ShellTenant {
  id: string;
  name: string;
  slug: string;
}

export interface ShellNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface AdminShellProps {
  user: {
    name?: string | null;
    email?: string | null;
    roles: RoleCode[];
  };
  tenants?: ShellTenant[];
  notifications?: ShellNotification[];
  children: React.ReactNode;
}

export function AdminShell({
  user,
  tenants = [],
  notifications = [],
  children,
}: AdminShellProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { t } = useAdminLocale();
  const reduceMotion = useReducedMotion();
  const [collapsed, setCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<ShellTenant | null>(tenants[0] ?? null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [recentHrefs, setRecentHrefs] = useState<string[]>([
    '/dashboard/schools',
    '/dashboard/tenants',
    '/dashboard/leads',
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const roleLabel = user.roles.map((r) => ROLE_LABELS[r]).join(', ');
  const initials =
    user.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? 'A';

  const filteredNav = useMemo(
    () =>
      ADMIN_NAV.filter((item) => {
        const label = t(`admin.nav.${item.i18nKey}`, item.label);
        return label.toLowerCase().includes(navSearch.toLowerCase());
      }),
    [navSearch, t],
  );

  const sections = [...new Set(filteredNav.map((i) => i.section))];

  function markRecent(href: string) {
    setRecentHrefs((prev) => [href, ...prev.filter((h) => h !== href)].slice(0, 4));
  }

  const renderNavLink = (item: AdminNavItem) => {
    const active =
      pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));
    const Icon = item.icon;
    const label = t(`admin.nav.${item.i18nKey}`, item.label);

    const link = (
      <Link
        href={item.href}
        onClick={() => markRecent(item.href)}
        className={cn(
          'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
          active ? 'stitch-admin-nav-active' : 'stitch-admin-nav-link',
          collapsed && 'justify-center px-2',
        )}
        aria-current={active ? 'page' : undefined}
      >
        <Icon className={cn('h-4 w-4 shrink-0', active && 'text-sidebar-accent-foreground')} />
        {!collapsed && <span className="truncate">{label}</span>}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip key={item.href}>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
      );
    }

    return <div key={item.href}>{link}</div>;
  };

  const motionDuration = reduceMotion ? 0 : 0.2;

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex min-h-screen bg-background">
        <motion.aside
          initial={false}
          animate={{ width: collapsed ? 72 : 260 }}
          transition={{ duration: motionDuration, ease: 'easeInOut' }}
          className="fixed inset-y-0 start-0 z-30 flex flex-col border-e stitch-admin-sidebar"
        >
          <div
            className={cn(
              'flex h-14 items-center border-b border-white/10 px-4',
              collapsed && 'justify-center px-2',
            )}
          >
            {!collapsed ? (
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/90 text-primary-foreground">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t('admin.brand')}</p>
                  <p className="text-[10px] text-white/50">{t('admin.brandSubtitle')}</p>
                </div>
              </Link>
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
            )}
          </div>

          {!collapsed && (
            <div className="border-b border-white/10 p-3">
              <div className="relative">
                <Search className="absolute start-2.5 top-2.5 h-4 w-4 text-white/40" />
                <Input
                  placeholder={t('admin.searchNav')}
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                  className="h-9 border-white/10 bg-white/5 ps-8 text-sm text-white placeholder:text-white/40"
                  aria-label={t('admin.searchNav')}
                />
              </div>
            </div>
          )}

          <ScrollArea className="flex-1 px-3 py-3">
            {!collapsed && !navSearch && (
              <div className="mb-3">
                <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                  {t('admin.favorites')}
                </p>
                <div className="space-y-0.5">
                  {ADMIN_NAV.filter((i) => (ADMIN_FAVORITES as readonly string[]).includes(i.href)).map(
                    renderNavLink,
                  )}
                </div>
              </div>
            )}

            {!collapsed && !navSearch && (
              <div className="mb-3">
                <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                  {t('admin.recent')}
                </p>
                <div className="space-y-0.5">
                  {ADMIN_NAV.filter((i) => recentHrefs.includes(i.href)).map(renderNavLink)}
                </div>
              </div>
            )}

            {sections.map((section) => (
              <div key={section} className="mb-3">
                {!collapsed && (
                  <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                    {section}
                  </p>
                )}
                <div className="space-y-0.5">
                  {filteredNav.filter((i) => i.section === section).map(renderNavLink)}
                </div>
              </div>
            ))}
          </ScrollArea>

          <div className="border-t border-white/10 p-3">
            <Button
              variant="ghost"
              size={collapsed ? 'icon' : 'sm'}
              className={cn(
                'w-full text-white/70 hover:bg-white/10 hover:text-white',
                !collapsed && 'justify-start',
              )}
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? t('admin.expand') : t('admin.collapse')}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <>
                  <ChevronLeft className="me-2 h-4 w-4" /> {t('admin.collapse')}
                </>
              )}
            </Button>
          </div>
        </motion.aside>

        <div
          className={cn(
            'flex flex-1 flex-col transition-all duration-200',
            collapsed ? 'ms-[72px]' : 'ms-[260px]',
          )}
        >
          <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b bg-background/95 px-4 backdrop-blur-md sm:px-6">
            <div className="relative hidden max-w-xl flex-1 md:block">
              <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('admin.searchGlobal')}
                className="stitch-command-search w-full"
                onFocus={() => setCommandOpen(true)}
                readOnly
                aria-label={t('admin.searchGlobal')}
              />
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                className="hidden gap-2 text-muted-foreground sm:flex"
                onClick={() => setCommandOpen(true)}
                aria-label={t('admin.searchCommand')}
              >
                <Command className="h-4 w-4" />
                <span className="text-xs">{t('admin.commandHint')}</span>
                <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                  ⌘K
                </kbd>
              </Button>

              {tenants.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Building2 className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {selectedTenant?.name ?? tenants[0]?.name}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuLabel>{t('admin.switchTenant')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {tenants.map((tenant) => (
                      <DropdownMenuItem key={tenant.id} onClick={() => setSelectedTenant(tenant)}>
                        <Star
                          className={cn(
                            'me-2 h-4 w-4',
                            selectedTenant?.id === tenant.id
                              ? 'fill-primary text-primary'
                              : 'opacity-0',
                          )}
                        />
                        {tenant.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <Button variant="default" size="sm" className="hidden gap-1 md:flex" asChild>
                <Link href="/dashboard/tenants">
                  <Plus className="h-4 w-4" />
                  {t('admin.quickAction')}
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label={t('shell.toggleTheme')}
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative" aria-label={t('admin.notifications')}>
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -end-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>{t('admin.notifications')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length === 0 ? (
                    <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                      {t('admin.noNotifications')}
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 py-3">
                        <div className="flex w-full items-center justify-between">
                          <span className="font-medium">{n.title}</span>
                          {!n.read && (
                            <Badge variant="default" className="h-5 text-[10px]">
                              New
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">{n.message}</span>
                        <span className="text-[10px] text-muted-foreground">{n.time}</span>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <Separator orientation="vertical" className="mx-1 h-6" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 pe-1 ps-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-xs text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden text-start md:block">
                      <p className="text-sm font-medium leading-none">{user.name ?? 'Admin'}</p>
                      <p className="text-[10px] text-muted-foreground">{roleLabel}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p>{user.email}</p>
                    <p className="text-xs font-normal text-muted-foreground">{roleLabel}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/rbac">
                      <Settings className="me-2 h-4 w-4" />
                      {t('admin.settings')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: getPortalLoginUrl('admin') })}
                  >
                    <LogOut className="me-2 h-4 w-4" />
                    {t('admin.signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: motionDuration }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
      </div>
    </TooltipProvider>
  );
}
