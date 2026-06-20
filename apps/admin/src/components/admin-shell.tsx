'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Button, Avatar, AvatarFallback, cn } from '@eduai/ui';
import type { RoleCode } from '@eduai/shared';
import { ROLE_LABELS } from '@eduai/shared';

interface AdminShellProps {
  user: {
    name?: string | null;
    email?: string | null;
    roles: RoleCode[];
  };
  children: React.ReactNode;
}

const navItems = [
  { href: '/dashboard', label: 'Users' },
  { href: '/dashboard/schools', label: 'Schools' },
  { href: '/dashboard/tenants', label: 'Tenants' },
  { href: '/dashboard/branding', label: 'Branding' },
  { href: '/dashboard/subscriptions', label: 'Subscriptions' },
  { href: '/dashboard/billing', label: 'Revenue' },
  { href: '/dashboard/content', label: 'Content' },
  { href: '/dashboard/ai-analytics', label: 'AI Analytics' },
  { href: '/dashboard/analytics', label: 'Analytics' },
  { href: '/dashboard/leads', label: 'Leads' },
  { href: '/dashboard/tickets', label: 'Support' },
  { href: '/dashboard/coupons', label: 'Coupons' },
  { href: '/dashboard/campaigns', label: 'Campaigns' },
  { href: '/dashboard/audit-logs', label: 'Audit Logs' },
  { href: '/dashboard/security', label: 'Security' },
];

export function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();
  const roleLabel = user.roles.map((r) => ROLE_LABELS[r]).join(', ');

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r border-border bg-card p-6 md:block">
        <h2 className="text-lg font-semibold text-primary">EduAI Admin</h2>
        <p className="mt-1 text-xs text-muted-foreground">Sprint 4 CRM</p>
        <nav className="mt-8 space-y-1 text-sm">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'block rounded-lg px-3 py-2 transition-colors',
                  active
                    ? 'bg-primary/10 font-medium text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <p className="text-sm text-muted-foreground">{roleLabel}</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{user.name?.[0] ?? 'A'}</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: '/login' })}>
              Sign out
            </Button>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
