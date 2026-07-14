'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from '@/components/i18n/LocaleProvider';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';
import { IconAlert, IconLock, IconQr } from '@/components/icons/Icons';

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
      <div className="absolute right-5 top-5 w-[min(100%,14rem)]">
        <LanguageSwitcher />
      </div>

      <div className="neon-card relative w-full max-w-sm rounded-2xl p-8">
        <p className="mb-2 flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
          <IconQr size={14} />
          Beauty Space
        </p>
        <h1 className="mb-6 text-center text-2xl font-semibold tracking-tight text-[var(--ink)]">
          {t.login.title}
        </h1>

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
            className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1a0812] transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? t.login.loading : t.login.submit}
          </button>
        </form>
      </div>
    </main>
  );
}
