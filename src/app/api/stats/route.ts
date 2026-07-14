import { NextResponse } from 'next/server';
import { getScanStats, getStorageMode } from '@/lib/scan-store';
import { getSystemHealth } from '@/lib/system-health';
import { parseStatsRange } from '@/lib/stats-range';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const range = parseStatsRange(searchParams.get('range'));
  const [stats, health] = await Promise.all([getScanStats(range), getSystemHealth()]);

  return NextResponse.json({
    ...stats,
    storage: getStorageMode(),
    health,
    updatedAt: new Date().toISOString(),
  });
}
