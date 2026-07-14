/** Locale switch flag backdrops (aria-hidden). */

import type { Locale } from '@/lib/i18n/locale';

const decorBase =
  'pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-full';

export function LocaleFlagBackdrop({
  locale,
  active = false,
  className = '',
}: {
  locale: Locale;
  active?: boolean;
  className?: string;
}) {
  const wrap = `${decorBase} ${className} transition-opacity duration-300 ease-out`;
  const fade = active
    ? 'opacity-[0.72] saturate-110 contrast-105'
    : 'opacity-[0.14] saturate-75 contrast-90';

  if (locale === 'tr') {
    return (
      <span className={`${wrap} ${fade}`} aria-hidden>
        <svg
          className="h-full w-full"
          viewBox="0 0 900 600"
          preserveAspectRatio="xMidYMid slice"
        >
          <rect width="900" height="600" fill="#E30A17" />
          <circle cx="352" cy="300" r="148" fill="#fff" />
          <circle cx="402" cy="300" r="118" fill="#E30A17" />
          <path
            fill="#fff"
            d="M580 248l7.6 15.4 17 2.5-12.3 12 2.9 16.9-15.2-8-15.2 8 2.9-16.9-12.3-12 17-2.5z"
          />
        </svg>
      </span>
    );
  }

  if (locale === 'en') {
    return (
      <span className={`${wrap} ${fade}`} aria-hidden>
        <svg
          className="h-full w-full"
          viewBox="0 0 60 30"
          preserveAspectRatio="xMidYMid slice"
        >
          <rect width="60" height="30" fill="#012169" />
          <path stroke="#fff" strokeWidth="6" d="M0 0 L60 30 M60 0 L0 30" />
          <path
            stroke="#C8102E"
            strokeWidth="3.5"
            d="M0 0 L60 30 M60 0 L0 30"
          />
          <path stroke="#fff" strokeWidth="10" d="M30 0 V30 M0 15 H60" />
          <path stroke="#C8102E" strokeWidth="6" d="M30 0 V30 M0 15 H60" />
        </svg>
      </span>
    );
  }

  if (locale === 'ru') {
    return (
      <span className={`${wrap} ${fade}`} aria-hidden>
        <svg
          className="h-full w-full"
          viewBox="0 0 9 6"
          preserveAspectRatio="xMidYMid slice"
        >
          <rect width="9" height="2" y="0" fill="#fff" />
          <rect width="9" height="2" y="2" fill="#0039A6" />
          <rect width="9" height="2" y="4" fill="#D52B1E" />
        </svg>
      </span>
    );
  }

  return null;
}
