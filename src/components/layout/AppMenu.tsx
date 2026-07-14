'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocale } from '@/components/i18n/LocaleProvider';
import { LocaleSwitcher } from '@/components/i18n/LocaleSwitcher';

type AppMenuProps = {
  onLogout: () => void | Promise<void>;
};

export function AppMenu({ onLogout }: AppMenuProps) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  async function handleLogout() {
    setOpen(false);
    await onLogout();
  }

  const drawer = mounted
    ? createPortal(
        <>
          <div
            className={`fixed inset-0 z-[100] bg-black/50 transition-opacity duration-300 ${
              open ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            onClick={() => setOpen(false)}
            aria-hidden={!open}
          />

          <aside
            className={`fixed inset-y-0 right-0 z-[110] flex w-[min(88vw,320px)] max-w-full flex-col border-l border-[var(--line)] bg-[var(--surface)] transition-transform duration-300 ease-out ${
              open ? 'translate-x-0' : 'pointer-events-none translate-x-full'
            }`}
            aria-hidden={!open}
            role="dialog"
            aria-modal="true"
            aria-label={t.menu.title}
          >
            <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--ink)]">
                {t.menu.title}
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.menu.close}
                className="rounded-full border border-[var(--line)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)] transition hover:text-[var(--ink)]"
              >
                {t.menu.close}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              <LocaleSwitcher />
            </div>

            <div className="border-t border-[var(--line)] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1a0812] transition hover:opacity-90"
              >
                {t.menu.logout}
              </button>
            </div>
          </aside>
        </>,
        document.body,
      )
    : null;

  return (
    <>
      <button
        type="button"
        aria-label={t.menu.title}
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="relative z-30 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] transition hover:border-[var(--accent)]"
      >
        <span className="flex flex-col gap-1.5">
          <span className="block h-0.5 w-4 bg-[var(--ink)]" />
          <span className="block h-0.5 w-4 bg-[var(--ink)]" />
          <span className="block h-0.5 w-4 bg-[var(--ink)]" />
        </span>
      </button>
      {drawer}
    </>
  );
}
