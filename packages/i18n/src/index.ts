import { en } from './messages/en.js';
import { hi } from './messages/hi.js';
import { mr } from './messages/mr.js';

export type SupportedLocale = 'en' | 'hi' | 'mr';

export const DEFAULT_LOCALE: SupportedLocale = 'en';

export const SUPPORTED_LOCALES: SupportedLocale[] = ['en', 'hi', 'mr'];

export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: 'English',
  hi: 'हिन्दी',
  mr: 'मराठी',
};

export type TranslationValue = string | { [key: string]: TranslationValue };

export type TranslationDict = { [key: string]: TranslationValue };

export type Messages = import('./messages/en.js').Messages;

export const MESSAGES: Record<SupportedLocale, Messages> = {
  en,
  hi,
  mr,
};

export function getTranslation(
  dict: TranslationDict,
  key: string,
  fallback?: string,
): string {
  const parts = key.split('.');
  let current: string | TranslationDict | undefined = dict;

  for (const part of parts) {
    if (current == null || typeof current === 'string') {
      return fallback ?? key;
    }
    current = current[part];
  }

  if (typeof current === 'string') {
    return current;
  }

  return fallback ?? key;
}

export type Translator = (key: string, fallback?: string) => string;

export function createTranslator(
  locale: SupportedLocale,
  messages: Record<SupportedLocale, Messages> = MESSAGES,
): Translator {
  const dict = messages[locale] ?? messages[DEFAULT_LOCALE];
  return (key: string, fallback?: string) => getTranslation(dict, key, fallback);
}

export { en, hi, mr };
