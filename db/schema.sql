-- Neon Postgres schema — QR scan tracking
-- Run once: npm run db:init (with DATABASE_URL set)

CREATE TABLE IF NOT EXISTS qr_scans (
  id          BIGSERIAL PRIMARY KEY,
  scanned_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  os          TEXT,
  browser     TEXT,
  device_type TEXT
);

ALTER TABLE qr_scans ADD COLUMN IF NOT EXISTS os TEXT;
ALTER TABLE qr_scans ADD COLUMN IF NOT EXISTS browser TEXT;
ALTER TABLE qr_scans ADD COLUMN IF NOT EXISTS device_type TEXT;

CREATE INDEX IF NOT EXISTS idx_qr_scans_scanned_at
  ON qr_scans (scanned_at DESC);

CREATE INDEX IF NOT EXISTS idx_qr_scans_os
  ON qr_scans (os);

CREATE INDEX IF NOT EXISTS idx_qr_scans_browser
  ON qr_scans (browser);

CREATE INDEX IF NOT EXISTS idx_qr_scans_device_type
  ON qr_scans (device_type);
