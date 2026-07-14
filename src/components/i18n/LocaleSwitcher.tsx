'use client';

import { useLocale } from '@/components/i18n/LocaleProvider';
import { LocaleFlagBackdrop } from '@/components/i18n/LocaleFlagBackdrop';
import { IconLanguages } from '@/components/icons/Icons';
import type { Locale } from '@/lib/i18n/locale';

const OPTIONS: Array<{ id: Locale; label: string }> = [
  { id: 'ru', label: 'RU' },
  { id: 'tr', label: 'TR' },
  { id: 'en', label: 'EN' },
];

type LocaleSwitcherProps = {
  labelAlign?: 'left' | 'center' | 'right';
};

export function LocaleSwitcher({ labelAlign = 'left' }: LocaleSwitcherProps) {
  const { locale, setLocale, t } = useLocale();
  const idx = Math.max(0, OPTIONS.findIndex((option) => option.id === locale));

  const labelAlignClass =
    labelAlign === 'center'
      ? 'text-center'
      : labelAlign === 'right'
        ? 'text-right'
        : 'text-left';

  return (
    <div className="flex flex-col gap-1.5">
      <p
        className={`flex items-center gap-1.5 text-xs font-semibold tracking-wide text-[var(--muted)] uppercase ${labelAlignClass}`}
      >
        <IconLanguages size={13} className="text-[var(--accent)]" />
        {t.menu.language}
      </p>
      <div
        className="relative inline-flex w-full min-w-[8.25rem] rounded-full border border-[var(--line)] bg-[var(--bg)] p-1"
        role="group"
        aria-label={t.menu.language}
      >
        <span
          className="pointer-events-none absolute top-1 bottom-1 rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] transition-[left] duration-300 ease-out will-change-[left]"
          style={{
            left: `calc(0.25rem + ${idx} * (100% - 0.5rem) / 3)`,
            width: 'calc((100% - 0.5rem) / 3)',
          }}
          aria-hidden
        />
        {OPTIONS.map((opt) => {
          const active = locale === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              title={opt.label}
              aria-pressed={active}
              onClick={() => setLocale(opt.id)}
              className={`relative z-10 flex h-9 min-w-0 flex-1 basis-0 cursor-pointer items-center justify-center overflow-hidden rounded-full text-xs tracking-wide transition-colors duration-200 ${
                active
                  ? 'font-semibold text-[var(--ink)]'
                  : 'font-medium text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              <LocaleFlagBackdrop locale={opt.id} active={active} />
              <span className="relative z-[1]">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
