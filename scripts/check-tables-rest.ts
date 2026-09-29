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
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

async function checkTables() {
  const supabase = createClient(supabaseUrl, anonKey);
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_type', 'BASE TABLE');

    if (error) {
      console.log('Error:', error.message);
    } else {
      console.log('Tables in public schema:', JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.log('Exception:', err.message);
  }
}

checkTables();
