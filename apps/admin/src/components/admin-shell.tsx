'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Button, Avatar, AvatarFallback } from '@eduai/ui';
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

export function AdminShell({ user, children }: AdminShellProps) {
  const roleLabel = user.roles.map((r) => ROLE_LABELS[r]).join(', ');

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r border-border bg-card p-6 md:block">
        <h2 className="text-lg font-semibold text-primary">EduAI Admin</h2>
        <nav className="mt-8 space-y-2 text-sm">
          <Link href="/dashboard" className="block rounded-lg bg-primary/10 px-3 py-2 font-medium text-primary">
            Users
          </Link>
          <span className="block px-3 py-2 text-muted-foreground">Tenants (Sprint 3)</span>
          <span className="block px-3 py-2 text-muted-foreground">Audit Logs (Sprint 3)</span>
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
