import { NextResponse } from 'next/server';
import {
  SESSION_COOKIE,
  createSessionToken,
  verifyPassword,
} from '@/lib/auth';

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string };
  const password = body.password ?? '';

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: createSessionToken(),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 14,
  });

  return response;
}
