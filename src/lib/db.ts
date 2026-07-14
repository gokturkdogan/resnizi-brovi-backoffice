import { neon, NeonQueryFunction } from '@neondatabase/serverless';

let sql: NeonQueryFunction<false, false> | null | undefined;

export function getSql(): NeonQueryFunction<false, false> | null {
  if (sql !== undefined) return sql;

  const url = process.env.DATABASE_URL;
  if (!url) {
    sql = null;
    return null;
  }

  sql = neon(url);
  return sql;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
