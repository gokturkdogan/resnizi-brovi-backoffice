'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useLocale } from '@/components/i18n/LocaleProvider';
import {
  formatBreakdownIcon,
  formatBreakdownLabel,
  type ChartItem,
} from './chart-utils';

function DonutTooltip({
  active,
  payload,
  total,
  kind,
}: {
  active?: boolean;
  payload?: Array<{ payload: ChartItem }>;
  total: number;
  kind: 'country' | 'os' | 'browser' | 'device';
}) {
  const { locale } = useLocale();

  if (!active || !payload?.[0]) return null;

  const item = payload[0].payload;
  const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
  const icon = formatBreakdownIcon(kind, item.name);

  return (
    <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-xs">
      <p className="flex items-center gap-2 font-medium text-[var(--ink)]">
        {icon ? <span>{icon}</span> : null}
        {formatBreakdownLabel(kind, item.name, locale)}
      </p>
      <p className="text-[var(--muted)]">
        {item.count} · {pct}%
      </p>
    </div>
  );
}

export function DonutChart({
  title,
  shortTitle,
  items,
  total,
  kind,
}: {
  title: string;
  shortTitle?: string;
  items: ChartItem[];
  total: number;
  kind: 'country' | 'os' | 'browser' | 'device';
  delay?: number;
}) {
  const { t } = useLocale();
  const visibleItems = items.slice(0, 4);

  if (items.length === 0 || total === 0) {
    return (
      <div className="neon-card rounded-xl p-3 md:rounded-2xl md:p-5">
        <p className="mb-2 truncate text-[11px] font-medium text-[var(--muted)] md:mb-4 md:text-sm">
          <span className="md:hidden">{shortTitle ?? title}</span>
          <span className="hidden md:inline">{title}</span>
        </p>
        <div className="flex h-28 items-center justify-center text-[11px] text-[var(--muted)] md:h-56 md:text-sm">
          {t.charts.noData}
        </div>
      </div>
    );
  }

  return (
    <div className="neon-card rounded-xl p-3 md:rounded-2xl md:p-5">
      <p className="mb-2 truncate text-[11px] font-medium text-[var(--muted)] md:mb-4 md:text-sm">
        <span className="md:hidden">{shortTitle ?? title}</span>
        <span className="hidden md:inline">{title}</span>
      </p>

      <div className="flex flex-col items-center gap-2 md:grid md:grid-cols-[180px_1fr] md:items-center md:gap-4">
        <div className="relative h-24 w-24 md:mx-auto md:h-44 md:w-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={items}
                dataKey="count"
                nameKey="label"
                innerRadius="58%"
                outerRadius="88%"
                paddingAngle={2}
                stroke="var(--bg)"
                strokeWidth={2}
                animationDuration={500}
              >
                {items.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
              <Tooltip content={<DonutTooltip total={total} kind={kind} />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <p className="text-lg font-semibold tabular-nums text-[var(--ink)] md:text-2xl">
              {total}
            </p>
          </div>
        </div>

        <ul className="w-full space-y-1 md:space-y-2">
          {visibleItems.map((item) => {
            const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
            const icon = formatBreakdownIcon(kind, item.name);

            return (
              <li
                key={item.name}
                className="flex items-center justify-between gap-1 text-[10px] md:gap-3 md:text-sm"
              >
                <span className="flex min-w-0 items-center gap-1 md:gap-2">
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full md:h-2 md:w-2"
                    style={{ backgroundColor: item.color }}
                  />
                  {icon ? <span className="shrink-0 text-[11px] md:text-base">{icon}</span> : null}
                  <span className="truncate text-[var(--ink)]">{item.label}</span>
                </span>
                <span className="shrink-0 tabular-nums text-[var(--muted)]">{pct}%</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
