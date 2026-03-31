import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('name');

    if (!fileName || !fileName.endsWith('.zip') || fileName.includes('..') || fileName.includes('/')) {
      return NextResponse.json({ error: 'Invalid file name' }, { status: 400 });
    }

    const backupsDir = path.join(process.cwd(), 'backups');
    const filePath = path.join(backupsDir, fileName);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Backup not found' }, { status: 404 });
    }

    const fileStream = fs.createReadStream(filePath);
    const stats = fs.statSync(filePath);

    return new NextResponse(fileStream as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': stats.size.toString(),
      },
    });
  } catch (error) {
    console.error('Error downloading backup:', error);
    return NextResponse.json({ error: 'Failed to download backup' }, { status: 500 });
  }
}
