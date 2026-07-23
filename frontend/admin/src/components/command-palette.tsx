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
import { ADMIN_COMMAND_ACTIONS, ADMIN_NAV } from '@/lib/admin-nav';
import { useAdminLocale } from '@/components/admin-locale-provider';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { t } = useAdminLocale();

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

  const groups = [...new Set(ADMIN_NAV.map((p) => p.section))];

  function go(href: string) {
    router.push(href);
    onOpenChange(false);
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder={t('admin.searchCommand')} aria-label={t('admin.searchCommand')} />
      <CommandList>
        <CommandEmpty>{t('common.noResults')}</CommandEmpty>
        {groups.map((group) => (
          <CommandGroup key={group} heading={group}>
            {ADMIN_NAV.filter((p) => p.section === group).map((page) => (
              <CommandItem key={page.href} value={`${page.label} ${page.section}`} onSelect={() => go(page.href)}>
                <page.icon className="mr-2 h-4 w-4" />
                {t(`admin.nav.${page.i18nKey}`, page.label)}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
        <CommandSeparator />
        <CommandGroup heading="Actions">
          {ADMIN_COMMAND_ACTIONS.map((action) => (
            <CommandItem key={action.href + action.label} onSelect={() => go(action.href)}>
              {action.label}
              <CommandShortcut>{action.shortcut}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
