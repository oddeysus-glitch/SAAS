import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const dotenvPath = '.env.local';
try {
  const content = fs.readFileSync(dotenvPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    process.env[key] = value;
  }
} catch {}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('MISSING SUPABASE CREDS');
  process.exit(1);
}

async function run() {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const sql = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (matching Prisma schema)
CREATE TABLE IF NOT EXISTS "User" (
  id            TEXT    PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT,
  email         TEXT    UNIQUE,
  emailVerified TIMESTAMP,
  image         TEXT,
  passwordHash  TEXT,
  createdAt     TIMESTAMP DEFAULT now(),
  updatedAt     TIMESTAMP DEFAULT now()
);

-- NextAuth Account model
CREATE TABLE IF NOT EXISTS "Account" (
  id                TEXT    PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId            TEXT    NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  type              TEXT    NOT NULL,
  provider          TEXT    NOT NULL,
  providerAccountId TEXT    NOT NULL,
  refresh_token     TEXT,
  access_token      TEXT,
  expires_at        INTEGER,
  token_type        TEXT,
  scope             TEXT,
  id_token          TEXT,
  session_state     TEXT,
  UNIQUE(userId, provider, providerAccountId)
);

-- NextAuth Session model
CREATE TABLE IF NOT EXISTS "Session" (
  id           TEXT    PRIMARY KEY DEFAULT uuid_generate_v4(),
  sessionToken TEXT    UNIQUE NOT NULL,
  userId       TEXT    NOT NULL REFERENCES "User"(id) ON DELETE CASCADE
);

-- CreditLedger
CREATE TABLE IF NOT EXISTS "CreditLedger" (
  id          TEXT    PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId      TEXT    NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  amount      INTEGER NOT NULL,
  balance     INTEGER NOT NULL,
  source      TEXT    NOT NULL,
  createdAt   TIMESTAMP DEFAULT now()
);

-- Jobs
CREATE TABLE IF NOT EXISTS "Job" (
  id          TEXT    PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId      TEXT    NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  app         TEXT    NOT NULL,
  payload     TEXT,
  status      TEXT    NOT NULL DEFAULT 'pending',
  result      TEXT,
  error       TEXT,
  credits     INTEGER,
  createdAt   TIMESTAMP DEFAULT now(),
  updatedAt   TIMESTAMP DEFAULT now()
);

-- PreviewCount
CREATE TABLE IF NOT EXISTS "PreviewCount" (
  id          TEXT    PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId      TEXT    NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  app         TEXT    NOT NULL,
  count       INTEGER NOT NULL DEFAULT 0,
  UNIQUE(userId, app)
);

-- Event tracking
CREATE TABLE IF NOT EXISTS "Event" (
  id          TEXT    PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId      TEXT    REFERENCES "User"(id) ON DELETE SET NULL,
  name        TEXT    NOT NULL,
  properties  TEXT    NOT NULL DEFAULT '{}',
  createdAt   TIMESTAMP DEFAULT now()
);

-- Billing requests
CREATE TABLE IF NOT EXISTS "BillingRequest" (
  id          TEXT    PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId      TEXT    NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  app         TEXT    NOT NULL,
  method      TEXT,
  amount      INTEGER,
  properties  TEXT    NOT NULL DEFAULT '{}',
  note        TEXT,
  status      TEXT    NOT NULL DEFAULT 'pending',
  createdAt   TIMESTAMP DEFAULT now(),
  updatedAt   TIMESTAMP DEFAULT now()
);

-- Payout requests
CREATE TABLE IF NOT EXISTS "PayoutRequest" (
  id          TEXT    PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId      TEXT    NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  app         TEXT    NOT NULL,
  amount      INTEGER NOT NULL,
  status      TEXT    NOT NULL DEFAULT 'pending',
  note        TEXT,
  paypalEmail TEXT,
  createdAt   TIMESTAMP DEFAULT now(),
  updatedAt   TIMESTAMP DEFAULT now()
);

-- UpdatedAt trigger function
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updatedAt = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updatedAt trigger to tables that need it
CREATE TRIGGER set_updated_at__User
  BEFORE UPDATE ON "User"
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at__Job
  BEFORE UPDATE ON "Job"
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at__BillingRequest
  BEFORE UPDATE ON "BillingRequest"
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at__PayoutRequest
  BEFORE UPDATE ON "PayoutRequest"
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
`;

  // Try supabase admin API with sql.rest endpoint
  const adminResponse = await fetch(`${supabaseUrl}/rest/v1/sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify({ query: sql }),
  });
  const adminData = await adminResponse.json();
  console.log('Admin API response:', JSON.stringify(adminData).slice(0, 2000));
  if (!adminResponse.ok) {
    console.log('Admin API status:', adminResponse.status, adminData.error || adminData.message);
  } else {
    console.log('Tables created successfully via admin SQL API');
  }

  // Also try the older way via postgREST
  const { error: insertError } = await supabase.from('Event').insert({ name: 'supabase_setup_check', properties: JSON.stringify({ ts: new Date().toISOString() }) }).select();
  if (insertError) {
    console.log('Event insert failed (expected if table fresh):', insertError.message);
  } else {
    console.log('Event table works, db is live');
  }

  console.log('\n--- Done ---');
}

run();
