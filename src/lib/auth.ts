import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'bo_session';

function sessionSecret(): string {
  return process.env.SESSION_SECRET ?? 'dev-only-change-me';
}

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? 'admin';
}

export function createSessionToken(): string {
  return createHmac('sha256', sessionSecret())
    .update(adminPassword())
    .digest('hex');
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;

  try {
    const expected = createSessionToken();
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function verifyPassword(password: string): boolean {
  const expected = adminPassword();
  try {
    const a = Buffer.from(password);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  return verifySessionToken(jar.get(SESSION_COOKIE)?.value);
}
