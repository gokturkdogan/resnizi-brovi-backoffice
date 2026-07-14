import { NextResponse } from 'next/server';
import { SITE_REDIRECT_URL } from '@/lib/constants';
import { getCountryFromRequest } from '@/lib/geo';
import { recordScan } from '@/lib/scan-store';
import { parseUserAgent } from '@/lib/user-agent';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const userAgent = request.headers.get('user-agent');
    await recordScan({
      ...parseUserAgent(userAgent),
      country: getCountryFromRequest(request),
    });
  } catch (error) {
    console.error('scan record failed', error);
  }

  const { searchParams } = new URL(request.url);
  const target = searchParams.get('to') || SITE_REDIRECT_URL;

  return NextResponse.redirect(target, 302);
}
