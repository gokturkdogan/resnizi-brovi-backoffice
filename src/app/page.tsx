'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function deviceLabel(name: string): string {
  const labels: Record<string, string> = {
    mobile: 'Мобильный',
    tablet: 'Планшет',
    desktop: 'Десктоп',
    unknown: 'Неизвестно',
  };
  return labels[name] ?? name;
}

function BreakdownList({
  title,
  items,
  total,
}: {
  title: string;
  items: Array<{ name: string; count: number }>;
  total: number;
}) {
  if (items.length === 0) {
    return (
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          {title}
        </p>
        <p className="text-sm text-[var(--muted)]">Нет данных</p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        {title}
      </p>
      <ul className="space-y-2">
        {items.map((item) => {
          const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
          const label = title === 'Устройства' ? deviceLabel(item.name) : item.name;

          return (
            <li key={item.name}>
              <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                <span>{label}</span>
                <span className="tabular-nums text-[var(--muted)]">
                  {item.count}
                  <span className="ml-1 text-xs">({pct}%)</span>
                </span>
              </div>
              <div className="h-1.5 bg-[var(--line)]">
                <div
                  className="h-full bg-black"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

type BreakdownItem = {
  name: string;
  count: number;
};

type PlatformBreakdown = {
  os: BreakdownItem[];
  browser: BreakdownItem[];
  device: BreakdownItem[];
};

type Stats = {
  total: number;
  today: number;
  storage: 'neon' | 'memory';
  updatedAt: string;
  platforms: {
    total: PlatformBreakdown;
    today: PlatformBreakdown;
  };
};

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/stats', { cache: 'no-store' });
      if (!res.ok) throw new Error('stats failed');
      setStats(await res.json());
    } catch {
      setError('Не удалось загрузить статистику');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
    const id = window.setInterval(loadStats, 30000);
    return () => window.clearInterval(id);
  }, [loadStats]);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-[var(--line)] px-5 py-4">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
              Beauty Space
            </p>
            <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
          </div>
          <button
            type="button"
            onClick={logout}
            className="border border-[var(--line)] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em]"
          >
            Выйти
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-5 py-6">
        <section className="mb-4 border border-[var(--line)] p-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
            QR сканирования
          </p>

          {loading && !stats ? (
            <p className="text-sm text-[var(--muted)]">Загрузка…</p>
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : stats ? (
            <div className="grid grid-cols-2 gap-3">
              <article className="border border-[var(--line)] p-4">
                <p className="mb-1 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
                  Всего
                </p>
                <p className="text-3xl font-semibold tabular-nums">{stats.total}</p>
              </article>
              <article className="border border-[var(--line)] p-4">
                <p className="mb-1 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
                  Сегодня
                </p>
                <p className="text-3xl font-semibold tabular-nums">{stats.today}</p>
              </article>
            </div>
          ) : null}

          <button
            type="button"
            onClick={loadStats}
            className="mt-4 w-full border border-black bg-black px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white"
          >
            Обновить
          </button>
        </section>

        {stats ? (
          <section className="mb-4 space-y-4 border border-[var(--line)] p-5">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
              Платформы — всего
            </p>
            <div className="space-y-5">
              <BreakdownList title="ОС" items={stats.platforms.total.os} total={stats.total} />
              <BreakdownList
                title="Браузеры"
                items={stats.platforms.total.browser}
                total={stats.total}
              />
              <BreakdownList
                title="Устройства"
                items={stats.platforms.total.device}
                total={stats.total}
              />
            </div>
          </section>
        ) : null}

        {stats && stats.today > 0 ? (
          <section className="mb-4 space-y-4 border border-[var(--line)] p-5">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
              Платформы — сегодня
            </p>
            <div className="space-y-5">
              <BreakdownList title="ОС" items={stats.platforms.today.os} total={stats.today} />
              <BreakdownList
                title="Браузеры"
                items={stats.platforms.today.browser}
                total={stats.today}
              />
              <BreakdownList
                title="Устройства"
                items={stats.platforms.today.device}
                total={stats.today}
              />
            </div>
          </section>
        ) : null}

        <section className="border border-[var(--line)] p-5 text-sm leading-relaxed text-[var(--muted)]">
          <p className="mb-2 font-medium text-black">Как это работает</p>
          <p className="mb-2">
            QR-код ведёт на{' '}
            <code className="text-xs text-black">/api/scan</code>, запись в Neon
            Postgres, затем редирект на сайт.
          </p>
          {stats ? (
            <p className="text-xs">
              Хранилище: <strong className="text-black">{stats.storage}</strong>
              {stats.storage === 'memory'
                ? ' (только dev — задайте DATABASE_URL и npm run db:init)'
                : ' (Neon Postgres)'}
              <br />
              Обновлено: {new Date(stats.updatedAt).toLocaleString('ru-RU')}
            </p>
          ) : null}
        </section>
      </main>
    </div>
  );
}
