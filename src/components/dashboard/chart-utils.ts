import { countryFlag, countryName } from '@/lib/geo';
import type { Locale } from '@/lib/i18n/locale';
import { getMessages } from '@/lib/i18n/translations';

export const CHART_COLORS = [
  '#e8a0ba',
  '#d986a8',
  '#f0b8cc',
  '#c98ba8',
  '#f5d0de',
  '#b87d9a',
  '#f8e0ea',
  '#a8728f',
];

export type ChartItem = {
  name: string;
  label: string;
  count: number;
  color: string;
};

export function deviceLabel(name: string, locale: Locale): string {
  const labels = getMessages(locale).device;
  return labels[name as keyof typeof labels] ?? name;
}

export function formatBreakdownLabel(
  kind: 'country' | 'os' | 'browser' | 'device',
  name: string,
  locale: Locale,
): string {
  if (kind === 'country') return countryName(name, locale);
  if (kind === 'device') return deviceLabel(name, locale);
  if (name === 'other') return getMessages(locale).device.other;
  return name;
}

export function formatBreakdownIcon(
  kind: 'country' | 'os' | 'browser' | 'device',
  name: string,
): string | null {
  if (kind !== 'country') return null;
  return countryFlag(name);
}

export function topItemsWithOther(
  items: Array<{ name: string; count: number }>,
  limit = 5,
): Array<{ name: string; count: number }> {
  if (items.length <= limit) return items;

  const top = items.slice(0, limit);
  const otherCount = items.slice(limit).reduce((sum, item) => sum + item.count, 0);

  if (otherCount <= 0) return top;
  return [...top, { name: 'other', count: otherCount }];
}

export function toChartItems(
  items: Array<{ name: string; count: number }>,
  kind: 'country' | 'os' | 'browser' | 'device',
  locale: Locale,
  limit = 5,
): ChartItem[] {
  return topItemsWithOther(items, limit).map((item, index) => ({
    name: item.name,
    label: formatBreakdownLabel(kind, item.name, locale),
    count: item.count,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));
}
