export type Locale = 'en' | 'tr' | 'ru';

export const DEFAULT_LOCALE: Locale = 'ru';

export const LOCALES: Locale[] = ['ru', 'tr', 'en'];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  tr: 'Türkçe',
  ru: 'Русский',
};

export const LOCALE_STORAGE_KEY = 'bs-locale';

export function localeToIntl(locale: Locale): string {
  const map: Record<Locale, string> = {
    en: 'en-US',
    tr: 'tr-TR',
    ru: 'ru-RU',
  };
  return map[locale];
}

export function isLocale(value: string | null): value is Locale {
  return value === 'en' || value === 'tr' || value === 'ru';
}
