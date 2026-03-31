import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const projectRoot = process.cwd();
    const backupsDir = path.join(projectRoot, 'backups');

    if (!fs.existsSync(backupsDir)) {
      return NextResponse.json({ backups: [] });
    }

    const files = fs.readdirSync(backupsDir);
    const backups = files
      .filter(f => f.endsWith('.zip'))
      .map(file => {
        const stats = fs.statSync(path.join(backupsDir, file));
        return {
          name: file,
          size: stats.size,
          date: stats.birthtime.toISOString()
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ backups });
  } catch (error) {
    console.error('Error listing backups:', error);
    return NextResponse.json({ error: 'Failed to list backups' }, { status: 500 });
  }
}
