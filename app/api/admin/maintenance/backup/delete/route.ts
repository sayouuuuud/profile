import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('name');

    if (!fileName || !fileName.endsWith('.zip') || fileName.includes('..') || fileName.includes('/')) {
      return NextResponse.json({ error: 'Invalid backup filename' }, { status: 400 });
    }

    const backupsDir = path.join(process.cwd(), 'backups');
    const filePath = path.join(backupsDir, fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return NextResponse.json({ success: true, message: 'Backup deleted successfully' });
    } else {
      return NextResponse.json({ error: 'Backup not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting backup:', error);
    return NextResponse.json({ error: 'Failed to delete backup' }, { status: 500 });
  }
}
