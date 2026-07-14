'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from '@/components/i18n/LocaleProvider';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';
import { BrandLogo } from '@/components/layout/BrandLogo';
import { IconAlert, IconLock } from '@/components/icons/Icons';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';
  const { t } = useLocale();

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!res.ok) {
      setError(t.login.wrongPassword);
      return;
    }

    router.replace(next);
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="neon-card relative w-full max-w-sm rounded-2xl p-8">
        <div className="mb-6">
          <BrandLogo
            size="lg"
            align="center"
            showTitle
            title={t.dashboard.title}
          />
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              <IconLock size={12} />
              {t.login.password}
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent)]"
            />
          </label>

          {error ? (
            <p className="flex items-center gap-2 text-sm text-red-400" role="alert">
              <IconAlert size={14} className="shrink-0" />
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-ink)] transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? t.login.loading : t.login.submit}
          </button>
        </form>

        <div className="mt-6 border-t border-[var(--line)] pt-5">
          <LanguageSwitcher />
        </div>
      </div>
    </main>
  );
}
