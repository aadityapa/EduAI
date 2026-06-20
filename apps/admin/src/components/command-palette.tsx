'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@eduai/ui';
import {
  BarChart3,
  Building2,
  CreditCard,
  FileText,
  Headphones,
  LayoutDashboard,
  Megaphone,
  Palette,
  School,
  Shield,
  Sparkles,
  Ticket,
  Users,
} from 'lucide-react';

const pages = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'Overview' },
  { href: '/dashboard/users', label: 'User Management', icon: Users, group: 'Overview' },
  { href: '/dashboard/schools', label: 'School Management', icon: School, group: 'Management' },
  { href: '/dashboard/tenants', label: 'Tenant Management', icon: Building2, group: 'Management' },
  { href: '/dashboard/branding', label: 'Branding', icon: Palette, group: 'Management' },
  { href: '/dashboard/ai-analytics', label: 'AI Analytics', icon: Sparkles, group: 'Analytics' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3, group: 'Analytics' },
  { href: '/dashboard/billing', label: 'Revenue Dashboard', icon: CreditCard, group: 'Revenue' },
  { href: '/dashboard/subscriptions', label: 'Subscriptions', icon: CreditCard, group: 'Revenue' },
  { href: '/dashboard/content', label: 'Content Management', icon: FileText, group: 'Content' },
  { href: '/dashboard/leads', label: 'Leads CRM', icon: Megaphone, group: 'Sales' },
  { href: '/dashboard/tickets', label: 'Support Center', icon: Headphones, group: 'Support' },
  { href: '/dashboard/audit-logs', label: 'Audit Center', icon: Shield, group: 'Security' },
  { href: '/dashboard/security', label: 'Security', icon: Shield, group: 'Security' },
  { href: '/dashboard/coupons', label: 'Coupons', icon: Ticket, group: 'Revenue' },
  { href: '/dashboard/campaigns', label: 'Campaigns', icon: Megaphone, group: 'Sales' },
];

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const groups = [...new Set(pages.map((p) => p.group))];

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages, actions…" aria-label="Command search" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {groups.map((group) => (
          <CommandGroup key={group} heading={group}>
            {pages
              .filter((p) => p.group === group)
              .map((page) => (
                <CommandItem
                  key={page.href}
                  onSelect={() => {
                    router.push(page.href);
                    onOpenChange(false);
                  }}
                >
                  <page.icon className="mr-2 h-4 w-4" />
                  {page.label}
                </CommandItem>
              ))}
          </CommandGroup>
        ))}
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => onOpenChange(false)}>
            Create new tenant
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => onOpenChange(false)}>
            Export data
            <CommandShortcut>⌘E</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export { pages as adminNavPages };
