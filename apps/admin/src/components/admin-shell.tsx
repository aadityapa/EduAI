'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
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
  CreditCard,
  FileText,
  Headphones,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Moon,
  Palette,
  Plus,
  School,
  Search,
  Settings,
  Shield,
  Sparkles,
  Star,
  Sun,
  Users,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { CommandPalette } from './command-palette';
import { notifications, tenants } from '@/lib/mock-data';

interface AdminShellProps {
  user: {
    name?: string | null;
    email?: string | null;
    roles: RoleCode[];
  };
  children: React.ReactNode;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  section: string;
  roles?: RoleCode[];
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Overview' },
  { href: '/dashboard/users', label: 'Users', icon: Users, section: 'Overview' },
  { href: '/dashboard/schools', label: 'Schools', icon: School, section: 'Management' },
  { href: '/dashboard/tenants', label: 'Tenants', icon: Building2, section: 'Management' },
  { href: '/dashboard/branding', label: 'Branding', icon: Palette, section: 'Management' },
  { href: '/dashboard/ai-analytics', label: 'AI Analytics', icon: Sparkles, section: 'Analytics' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: LayoutDashboard, section: 'Analytics' },
  { href: '/dashboard/billing', label: 'Revenue', icon: CreditCard, section: 'Revenue' },
  { href: '/dashboard/subscriptions', label: 'Subscriptions', icon: CreditCard, section: 'Revenue' },
  { href: '/dashboard/content', label: 'Content', icon: FileText, section: 'Content' },
  { href: '/dashboard/leads', label: 'Leads CRM', icon: Megaphone, section: 'Sales' },
  { href: '/dashboard/tickets', label: 'Support', icon: Headphones, section: 'Support' },
  { href: '/dashboard/audit-logs', label: 'Audit Center', icon: Shield, section: 'Security' },
  { href: '/dashboard/security', label: 'Security', icon: Shield, section: 'Security' },
];

const favorites = ['/dashboard', '/dashboard/users', '/dashboard/ai-analytics', '/dashboard/billing'];
const recent = ['/dashboard/schools', '/dashboard/tenants', '/dashboard/leads'];

export function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const [selectedTenant, setSelectedTenant] = useState(tenants[0]);
  const [notifOpen, setNotifOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const roleLabel = user.roles.map((r) => ROLE_LABELS[r]).join(', ');
  const initials = user.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() ?? 'A';

  const filteredNav = navItems.filter((item) =>
    item.label.toLowerCase().includes(navSearch.toLowerCase()),
  );

  const sections = [...new Set(filteredNav.map((i) => i.section))];

  const renderNavLink = (item: NavItem) => {
    const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));
    const Icon = item.icon;

    const link = (
      <Link
        href={item.href}
        className={cn(
          'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
          active
            ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
            : 'text-sidebar-foreground/70 hover:bg-sidebar-muted hover:text-sidebar-foreground',
          collapsed && 'justify-center px-2',
        )}
        aria-current={active ? 'page' : undefined}
      >
        <Icon className={cn('h-4 w-4 shrink-0', active && 'text-sidebar-accent-foreground')} />
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
      <div className="flex min-h-screen bg-background">
        <motion.aside
          initial={false}
          animate={{ width: collapsed ? 72 : 260 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="fixed inset-y-0 left-0 z-30 flex flex-col border-r border-sidebar-border sidebar-gradient"
        >
          <div className={cn('flex h-16 items-center border-b border-sidebar-border px-4', collapsed && 'justify-center px-2')}>
            {!collapsed ? (
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">EduAI</p>
                  <p className="text-[10px] text-muted-foreground">Admin Console</p>
                </div>
              </Link>
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
            )}
          </div>

          {!collapsed && (
            <div className="border-b border-sidebar-border p-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search nav…"
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                  className="h-9 pl-8 text-sm"
                  aria-label="Search navigation"
                />
              </div>
            </div>
          )}

          <ScrollArea className="flex-1 px-3 py-4">
            {!collapsed && !navSearch && (
              <div className="mb-4">
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Favorites
                </p>
                <div className="space-y-0.5">
                  {navItems.filter((i) => favorites.includes(i.href)).map(renderNavLink)}
                </div>
              </div>
            )}

            {!collapsed && !navSearch && (
              <div className="mb-4">
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Recent
                </p>
                <div className="space-y-0.5">
                  {navItems.filter((i) => recent.includes(i.href)).map(renderNavLink)}
                </div>
              </div>
            )}

            {sections.map((section) => (
              <div key={section} className="mb-4">
                {!collapsed && (
                  <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {section}
                  </p>
                )}
                <div className="space-y-0.5">{filteredNav.filter((i) => i.section === section).map(renderNavLink)}</div>
              </div>
            ))}
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

        <div className={cn('flex flex-1 flex-col transition-all duration-200', collapsed ? 'ml-[72px]' : 'ml-[260px]')}>
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="hidden gap-2 text-muted-foreground sm:flex"
                onClick={() => setCommandOpen(true)}
                aria-label="Open command palette"
              >
                <Command className="h-4 w-4" />
                <span className="text-xs">Search…</span>
                <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                  ⌘K
                </kbd>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Building2 className="h-4 w-4" />
                    <span className="hidden sm:inline">{selectedTenant.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>Switch Tenant</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {tenants.map((tenant) => (
                    <DropdownMenuItem key={tenant.id} onClick={() => setSelectedTenant(tenant)}>
                      <Star className={cn('mr-2 h-4 w-4', selectedTenant.id === tenant.id ? 'fill-primary text-primary' : 'opacity-0')} />
                      {tenant.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="default" size="sm" className="hidden gap-1 md:flex">
                <Plus className="h-4 w-4" />
                Quick Action
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.map((n) => (
                    <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 py-3">
                      <div className="flex w-full items-center justify-between">
                        <span className="font-medium">{n.title}</span>
                        {!n.read && <Badge variant="default" className="h-5 text-[10px]">New</Badge>}
                      </div>
                      <span className="text-xs text-muted-foreground">{n.message}</span>
                      <span className="text-[10px] text-muted-foreground">{n.time}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Separator orientation="vertical" className="mx-1 h-6" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 pl-2 pr-1">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="hidden text-left md:block">
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
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/login' })}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
