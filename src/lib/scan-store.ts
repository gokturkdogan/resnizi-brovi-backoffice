import { STATS_TIMEZONE } from './constants';
import { getSql, isDatabaseConfigured } from './db';
import type { ScanPlatform } from './user-agent';

type MemoryRecord = ScanPlatform & {
  day: string;
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

export type BreakdownItem = {
  name: string;
  count: number;
};

export type PlatformBreakdown = {
  os: BreakdownItem[];
  browser: BreakdownItem[];
  device: BreakdownItem[];
};

export type ScanStats = {
  total: number;
  today: number;
  storage: 'neon' | 'memory';
  platforms: {
    total: PlatformBreakdown;
    today: PlatformBreakdown;
  };
};

function countByField(
  records: Array<{ os: string; browser: string; deviceType: ScanPlatform['deviceType'] }>,
  field: 'os' | 'browser' | 'deviceType',
): BreakdownItem[] {
  const counts = new Map<string, number>();

  for (const record of records) {
    const key =
      field === 'deviceType'
        ? record.deviceType
        : record[field];
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function buildBreakdown(
  records: Array<{ os: string; browser: string; deviceType: ScanPlatform['deviceType'] }>,
): PlatformBreakdown {
  return {
    os: countByField(records, 'os'),
    browser: countByField(records, 'browser'),
    device: countByField(records, 'deviceType'),
  };
}


export async function recordScan(platform: ScanPlatform): Promise<void> {
  const sql = getSql();

  if (sql) {
    await sql`
      INSERT INTO qr_scans (os, browser, device_type)
      VALUES (${platform.os}, ${platform.browser}, ${platform.deviceType})
    `;
    return;
  }

  const store = memoryStore();
  const day = todayKey();

  store.total += 1;
  store.daily[day] = (store.daily[day] ?? 0) + 1;
  store.records.push({
    day,
    os: platform.os,
    browser: platform.browser,
    deviceType: platform.deviceType,
  });
}

async function getNeonBreakdown(
  sql: NonNullable<ReturnType<typeof getSql>>,
  scope: 'total' | 'today',
): Promise<PlatformBreakdown> {
  if (scope === 'today') {
    const [osRows, browserRows, deviceRows] = await Promise.all([
      sql`
        SELECT COALESCE(os, 'unknown') AS name, COUNT(*)::int AS count
        FROM qr_scans
        WHERE (scanned_at AT TIME ZONE ${STATS_TIMEZONE})::date
          = (NOW() AT TIME ZONE ${STATS_TIMEZONE})::date
        GROUP BY os
        ORDER BY count DESC, name ASC
      `,
      sql`
        SELECT COALESCE(browser, 'unknown') AS name, COUNT(*)::int AS count
        FROM qr_scans
        WHERE (scanned_at AT TIME ZONE ${STATS_TIMEZONE})::date
          = (NOW() AT TIME ZONE ${STATS_TIMEZONE})::date
        GROUP BY browser
        ORDER BY count DESC, name ASC
      `,
      sql`
        SELECT COALESCE(device_type, 'unknown') AS name, COUNT(*)::int AS count
        FROM qr_scans
        WHERE (scanned_at AT TIME ZONE ${STATS_TIMEZONE})::date
          = (NOW() AT TIME ZONE ${STATS_TIMEZONE})::date
        GROUP BY device_type
        ORDER BY count DESC, name ASC
      `,
    ]);

    return {
      os: osRows as BreakdownItem[],
      browser: browserRows as BreakdownItem[],
      device: deviceRows as BreakdownItem[],
    };
  }

  const [osRows, browserRows, deviceRows] = await Promise.all([
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
  ]);

  return {
    os: osRows as BreakdownItem[],
    browser: browserRows as BreakdownItem[],
    device: deviceRows as BreakdownItem[],
  };
}

export async function getScanStats(): Promise<ScanStats> {
  const sql = getSql();

  if (sql) {
    const [totalRow, todayRow, totalPlatforms, todayPlatforms] = await Promise.all([
      sql`SELECT COUNT(*)::int AS total FROM qr_scans`,
      sql`
        SELECT COUNT(*)::int AS today
        FROM qr_scans
        WHERE (scanned_at AT TIME ZONE ${STATS_TIMEZONE})::date
          = (NOW() AT TIME ZONE ${STATS_TIMEZONE})::date
      `,
      getNeonBreakdown(sql, 'total'),
      getNeonBreakdown(sql, 'today'),
    ]);

    return {
      total: totalRow[0]?.total ?? 0,
      today: todayRow[0]?.today ?? 0,
      storage: 'neon',
      platforms: {
        total: totalPlatforms,
        today: todayPlatforms,
      },
    };
  }

  const store = memoryStore();
  const day = todayKey();
  const todayRecords = store.records.filter((record) => record.day === day);

  return {
    total: store.total,
    today: store.daily[day] ?? 0,
    storage: 'memory',
    platforms: {
      total: buildBreakdown(store.records),
      today: buildBreakdown(todayRecords),
    },
  };
}

export function getStorageMode(): 'neon' | 'memory' {
  return isDatabaseConfigured() ? 'neon' : 'memory';
}
