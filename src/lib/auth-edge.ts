const SESSION_COOKIE = 'bo_session';

function sessionSecret(): string {
  return process.env.SESSION_SECRET ?? 'dev-only-change-me';
}

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? 'admin';
}

async function createSessionToken(): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(sessionSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(adminPassword()),
  );

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export { SESSION_COOKIE };

export async function verifySessionToken(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;

  try {
    const expected = await createSessionToken();
    return safeEqual(token, expected);
  } catch {
    return false;
  }
}
