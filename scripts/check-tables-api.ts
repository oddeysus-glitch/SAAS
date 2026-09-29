import fs from 'fs';

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

const projectRef = 'dkwjinmykgtvnsroumrj';
const accessToken = process.env.SUPABASE_ACCESS_TOKEN;

// Use Supabase Management API to get database info
async function main() {
  // First, get the database connection info from management API
  const dbConfigRes = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database`,
    {
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' }
    }
  );
  const dbConfig = await dbConfigRes.json();
  console.log('DB Config:', JSON.stringify(dbConfig, null, 2).slice(0, 500));

  // Also try the pg-api endpoint for tables
  const dbUrl = `https://api.supabase.com/v1/projects/${projectRef}/database/pg`;
  const tablesRes = await fetch(dbUrl, {
    headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' }
  });
  const tables = await tablesRes.json();
  console.log('\nTables via pg API:', JSON.stringify(tables, null, 2).slice(0, 2000));
}

main().catch(console.error);
