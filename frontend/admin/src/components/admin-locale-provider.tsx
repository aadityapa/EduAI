'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  createTranslator,
  DEFAULT_LOCALE,
  type SupportedLocale,
  type Translator,
} from '@eduai/i18n';

interface AdminLocaleContextValue {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: Translator;
}

const AdminLocaleContext = createContext<AdminLocaleContextValue | null>(null);

export function AdminLocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<SupportedLocale>(DEFAULT_LOCALE);
  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: createTranslator(locale),
    }),
    [locale],
  );

  return <AdminLocaleContext.Provider value={value}>{children}</AdminLocaleContext.Provider>;
}

export function useAdminLocale(): AdminLocaleContextValue {
  const ctx = useContext(AdminLocaleContext);
  if (!ctx) {
    const t = createTranslator(DEFAULT_LOCALE);
    return { locale: DEFAULT_LOCALE, setLocale: () => undefined, t };
  }
  return ctx;
}
