const UNKNOWN = 'unknown';

export function getCountryFromRequest(request: Request): string {
  const headers = request.headers;

  const candidates = [
    headers.get('x-vercel-ip-country'),
    headers.get('cf-ipcountry'),
    headers.get('x-country-code'),
    headers.get('x-appengine-country'),
  ];

  for (const value of candidates) {
    const code = normalizeCountryCode(value);
    if (code) return code;
  }

  return UNKNOWN;
}

function normalizeCountryCode(value: string | null): string | null {
  if (!value) return null;

  const code = value.trim().toUpperCase();
  if (code === 'XX' || code === 'T1') return null;
  if (/^[A-Z]{2}$/.test(code)) return code;

  return null;
}

export function countryFlag(code: string): string {
  if (!code || code === UNKNOWN || code.length !== 2) return '🌍';

  const upper = code.toUpperCase();
  return String.fromCodePoint(
    ...[...upper].map((char) => 0x1f1e6 + char.charCodeAt(0) - 65),
  );
}

export function countryName(code: string, locale = 'ru'): string {
  if (!code || code === UNKNOWN) {
    const labels: Record<string, string> = {
      en: 'Unknown',
      tr: 'Bilinmiyor',
      ru: 'Неизвестно',
    };
    return labels[locale] ?? labels.ru;
  }

  const intlLocale =
    locale === 'tr' ? 'tr-TR' : locale === 'en' ? 'en-US' : 'ru-RU';

  try {
    return new Intl.DisplayNames([intlLocale], { type: 'region' }).of(code) ?? code;
  } catch {
    return code;
  }
}
