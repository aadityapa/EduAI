'use client';

import * as React from 'react';
import { Globe } from 'lucide-react';
import { cn } from '../lib/utils';
import { Label } from './label';

export interface LocaleOption {
  code: string;
  label: string;
}

export interface LanguageSwitcherProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: string;
  onChange: (locale: string) => void;
  locales?: LocaleOption[];
  label?: string;
  showIcon?: boolean;
  id?: string;
}

const DEFAULT_LOCALES: LocaleOption[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'mr', label: 'मराठी' },
];

export function LanguageSwitcher({
  value,
  onChange,
  locales = DEFAULT_LOCALES,
  label = 'Language',
  showIcon = true,
  id = 'language-switcher',
  className,
  ...props
}: LanguageSwitcherProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)} {...props}>
      <Label htmlFor={id} className="flex items-center gap-1.5 text-sm">
        {showIcon && <Globe className="h-4 w-4" aria-hidden="true" />}
        {label}
      </Label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
          'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        )}
      >
        {locales.map((locale) => (
          <option key={locale.code} value={locale.code}>
            {locale.label}
          </option>
        ))}
      </select>
    </div>
  );
}
