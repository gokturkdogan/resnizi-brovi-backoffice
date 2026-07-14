import type { Locale } from './locale';

const en = {
  menu: {
    title: 'Menu',
    language: 'Language',
    logout: 'Log out',
    close: 'Close',
  },
  login: {
    title: 'Backoffice',
    password: 'Password',
    submit: 'Sign in',
    loading: 'Signing in…',
    wrongPassword: 'Wrong password',
  },
  dashboard: {
    title: 'QR Analytics',
    subtitle: 'Scans, trends and platform analytics',
    refresh: 'Refresh',
    refreshing: 'Refreshing…',
    updatedAt: 'Updated',
    loadError: 'Failed to load statistics',
    dynamics: 'Dynamics',
    trend: 'Trend',
    peak: 'Peak',
    systemStatus: 'System status',
    filter: 'Filter',
    storageNeon: 'Neon Postgres',
    storageMemory: 'Memory (dev)',
    footerNote:
      'QR points to /api/scan, saves to database, then redirects. Country is detected by IP on Vercel.',
  },
  range: {
    '24h': '24 hours',
    '7d': '7 days',
    '30d': '30 days',
    all: 'All time',
  },
  charts: {
    noDataPeriod: 'No data for the selected period',
    noData: 'No data',
    scans: 'scans',
    total: 'total',
    countries: 'Countries',
    countriesShort: 'Countries',
    os: 'Operating systems',
    osShort: 'OS',
    browsers: 'Browsers',
    browsersShort: 'Browsers',
    devices: 'Devices',
    devicesShort: 'Devices',
  },
  device: {
    mobile: 'Mobile',
    tablet: 'Tablet',
    desktop: 'Desktop',
    unknown: 'Unknown',
    other: 'Other',
  },
} as const;

const tr = {
  menu: {
    title: 'Menü',
    language: 'Dil',
    logout: 'Çıkış yap',
    close: 'Kapat',
  },
  login: {
    title: 'Backoffice',
    password: 'Şifre',
    submit: 'Giriş yap',
    loading: 'Giriş yapılıyor…',
    wrongPassword: 'Hatalı şifre',
  },
  dashboard: {
    title: 'QR Analitik',
    subtitle: 'Taramalar, trendler ve platform analitiği',
    refresh: 'Yenile',
    refreshing: 'Yenileniyor…',
    updatedAt: 'Güncellendi',
    loadError: 'İstatistikler yüklenemedi',
    dynamics: 'Dinamik',
    trend: 'Trend',
    peak: 'Zirve',
    systemStatus: 'Sistem durumu',
    filter: 'Filtre',
    storageNeon: 'Neon Postgres',
    storageMemory: 'Bellek (dev)',
    footerNote:
      'QR /api/scan adresine gider, veritabanına kaydeder ve yönlendirir. Ülke Vercel üzerinde IP ile tespit edilir.',
  },
  range: {
    '24h': '24 saat',
    '7d': '7 gün',
    '30d': '30 gün',
    all: 'TÜMÜ',
  },
  charts: {
    noDataPeriod: 'Seçilen dönem için veri yok',
    noData: 'Veri yok',
    scans: 'tarama',
    total: 'toplam',
    countries: 'Ülkeler',
    countriesShort: 'Ülkeler',
    os: 'İşletim sistemleri',
    osShort: 'OS',
    browsers: 'Tarayıcılar',
    browsersShort: 'Tarayıcı',
    devices: 'Cihazlar',
    devicesShort: 'Cihaz',
  },
  device: {
    mobile: 'Mobil',
    tablet: 'Tablet',
    desktop: 'Masaüstü',
    unknown: 'Bilinmiyor',
    other: 'Diğer',
  },
} as const;

const ru = {
  menu: {
    title: 'Меню',
    language: 'Язык',
    logout: 'Выйти',
    close: 'Закрыть',
  },
  login: {
    title: 'Backoffice',
    password: 'Пароль',
    submit: 'Войти',
    loading: 'Вход…',
    wrongPassword: 'Неверный пароль',
  },
  dashboard: {
    title: 'QR Аналитика',
    subtitle: 'Сканирования, тренды и платформенная аналитика',
    refresh: 'Обновить',
    refreshing: 'Обновление…',
    updatedAt: 'Обновлено',
    loadError: 'Не удалось загрузить статистику',
    dynamics: 'Динамика',
    trend: 'Тренд',
    peak: 'Пик',
    systemStatus: 'Статус системы',
    filter: 'Фильтр',
    storageNeon: 'Neon Postgres',
    storageMemory: 'Memory (dev)',
    footerNote:
      'QR ведёт на /api/scan, запись в базу, затем редирект. Страна определяется по IP на Vercel.',
  },
  range: {
    '24h': '24 часа',
    '7d': '7 дней',
    '30d': '30 дней',
    all: 'Всё время',
  },
  charts: {
    noDataPeriod: 'Нет данных за выбранный период',
    noData: 'Нет данных',
    scans: 'сканирований',
    total: 'всего',
    countries: 'Страны',
    countriesShort: 'Страны',
    os: 'Операционные системы',
    osShort: 'ОС',
    browsers: 'Браузеры',
    browsersShort: 'Браузеры',
    devices: 'Устройства',
    devicesShort: 'Устройства',
  },
  device: {
    mobile: 'Мобильный',
    tablet: 'Планшет',
    desktop: 'Десктоп',
    unknown: 'Неизвестно',
    other: 'Другое',
  },
} as const;

export const translations = { en, tr, ru } as const;

export type Messages = (typeof translations)[Locale];

export function getMessages(locale: Locale): Messages {
  return translations[locale];
}
