import { STATS_TIMEZONE } from './constants';
import { getSql, isDatabaseConfigured } from './db';
import type { StatsRange } from './stats-range';
import type { ScanPlatform } from './user-agent';

export type ScanMetadata = ScanPlatform & {
  country: string;
};

type MemoryRecord = ScanMetadata & {
  scannedAt: string;
};

type MemoryStore = {
  total: number;
  daily: Record<string, number>;
  records: MemoryRecord[];
};

declare global {
  // eslint-disable-next-line no-var
  var __qrScanMemoryStore: MemoryStore | undefined;
}

function memoryStore(): MemoryStore {
  if (!globalThis.__qrScanMemoryStore) {
    globalThis.__qrScanMemoryStore = { total: 0, daily: {}, records: [] };
  }
  return globalThis.__qrScanMemoryStore;
}

function todayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

function rangeStart(range: StatsRange): Date | null {
  const now = Date.now();
  switch (range) {
    case '24h':
      return new Date(now - 24 * 60 * 60 * 1000);
    case '7d':
      return new Date(now - 7 * 24 * 60 * 60 * 1000);
    case '30d':
      return new Date(now - 30 * 24 * 60 * 60 * 1000);
    case 'all':
      return null;
  }
}

export type BreakdownItem = {
  name: string;
  count: number;
};

export type PlatformBreakdown = {
  os: BreakdownItem[];
  browser: BreakdownItem[];
  device: BreakdownItem[];
  country: BreakdownItem[];
};

export type TrendPoint = {
  label: string;
  count: number;
  at: string;
};

export type ScanStats = {
  range: StatsRange;
  count: number;
  total: number;
  today: number;
  trend: TrendPoint[];
  platforms: PlatformBreakdown;
  storage: 'neon' | 'memory';
};

type RecordField = 'os' | 'browser' | 'deviceType' | 'country';

function countByField(records: ScanMetadata[], field: RecordField): BreakdownItem[] {
  const counts = new Map<string, number>();

  for (const record of records) {
    const key = field === 'deviceType' ? record.deviceType : record[field];
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function buildBreakdown(records: ScanMetadata[]): PlatformBreakdown {
  return {
    os: countByField(records, 'os'),
    browser: countByField(records, 'browser'),
    device: countByField(records, 'deviceType'),
    country: countByField(records, 'country'),
  };
}

function filterMemoryRecords(records: MemoryRecord[], range: StatsRange): MemoryRecord[] {
  const start = rangeStart(range);
  if (!start) return records;
  const startMs = start.getTime();
  return records.filter((record) => new Date(record.scannedAt).getTime() >= startMs);
}

function formatHourLabel(date: Date): string {
  return date.toLocaleString('ru-RU', {
    timeZone: STATS_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDayLabel(date: Date): string {
  return date.toLocaleString('ru-RU', {
    timeZone: STATS_TIMEZONE,
    day: 'numeric',
    month: 'short',
  });
}

function formatWeekLabel(date: Date): string {
  return date.toLocaleString('ru-RU', {
    timeZone: STATS_TIMEZONE,
    day: 'numeric',
    month: 'short',
  });
}

function buildMemoryTrend(records: MemoryRecord[], range: StatsRange): TrendPoint[] {
  if (records.length === 0) return [];

  if (range === '24h') {
    const now = new Date();
    const buckets: TrendPoint[] = [];

    for (let i = 23; i >= 0; i -= 1) {
      const bucketStart = new Date(now.getTime() - i * 60 * 60 * 1000);
      bucketStart.setMinutes(0, 0, 0);
      const bucketEnd = new Date(bucketStart.getTime() + 60 * 60 * 1000);
      const count = records.filter((record) => {
        const ts = new Date(record.scannedAt).getTime();
        return ts >= bucketStart.getTime() && ts < bucketEnd.getTime();
      }).length;

      buckets.push({
        label: formatHourLabel(bucketStart),
        count,
        at: bucketStart.toISOString(),
      });
    }

    return buckets;
  }

  if (range === '7d' || range === '30d') {
    const days = range === '7d' ? 7 : 30;
    const now = new Date();
    const buckets: TrendPoint[] = [];

    for (let i = days - 1; i >= 0; i -= 1) {
      const day = new Date(now);
      day.setHours(0, 0, 0, 0);
      day.setDate(day.getDate() - i);
      const key = day.toISOString().slice(0, 10);
      const count = records.filter(
        (record) => record.scannedAt.slice(0, 10) === key,
      ).length;

      buckets.push({
        label: formatDayLabel(day),
        count,
        at: day.toISOString(),
      });
    }

    return buckets;
  }

  const weekMap = new Map<string, { count: number; at: string }>();

  for (const record of records) {
    const date = new Date(record.scannedAt);
    const weekStart = new Date(date);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const key = weekStart.toISOString().slice(0, 10);
    const existing = weekMap.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      weekMap.set(key, { count: 1, at: weekStart.toISOString() });
    }
  }

  return [...weekMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => ({
      label: formatWeekLabel(new Date(key)),
      count: value.count,
      at: value.at,
    }));
}

async function getNeonBreakdown(
  sql: NonNullable<ReturnType<typeof getSql>>,
  range: StatsRange,
): Promise<PlatformBreakdown> {
  if (range === 'all') {
    const [osRows, browserRows, deviceRows, countryRows] = await Promise.all([
      sql`
        SELECT COALESCE(os, 'unknown') AS name, COUNT(*)::int AS count
        FROM qr_scans
        GROUP BY os
        ORDER BY count DESC, name ASC
      `,
      sql`
        SELECT COALESCE(browser, 'unknown') AS name, COUNT(*)::int AS count
        FROM qr_scans
        GROUP BY browser
        ORDER BY count DESC, name ASC
      `,
      sql`
        SELECT COALESCE(device_type, 'unknown') AS name, COUNT(*)::int AS count
        FROM qr_scans
        GROUP BY device_type
        ORDER BY count DESC, name ASC
      `,
      sql`
        SELECT COALESCE(country, 'unknown') AS name, COUNT(*)::int AS count
        FROM qr_scans
        GROUP BY country
        ORDER BY count DESC, name ASC
      `,
    ]);

    return {
      os: osRows as BreakdownItem[],
      browser: browserRows as BreakdownItem[],
      device: deviceRows as BreakdownItem[],
      country: countryRows as BreakdownItem[],
    };
  }

  if (range === '24h') {
    const [osRows, browserRows, deviceRows, countryRows] = await Promise.all([
      sql`
        SELECT COALESCE(os, 'unknown') AS name, COUNT(*)::int AS count
        FROM qr_scans
        WHERE scanned_at >= NOW() - INTERVAL '24 hours'
        GROUP BY os
        ORDER BY count DESC, name ASC
      `,
      sql`
        SELECT COALESCE(browser, 'unknown') AS name, COUNT(*)::int AS count
        FROM qr_scans
        WHERE scanned_at >= NOW() - INTERVAL '24 hours'
        GROUP BY browser
        ORDER BY count DESC, name ASC
      `,
      sql`
        SELECT COALESCE(device_type, 'unknown') AS name, COUNT(*)::int AS count
        FROM qr_scans
        WHERE scanned_at >= NOW() - INTERVAL '24 hours'
        GROUP BY device_type
        ORDER BY count DESC, name ASC
      `,
      sql`
        SELECT COALESCE(country, 'unknown') AS name, COUNT(*)::int AS count
        FROM qr_scans
        WHERE scanned_at >= NOW() - INTERVAL '24 hours'
        GROUP BY country
        ORDER BY count DESC, name ASC
      `,
    ]);

    return {
      os: osRows as BreakdownItem[],
      browser: browserRows as BreakdownItem[],
      device: deviceRows as BreakdownItem[],
      country: countryRows as BreakdownItem[],
    };
  }

  if (range === '7d') {
    const [osRows, browserRows, deviceRows, countryRows] = await Promise.all([
      sql`
        SELECT COALESCE(os, 'unknown') AS name, COUNT(*)::int AS count
        FROM qr_scans
        WHERE scanned_at >= NOW() - INTERVAL '7 days'
        GROUP BY os
        ORDER BY count DESC, name ASC
      `,
      sql`
        SELECT COALESCE(browser, 'unknown') AS name, COUNT(*)::int AS count
        FROM qr_scans
        WHERE scanned_at >= NOW() - INTERVAL '7 days'
        GROUP BY browser
        ORDER BY count DESC, name ASC
      `,
      sql`
        SELECT COALESCE(device_type, 'unknown') AS name, COUNT(*)::int AS count
        FROM qr_scans
        WHERE scanned_at >= NOW() - INTERVAL '7 days'
        GROUP BY device_type
        ORDER BY count DESC, name ASC
      `,
      sql`
        SELECT COALESCE(country, 'unknown') AS name, COUNT(*)::int AS count
        FROM qr_scans
        WHERE scanned_at >= NOW() - INTERVAL '7 days'
        GROUP BY country
        ORDER BY count DESC, name ASC
      `,
    ]);

    return {
      os: osRows as BreakdownItem[],
      browser: browserRows as BreakdownItem[],
      device: deviceRows as BreakdownItem[],
      country: countryRows as BreakdownItem[],
    };
  }

  const [osRows, browserRows, deviceRows, countryRows] = await Promise.all([
    sql`
      SELECT COALESCE(os, 'unknown') AS name, COUNT(*)::int AS count
      FROM qr_scans
      WHERE scanned_at >= NOW() - INTERVAL '30 days'
      GROUP BY os
      ORDER BY count DESC, name ASC
    `,
    sql`
      SELECT COALESCE(browser, 'unknown') AS name, COUNT(*)::int AS count
      FROM qr_scans
      WHERE scanned_at >= NOW() - INTERVAL '30 days'
      GROUP BY browser
      ORDER BY count DESC, name ASC
    `,
    sql`
      SELECT COALESCE(device_type, 'unknown') AS name, COUNT(*)::int AS count
      FROM qr_scans
      WHERE scanned_at >= NOW() - INTERVAL '30 days'
      GROUP BY device_type
      ORDER BY count DESC, name ASC
    `,
    sql`
      SELECT COALESCE(country, 'unknown') AS name, COUNT(*)::int AS count
      FROM qr_scans
      WHERE scanned_at >= NOW() - INTERVAL '30 days'
      GROUP BY country
      ORDER BY count DESC, name ASC
    `,
  ]);

  return {
    os: osRows as BreakdownItem[],
    browser: browserRows as BreakdownItem[],
    device: deviceRows as BreakdownItem[],
    country: countryRows as BreakdownItem[],
  };
}

async function getNeonTrend(
  sql: NonNullable<ReturnType<typeof getSql>>,
  range: StatsRange,
): Promise<TrendPoint[]> {
  if (range === '24h') {
    const rows = await sql`
      WITH buckets AS (
        SELECT generate_series(
          date_trunc('hour', NOW() - INTERVAL '23 hours'),
          date_trunc('hour', NOW()),
          INTERVAL '1 hour'
        ) AS bucket
      ),
      counts AS (
        SELECT date_trunc('hour', scanned_at) AS bucket, COUNT(*)::int AS count
        FROM qr_scans
        WHERE scanned_at >= NOW() - INTERVAL '24 hours'
        GROUP BY 1
      )
      SELECT b.bucket AS at, COALESCE(c.count, 0)::int AS count
      FROM buckets b
      LEFT JOIN counts c ON b.bucket = c.bucket
      ORDER BY b.bucket
    `;

    return (rows as Array<{ at: Date; count: number }>).map((row) => ({
      at: new Date(row.at).toISOString(),
      count: row.count,
      label: formatHourLabel(new Date(row.at)),
    }));
  }

  if (range === '7d') {
    const rows = await sql`
      WITH buckets AS (
        SELECT generate_series(
          (NOW() AT TIME ZONE ${STATS_TIMEZONE})::date - INTERVAL '6 days',
          (NOW() AT TIME ZONE ${STATS_TIMEZONE})::date,
          INTERVAL '1 day'
        ) AS bucket
      ),
      counts AS (
        SELECT (scanned_at AT TIME ZONE ${STATS_TIMEZONE})::date AS bucket,
               COUNT(*)::int AS count
        FROM qr_scans
        WHERE scanned_at >= NOW() - INTERVAL '7 days'
        GROUP BY 1
      )
      SELECT b.bucket::timestamptz AS at, COALESCE(c.count, 0)::int AS count
      FROM buckets b
      LEFT JOIN counts c ON b.bucket = c.bucket
      ORDER BY b.bucket
    `;

    return (rows as Array<{ at: Date; count: number }>).map((row) => ({
      at: new Date(row.at).toISOString(),
      count: row.count,
      label: formatDayLabel(new Date(row.at)),
    }));
  }

  if (range === '30d') {
    const rows = await sql`
      WITH buckets AS (
        SELECT generate_series(
          (NOW() AT TIME ZONE ${STATS_TIMEZONE})::date - INTERVAL '29 days',
          (NOW() AT TIME ZONE ${STATS_TIMEZONE})::date,
          INTERVAL '1 day'
        ) AS bucket
      ),
      counts AS (
        SELECT (scanned_at AT TIME ZONE ${STATS_TIMEZONE})::date AS bucket,
               COUNT(*)::int AS count
        FROM qr_scans
        WHERE scanned_at >= NOW() - INTERVAL '30 days'
        GROUP BY 1
      )
      SELECT b.bucket::timestamptz AS at, COALESCE(c.count, 0)::int AS count
      FROM buckets b
      LEFT JOIN counts c ON b.bucket = c.bucket
      ORDER BY b.bucket
    `;

    return (rows as Array<{ at: Date; count: number }>).map((row) => ({
      at: new Date(row.at).toISOString(),
      count: row.count,
      label: formatDayLabel(new Date(row.at)),
    }));
  }

  const rows = await sql`
    SELECT
      date_trunc('week', scanned_at AT TIME ZONE ${STATS_TIMEZONE})::timestamptz AS at,
      COUNT(*)::int AS count
    FROM qr_scans
    GROUP BY 1
    ORDER BY 1
  `;

  return (rows as Array<{ at: Date; count: number }>).map((row) => ({
    at: new Date(row.at).toISOString(),
    count: row.count,
    label: formatWeekLabel(new Date(row.at)),
  }));
}

async function getNeonRangeCount(
  sql: NonNullable<ReturnType<typeof getSql>>,
  range: StatsRange,
): Promise<number> {
  if (range === 'all') {
    const [row] = await sql`SELECT COUNT(*)::int AS count FROM qr_scans`;
    return row?.count ?? 0;
  }

  if (range === '24h') {
    const [row] = await sql`
      SELECT COUNT(*)::int AS count
      FROM qr_scans
      WHERE scanned_at >= NOW() - INTERVAL '24 hours'
    `;
    return row?.count ?? 0;
  }

  if (range === '7d') {
    const [row] = await sql`
      SELECT COUNT(*)::int AS count
      FROM qr_scans
      WHERE scanned_at >= NOW() - INTERVAL '7 days'
    `;
    return row?.count ?? 0;
  }

  const [row] = await sql`
    SELECT COUNT(*)::int AS count
    FROM qr_scans
    WHERE scanned_at >= NOW() - INTERVAL '30 days'
  `;

  return row?.count ?? 0;
}

export async function recordScan(metadata: ScanMetadata): Promise<void> {
  const sql = getSql();
  const scannedAt = new Date().toISOString();

  if (sql) {
    await sql`
      INSERT INTO qr_scans (os, browser, device_type, country)
      VALUES (
        ${metadata.os},
        ${metadata.browser},
        ${metadata.deviceType},
        ${metadata.country}
      )
    `;
    return;
  }

  const store = memoryStore();
  const day = todayKey();

  store.total += 1;
  store.daily[day] = (store.daily[day] ?? 0) + 1;
  store.records.push({ scannedAt, ...metadata });
}

export async function getScanStats(range: StatsRange): Promise<ScanStats> {
  const sql = getSql();

  if (sql) {
    const [totalRow, todayRow, count, trend, platforms] = await Promise.all([
      sql`SELECT COUNT(*)::int AS total FROM qr_scans`,
      sql`
        SELECT COUNT(*)::int AS today
        FROM qr_scans
        WHERE (scanned_at AT TIME ZONE ${STATS_TIMEZONE})::date
          = (NOW() AT TIME ZONE ${STATS_TIMEZONE})::date
      `,
      getNeonRangeCount(sql, range),
      getNeonTrend(sql, range),
      getNeonBreakdown(sql, range),
    ]);

    return {
      range,
      count,
      total: totalRow[0]?.total ?? 0,
      today: todayRow[0]?.today ?? 0,
      trend,
      platforms,
      storage: 'neon',
    };
  }

  const store = memoryStore();
  const day = todayKey();
  const rangedRecords = filterMemoryRecords(store.records, range);

  return {
    range,
    count: rangedRecords.length,
    total: store.total,
    today: store.daily[day] ?? 0,
    trend: buildMemoryTrend(rangedRecords, range),
    platforms: buildBreakdown(rangedRecords),
    storage: 'memory',
  };
}

export function getStorageMode(): 'neon' | 'memory' {
  return isDatabaseConfigured() ? 'neon' : 'memory';
}
