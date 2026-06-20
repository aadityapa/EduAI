import { createTranslator, DEFAULT_LOCALE, type SupportedLocale } from '@eduai/i18n';
import { useMemo } from 'react';

export function useTranslation(locale: SupportedLocale = DEFAULT_LOCALE) {
  return useMemo(() => createTranslator(locale), [locale]);
}
