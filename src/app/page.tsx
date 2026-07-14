'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/components/i18n/LocaleProvider';
import { AppMenu } from '@/components/layout/AppMenu';
import { DonutChart } from '@/components/dashboard/DonutChart';
import { SystemHealthDisplay } from '@/components/dashboard/SystemHealth';
import { toChartItems } from '@/components/dashboard/chart-utils';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { IconClock, IconPeak, IconQr, IconRefresh, IconTrend, IconAlert } from '@/components/icons/Icons';
import type { PlatformBreakdown, ScanStats, TrendPoint } from '@/lib/scan-store';
import type { SystemHealth as SystemHealthData } from '@/lib/system-health';
import { RANGE_IDS, type StatsRange } from '@/lib/stats-range';

type DashboardStats = ScanStats & {
  updatedAt: string;
  health: SystemHealthData;
};

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-72 rounded-2xl bg-[var(--surface)] md:h-80" />
      <div className="grid grid-cols-2 gap-2 md:gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-44 rounded-xl bg-[var(--surface)] md:h-72 md:rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { t, locale, intlLocale } = useLocale();
  const [range, setRange] = useState<StatsRange>('7d');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadStats = useCallback(async (selectedRange: StatsRange, silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError('');

    try {
      const res = await fetch(`/api/stats?range=${selectedRange}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('stats failed');
      setStats(await res.json());
    } catch {
      setError(t.dashboard.loadError);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [t.dashboard.loadError]);

  useEffect(() => {
    loadStats(range);
    const id = window.setInterval(() => loadStats(range, true), 30000);
    return () => window.clearInterval(id);
  }, [loadStats, range]);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  }

  const platforms: PlatformBreakdown | null = stats?.platforms ?? null;
  const trend: TrendPoint[] = stats?.trend ?? [];
  const periodCount = stats?.count ?? 0;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[rgba(12,8,11,0.92)] backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-start justify-between gap-4 px-5 py-4">
          <div className="min-w-0 pr-2">
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
              <IconQr size={14} className="text-[var(--accent)]" />
              Beauty Space
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-[var(--ink)] md:text-2xl">
              {t.dashboard.title}
            </h1>
            <p className="mt-1 text-sm text-[var(--muted)]">{t.dashboard.subtitle}</p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => loadStats(range, true)}
              disabled={refreshing}
              className="hidden items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-50 sm:inline-flex"
            >
              <IconRefresh size={13} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? t.dashboard.refreshing : t.dashboard.refresh}
            </button>
            <AppMenu
              onLogout={logout}
              health={stats?.health ?? null}
              healthUpdatedAt={stats?.updatedAt ?? null}
              storage={stats?.storage}
            />
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-5 py-6 pb-10">
        <section className="fade-up mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {RANGE_IDS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setRange(id)}
                className={`rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition duration-300 ${
                  range === id
                    ? 'neon-pill-active'
                    : 'border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                }`}
              >
                {t.range[id]}
              </button>
            ))}
          </div>

          {stats ? (
            <p className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)]">
              <IconClock size={13} />
              {t.dashboard.updatedAt}:{' '}
              <span className="text-[var(--accent)]">
                {new Date(stats.updatedAt).toLocaleString(intlLocale)}
              </span>
            </p>
          ) : null}
        </section>

        {loading && !stats ? (
          <DashboardSkeleton />
        ) : error ? (
          <div className="flex items-start gap-3 rounded-2xl border border-red-900/50 bg-red-950/30 p-5 text-sm text-red-300">
            <IconAlert size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : stats && platforms ? (
          <>
            <section className="neon-card fade-up mb-4 rounded-2xl p-4 md:mb-5 md:p-5">
              <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between md:mb-4">
                <div>
                  <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
                    <IconTrend size={13} className="text-[var(--accent)]" />
                    {t.dashboard.dynamics}
                  </p>
                  <h2 className="text-base font-semibold tracking-tight text-[var(--ink)] md:text-lg">
                    {t.dashboard.trend} · {t.range[range]}
                  </h2>
                </div>
                <p className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] md:text-sm">
                  <IconPeak size={14} className="text-[var(--accent)]" />
                  {t.dashboard.peak}:{' '}
                  <span className="font-medium text-[var(--accent)]">
                    {Math.max(...trend.map((point) => point.count), 0)}
                  </span>
                </p>
              </div>
              <TrendChart data={trend} />
            </section>

            <section className="mb-4 grid grid-cols-2 gap-2 md:mb-5 md:gap-4 lg:grid-cols-2">
              <DonutChart
                title={t.charts.countries}
                shortTitle={t.charts.countriesShort}
                kind="country"
                total={periodCount}
                items={toChartItems(platforms.country, 'country', locale, 4)}
              />
              <DonutChart
                title={t.charts.os}
                shortTitle={t.charts.osShort}
                kind="os"
                total={periodCount}
                items={toChartItems(platforms.os, 'os', locale, 4)}
              />
              <DonutChart
                title={t.charts.browsers}
                shortTitle={t.charts.browsersShort}
                kind="browser"
                total={periodCount}
                items={toChartItems(platforms.browser, 'browser', locale, 4)}
              />
              <DonutChart
                title={t.charts.devices}
                shortTitle={t.charts.devicesShort}
                kind="device"
                total={periodCount}
                items={toChartItems(platforms.device, 'device', locale, 4)}
              />
            </section>

            <SystemHealthDisplay
              items={stats.health.items}
              allHealthy={stats.health.allHealthy}
            />
          </>
        ) : null}
      </main>
    </div>
  );
}
