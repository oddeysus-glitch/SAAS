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

// Try the Supabase Management API to run SQL
async function main() {
  // Use the db.execute endpoint via the supabase management API
  // The actual endpoint might be different - let's try a few
  const endpoints = [
    `https://api.supabase.com/v1/projects/${projectRef}/database/execute`,
    `https://api.supabase.com/v1/projects/${projectRef}/sql`,
  ];

  for (const url of endpoints) {
    console.log(`\nTrying: ${url}`);
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'response-lazy'
      },
      body: JSON.stringify({ query: 'SELECT tablename FROM pg_tables WHERE schemaname = \'public\' ORDER BY tablename;' })
    });
    const text = await res.text();
    console.log(`Status: ${res.status}`);
    console.log(`Response: ${text.slice(0, 1000)}`);
  }
}

main();
