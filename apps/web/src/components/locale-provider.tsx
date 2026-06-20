'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  createTranslator,
  DEFAULT_LOCALE,
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
  type SupportedLocale,
  type Translator,
} from '@eduai/i18n';
import { cn } from '@eduai/ui';

const STORAGE_KEY = 'eduai-locale';

interface LocaleContextValue {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: Translator;
  transitioning: boolean;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(DEFAULT_LOCALE);
  const [transitioning, setTransitioning] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as SupportedLocale | null;
    if (stored && SUPPORTED_LOCALES.includes(stored)) {
      setLocaleState(stored);
    }
    setReady(true);
  }, []);

  const setLocale = useCallback(
    (next: SupportedLocale) => {
      if (next === locale) return;
      setTransitioning(true);
      window.setTimeout(() => {
        setLocaleState(next);
        localStorage.setItem(STORAGE_KEY, next);
        window.setTimeout(() => setTransitioning(false), 200);
      }, 150);
    },
    [locale],
  );

  const t = useMemo(() => createTranslator(locale), [locale]);

  if (!ready) {
    return <div className="min-h-screen portal-background">{children}</div>;
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, transitioning }}>
      <div
        className={cn(
          'min-h-screen transition-opacity duration-300 ease-in-out',
          transitioning && 'opacity-60',
        )}
      >
        {children}
      </div>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}

export function localeOptions() {
  return SUPPORTED_LOCALES.map((code) => ({
    code,
    label: LOCALE_LABELS[code],
  }));
}
