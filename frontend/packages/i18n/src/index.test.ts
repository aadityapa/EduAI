import { describe, expect, it } from 'vitest';
import {
  createTranslator,
  DEFAULT_LOCALE,
  getTranslation,
  LOCALE_LABELS,
  MESSAGES,
  SUPPORTED_LOCALES,
} from './index.js';

describe('@eduai/i18n', () => {
  it('exposes supported locales and labels', () => {
    expect(SUPPORTED_LOCALES).toEqual(['en', 'hi', 'mr']);
    expect(DEFAULT_LOCALE).toBe('en');
    expect(LOCALE_LABELS.en).toBe('English');
    expect(LOCALE_LABELS.hi).toBe('हिन्दी');
    expect(LOCALE_LABELS.mr).toBe('मराठी');
  });

  it('resolves nested translation keys', () => {
    expect(getTranslation(MESSAGES.en, 'dashboard.title')).toBe('Dashboard');
    expect(getTranslation(MESSAGES.en, 'common.buttons.submit')).toBe('Submit');
    expect(getTranslation(MESSAGES.hi, 'dashboard.continueLearning')).toBe('सीखना जारी रखें');
  });

  it('returns fallback for missing keys', () => {
    expect(getTranslation(MESSAGES.en, 'missing.key', 'Fallback')).toBe('Fallback');
    expect(getTranslation(MESSAGES.en, 'missing.key')).toBe('missing.key');
  });

  it('creates locale-specific translators', () => {
    const tEn = createTranslator('en');
    const tHi = createTranslator('hi');

    expect(tEn('quiz.title')).toBe('Quiz');
    expect(tHi('quiz.title')).toBe('प्रश्नोत्तरी');
    expect(tEn('parent.noChildren')).toBe('No linked students yet.');
  });

  it('falls back to default locale for unknown locale dict', () => {
    const t = createTranslator('en', { en: MESSAGES.en, hi: MESSAGES.hi, mr: MESSAGES.mr });
    expect(t('hub.title')).toBe('Learning Hub');
  });
});
