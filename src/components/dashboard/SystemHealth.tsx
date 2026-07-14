'use client';

import { useLocale } from '@/components/i18n/LocaleProvider';
import { healthItemIcon, IconActivity } from '@/components/icons/Icons';
import type { HealthItem, HealthItemId } from '@/lib/system-health';

type SystemHealthBaseProps = {
  items: HealthItem[];
  allHealthy: boolean;
  updatedAt?: string | null;
  storage?: 'neon' | 'memory';
};

function HealthDot({
  status,
  size = 'md',
  className = '',
}: {
  status: HealthItem['status'];
  size?: 'sm' | 'md';
  className?: string;
}) {
  return (
    <span
      className={`health-dot ${size === 'sm' ? 'health-dot--sm' : ''} ${
        status === 'degraded' ? 'health-dot--warn' : ''
      } ${className}`}
      aria-hidden
    />
  );
}

function itemLabel(id: HealthItemId, labels: Record<HealthItemId, string>): string {
  return labels[id];
}

function statusLine(item: HealthItem, t: ReturnType<typeof useLocale>['t']): string {
  if (item.status === 'degraded') return t.health.degraded;
  if (item.checked && item.latencyMs !== undefined) {
    return `${t.health.operational} · ${item.latencyMs}ms`;
  }
  return t.health.operational;
}

function checkBadge(item: HealthItem, t: ReturnType<typeof useLocale>['t']): string {
  return item.checked ? t.health.liveCheck : t.health.monitored;
}

export function SystemHealthDisplay({ items, allHealthy }: SystemHealthBaseProps) {
  const { t } = useLocale();
  const labels = t.health.items;
  const healthyCount = items.filter((item) => item.status === 'healthy').length;

  return (
    <section className="neon-card fade-up rounded-2xl px-3 py-2.5 md:px-4 md:py-3">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="flex shrink-0 items-center gap-2 border-r border-[var(--line)] pr-2 md:pr-3">
          <IconActivity size={15} className="shrink-0 text-[var(--accent)]" />
          <span className="whitespace-nowrap text-[11px] font-semibold text-[var(--ink)] md:text-xs">
            {t.health.title}
          </span>
        </div>

        <div className="flex min-w-0 flex-1 items-stretch gap-1.5 overflow-x-auto md:gap-2">
          {items.map((item) => {
            const ItemIcon = healthItemIcon(item.id);
            const isHealthy = item.status === 'healthy';

            return (
              <div
                key={item.id}
                title={itemLabel(item.id, labels)}
                className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 ${
                  isHealthy
                    ? 'border-[var(--line)] bg-[rgba(255,255,255,0.02)]'
                    : 'border-amber-500/25 bg-amber-500/5'
                }`}
              >
                <div className="relative flex h-6 w-6 shrink-0 items-center justify-center">
                  <ItemIcon size={14} className="text-[var(--accent)]" />
                  <HealthDot
                    status={item.status}
                    size="sm"
                    className="absolute -right-0.5 -top-0.5"
                  />
                </div>
                <span className="hidden min-w-0 truncate text-[10px] font-medium text-[var(--ink)] sm:inline">
                  {itemLabel(item.id, labels)}
                </span>
              </div>
            );
          })}
        </div>

        <div
          className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium whitespace-nowrap md:px-3 md:py-1.5 md:text-[11px] ${
            allHealthy
              ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300'
              : 'border-amber-500/25 bg-amber-500/10 text-amber-300'
          }`}
        >
          <HealthDot status={allHealthy ? 'healthy' : 'degraded'} size="sm" />
          <span className="hidden md:inline">
            {allHealthy ? t.health.allOperational : t.health.partial}
          </span>
          <span className="tabular-nums text-[var(--muted)] md:ml-0.5">
            <span className="font-semibold text-[var(--ink)]">{healthyCount}</span>/{items.length}
          </span>
        </div>
      </div>
    </section>
  );
}

export function SystemHealthPanel({
  items,
  allHealthy,
  updatedAt,
  storage,
}: SystemHealthBaseProps) {
  const { t, intlLocale } = useLocale();
  const labels = t.health.items;
  const descriptions = t.health.descriptions;

  if (!items.length) {
    return (
      <div className="space-y-3">
        <div className="h-4 w-32 animate-pulse rounded bg-[var(--line)]" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-20 animate-pulse rounded-xl bg-[var(--line)]/60" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
            <IconActivity size={13} className="text-[var(--accent)]" />
            {t.health.eyebrow}
          </p>
          <h3 className="mt-1 text-sm font-semibold text-[var(--ink)]">{t.health.title}</h3>
        </div>
        <HealthDot status={allHealthy ? 'healthy' : 'degraded'} size="sm" className="mt-1" />
      </div>

      <div className="space-y-2">
        {items.map((item) => {
          const ItemIcon = healthItemIcon(item.id);
          const showStorage = item.id === 'database' && storage;

          return (
            <div
              key={item.id}
              className="rounded-xl border border-[var(--line)] bg-[rgba(255,255,255,0.02)] p-3"
            >
              <div className="flex items-start gap-3">
                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--line)] bg-[rgba(255,255,255,0.03)]">
                  <ItemIcon size={15} className="text-[var(--accent)]" />
                  <HealthDot
                    status={item.status}
                    size="sm"
                    className="absolute -right-0.5 -top-0.5"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-medium text-[var(--ink)]">
                      {itemLabel(item.id, labels)}
                    </p>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] ${
                        item.checked
                          ? 'bg-emerald-500/10 text-emerald-300'
                          : 'bg-[var(--accent-soft)] text-[var(--accent)]'
                      }`}
                    >
                      {checkBadge(item, t)}
                    </span>
                  </div>

                  <p className="mt-1 text-[11px] leading-relaxed text-[var(--muted)]">
                    {descriptions[item.id]}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[var(--muted)]">
                    <span
                      className={
                        item.status === 'degraded' ? 'text-amber-300' : 'text-emerald-300/90'
                      }
                    >
                      {statusLine(item, t)}
                    </span>
                    {item.checked && item.latencyMs !== undefined ? (
                      <span>
                        {t.health.responseTime}: {item.latencyMs}ms
                      </span>
                    ) : null}
                    {showStorage ? (
                      <span>
                        {t.health.storageLabel}:{' '}
                        {storage === 'neon' ? t.dashboard.storageNeon : t.dashboard.storageMemory}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-[var(--line)] bg-[rgba(255,255,255,0.02)] px-3 py-2.5 text-[10px] leading-relaxed text-[var(--muted)]">
        {updatedAt ? (
          <p className="mb-1 text-[var(--ink)]">
            {t.health.lastCheck}:{' '}
            <span className="text-[var(--accent)]">
              {new Date(updatedAt).toLocaleString(intlLocale)}
            </span>
          </p>
        ) : null}
        <p>{t.health.panelNote}</p>
      </div>
    </div>
  );
}

/** @deprecated Use SystemHealthDisplay on the dashboard */
export function SystemHealth(props: SystemHealthBaseProps) {
  return <SystemHealthDisplay {...props} />;
}
