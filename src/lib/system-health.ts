import { SITE_REDIRECT_URL } from './constants';
import { getSql } from './db';

export type HealthItemId = 'website' | 'qr' | 'database' | 'backoffice' | 'geo';

export type HealthStatus = 'healthy' | 'degraded';

export type HealthItem = {
  id: HealthItemId;
  status: HealthStatus;
  checked: boolean;
  latencyMs?: number;
};

export type SystemHealth = {
  items: HealthItem[];
  allHealthy: boolean;
};

const WEBSITE_TIMEOUT_MS = 5000;

async function checkWebsite(): Promise<HealthItem> {
  const start = Date.now();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), WEBSITE_TIMEOUT_MS);

    let response = await fetch(SITE_REDIRECT_URL, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
      cache: 'no-store',
    });

    if (response.status === 405 || response.status === 501) {
      response = await fetch(SITE_REDIRECT_URL, {
        method: 'GET',
        signal: controller.signal,
        redirect: 'follow',
        cache: 'no-store',
        headers: { Range: 'bytes=0-0' },
      });
    }

    clearTimeout(timeout);

    const healthy = response.ok || response.status < 500;

    return {
      id: 'website',
      status: healthy ? 'healthy' : 'degraded',
      checked: true,
      latencyMs: Date.now() - start,
    };
  } catch {
    return { id: 'website', status: 'healthy', checked: false };
  }
}

async function checkDatabase(): Promise<HealthItem> {
  const sql = getSql();

  if (!sql) {
    return { id: 'database', status: 'healthy', checked: false };
  }

  const start = Date.now();

  try {
    await sql`SELECT 1`;
    return {
      id: 'database',
      status: 'healthy',
      checked: true,
      latencyMs: Date.now() - start,
    };
  } catch {
    return { id: 'database', status: 'degraded', checked: true };
  }
}

async function checkQrSystem(database: HealthItem): Promise<HealthItem> {
  const sql = getSql();

  if (!sql || !database.checked || database.status !== 'healthy') {
    return { id: 'qr', status: 'healthy', checked: false };
  }

  const start = Date.now();

  try {
    await sql`SELECT COUNT(*)::int AS count FROM qr_scans`;
    return {
      id: 'qr',
      status: 'healthy',
      checked: true,
      latencyMs: Date.now() - start,
    };
  } catch {
    return { id: 'qr', status: 'degraded', checked: true };
  }
}

export async function getSystemHealth(): Promise<SystemHealth> {
  const database = await checkDatabase();
  const [website, qr] = await Promise.all([
    checkWebsite(),
    checkQrSystem(database),
  ]);

  const items: HealthItem[] = [
    website,
    qr,
    database,
    { id: 'backoffice', status: 'healthy', checked: false },
    { id: 'geo', status: 'healthy', checked: false },
  ];

  return {
    items,
    allHealthy: items.every((item) => item.status === 'healthy'),
  };
}
