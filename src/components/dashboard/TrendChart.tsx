'use client';

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useLocale } from '@/components/i18n/LocaleProvider';
import type { TrendPoint } from '@/lib/scan-store';

function TrendTooltip({
  active,
  payload,
  scansLabel,
}: {
  active?: boolean;
  payload?: Array<{ payload: TrendPoint }>;
  scansLabel: string;
}) {
  if (!active || !payload?.[0]) return null;

  const point = payload[0].payload;
  return (
    <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-xs">
      <p className="font-medium text-[var(--ink)]">{point.label}</p>
      <p className="text-[var(--muted)]">
        {point.count} {scansLabel}
      </p>
    </div>
  );
}

export function TrendChart({ data }: { data: TrendPoint[] }) {
  const { t } = useLocale();

  if (data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-[var(--muted)] md:h-72">
        {t.charts.noDataPeriod}
      </div>
    );
  }

  return (
    <div className="h-56 w-full md:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e879a9" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#e879a9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: '#9a8490', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            minTickGap={24}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: '#9a8490', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<TrendTooltip scansLabel={t.charts.scans} />} />
          <Area
            type="monotone"
            dataKey="count"
            fill="url(#trendFill)"
            stroke="none"
            animationDuration={500}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#e879a9"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#e879a9', strokeWidth: 0 }}
            animationDuration={600}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
