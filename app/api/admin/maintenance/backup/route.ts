import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import archiver from 'archiver';

export async function POST() {
  try {
    const projectRoot = process.cwd();
    const backupsDir = path.join(projectRoot, 'backups');

    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `source-code-${timestamp}.zip`;
    const backupFilePath = path.join(backupsDir, backupFileName);

    await new Promise((resolve, reject) => {
      const output = fs.createWriteStream(backupFilePath);
      const archive = archiver('zip', {
        zlib: { level: 5 } // Moderate compression
      });

      output.on('close', function() {
        resolve(true);
      });

      archive.on('error', function(err) {
        reject(err);
      });

      archive.pipe(output);

      // Exclude large or unnecessary directories
      archive.glob('**/*', {
        cwd: projectRoot,
        ignore: [
          'node_modules/**',
          '.next/**',
          '.git/**',
          'backups/**',
          'profile.zip'
        ],
        dot: true
      });

      archive.finalize();
    });

    return NextResponse.json({ success: true, message: 'Source code backup created', file: backupFileName });
  } catch (error: any) {
    console.error('Backup error:', error);
    return NextResponse.json({ error: 'Failed to create backup: ' + error?.message }, { status: 500 });
  }
}
