import { NextResponse } from 'next/server';
import { getScanStats, getStorageMode } from '@/lib/scan-store';
import { parseStatsRange } from '@/lib/stats-range';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const range = parseStatsRange(searchParams.get('range'));
  const stats = await getScanStats(range);

  return NextResponse.json({
    ...stats,
    storage: getStorageMode(),
    updatedAt: new Date().toISOString(),
  });
}
