const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Load .env.local natively (Node.js v20.6.0+)
try {
    process.loadEnvFile(path.resolve(__dirname, '../.env.local'));
} catch (e) {
    console.error('Could not load .env.local file:', e.message);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Checking Supabase connection...');
console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: Missing Supabase environment variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    try {
        console.log('Attempting to fetch site_settings...');
        const { data: settings, error: settingsError } = await supabase
            .from('site_settings')
            .select('*')
            .limit(1);

        if (settingsError) {
            console.error('Error fetching site_settings:', settingsError);
        } else {
            console.log('Successfully fetched site_settings:', settings);
        }

        console.log('Attempting to fetch metrics...');
        const { data: metrics, error: metricsError } = await supabase
            .from('metrics')
            .select('*')
            .limit(1);

        if (metricsError) {
            console.error('Error fetching metrics:', metricsError);
        } else {
            console.log('Successfully fetched metrics:', metrics);
        }

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testConnection();
