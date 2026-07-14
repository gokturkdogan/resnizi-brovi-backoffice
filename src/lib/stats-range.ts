export type StatsRange = '24h' | '7d' | '30d' | 'all';

export const RANGE_IDS: StatsRange[] = ['24h', '7d', '30d', 'all'];

export function parseStatsRange(value: string | null): StatsRange {
  if (value === '24h' || value === '7d' || value === '30d' || value === 'all') {
    return value;
  }
  return '7d';
}
