import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Missing Supabase admin keys' }, { status: 500 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    const tablesToBackup = [
      "case_studies", "messages", "certificates", "operations", "social_links", "activity_log"
    ];

    const databaseDump: Record<string, any[]> = {};

    for (const table of tablesToBackup) {
      const { data, error } = await supabaseAdmin.from(table).select('*').limit(5000);
      if (!error && data) {
        databaseDump[table] = data;
      }
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `database-${timestamp}.json`;
    const jsonString = JSON.stringify(databaseDump, null, 2);

    return new NextResponse(jsonString, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${backupFileName}"`,
      },
    });
  } catch (error: any) {
    console.error('Database backup error:', error);
    return NextResponse.json({ error: 'Failed to create database backup: ' + error?.message }, { status: 500 });
  }
}
