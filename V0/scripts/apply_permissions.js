const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env.local natively
try {
    process.loadEnvFile(path.resolve(__dirname, '../.env.local'));
} catch (e) {
    console.error('Could not load .env.local file:', e.message);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL.');
    console.error('Please run the SQL manually in Supabase Dashboard SQL Editor.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyFix() {
    const sqlPath = path.join(__dirname, '008_fix_permissions.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // There isn't a direct "run SQL" method in supabase-js client for security reasons
    // unless we use the rpc interface if a function is defined, OR we use the postgres connection.
    // However, often the 'postgres' library is used for this. 
    // BUT: if we don't have direct DB access, we might not be able to run arbitrary SQL via JS client 
    // UNLESS there is a stored procedure.

    // Checking if there is a way to run raw SQL. 
    // Since we can't easily run raw SQL without a postgres client and connection string (which might be in env),
    // we might have to fallback to asking the user.

    // Let's check if DATABASE_URL is in env.
    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

    if (dbUrl) {
        console.log('Found DATABASE_URL, attempting to run via pg...');
        try {
            // We need 'pg' to run this. Check if 'pg' is installed.
            // It is listed in package.json dependencies.
            const { Client } = require('pg');
            const client = new Client({ connectionString: dbUrl });
            await client.connect();
            await client.query(sql);
            await client.end();
            console.log('Successfully applied permissions SQL via direct DB connection.');
            return;
        } catch (err) {
            console.error('Failed to run via pg:', err.message);
        }
    }

    console.error('Could not apply SQL automatically. No DATABASE_URL found or connection failed.');
    console.log('Please copy content of scripts/008_fix_permissions.sql and run in Supabase Dashboard.');
}

applyFix();
