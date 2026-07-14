import { NextResponse } from 'next/server';
import { getScanStats, getStorageMode } from '@/lib/scan-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const stats = await getScanStats();

  return NextResponse.json({
    ...stats,
    storage: getStorageMode(),
    updatedAt: new Date().toISOString(),
  });
}
