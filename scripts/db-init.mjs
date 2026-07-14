import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;

if (!url) {
  console.error('DATABASE_URL is required. Example:');
  console.error('  DATABASE_URL="postgresql://..." npm run db:init');
  process.exit(1);
}

const sql = neon(url);

await sql`
  CREATE TABLE IF NOT EXISTS qr_scans (
    id          BIGSERIAL PRIMARY KEY,
    scanned_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    os          TEXT,
    browser     TEXT,
    device_type TEXT
  )
`;

await sql`ALTER TABLE qr_scans ADD COLUMN IF NOT EXISTS os TEXT`;
await sql`ALTER TABLE qr_scans ADD COLUMN IF NOT EXISTS browser TEXT`;
await sql`ALTER TABLE qr_scans ADD COLUMN IF NOT EXISTS device_type TEXT`;

await sql`
  CREATE INDEX IF NOT EXISTS idx_qr_scans_scanned_at
    ON qr_scans (scanned_at DESC)
`;

await sql`
  CREATE INDEX IF NOT EXISTS idx_qr_scans_os
    ON qr_scans (os)
`;

await sql`
  CREATE INDEX IF NOT EXISTS idx_qr_scans_browser
    ON qr_scans (browser)
`;

await sql`
  CREATE INDEX IF NOT EXISTS idx_qr_scans_device_type
    ON qr_scans (device_type)
`;

console.log('Neon schema ready (qr_scans + platform columns).');
