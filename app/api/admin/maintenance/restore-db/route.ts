import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!file.name.endsWith('.json')) {
      return NextResponse.json({ error: 'Please upload a valid .json database backup file' }, { status: 400 });
    }

    // Convert uploaded File to Text
    const fileContent = await file.text();
    const databaseDump = JSON.parse(fileContent);

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Missing Supabase admin keys required for restoration' }, { status: 500 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    let totalRestored = 0;
    let tablesAffected = 0;

    for (const tableName of Object.keys(databaseDump)) {
      const records = databaseDump[tableName];

      if (Array.isArray(records) && records.length > 0) {
        // Upsert data to avoid duplicates (relies on Primary Key 'id' existing in JSON)
        const { error } = await supabaseAdmin.from(tableName).upsert(records);
        
        if (error) {
          console.error(`Error restoring table ${tableName}:`, error);
          throw new Error(`Failed to restore table: ${tableName} (${error.message})`);
        } else {
          totalRestored += records.length;
          tablesAffected++;
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      totalRestored,
      tablesAffected
    });
  } catch (error: any) {
    console.error('Database restore error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to perform database restore from JSON.' }, { status: 500 });
  }
}
