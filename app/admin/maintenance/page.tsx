"use client";

import { useState, useRef } from "react";
import { Wrench, Database, Download, AlertTriangle, Loader2, RefreshCw, Upload } from "lucide-react";
import { toast } from "sonner";

export default function MaintenancePage() {
  const [clearingCache, setClearingCache] = useState(false);
  const [backingUpDb, setBackingUpDb] = useState(false);
  const [restoring, setRestoring] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleClearCache() {
    setClearingCache(true);
    try {
      const res = await fetch("/api/admin/maintenance/clear-cache", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        toast.success("Application cache cleared successfully!");
      } else {
        toast.error(data.error || "Failed to clear cache");
      }
    } catch (e) {
      toast.error("Network error while clearing cache");
    }
    setClearingCache(false);
  }

  async function handleBackupDatabase() {
    setBackingUpDb(true);
    try {
      const res = await fetch("/api/admin/maintenance/backup/database", { method: "POST" });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const contentDisposition = res.headers.get('Content-Disposition');
        let filename = 'database-backup.json';
        if (contentDisposition && contentDisposition.includes('filename=')) {
          filename = contentDisposition.split('filename="')[1].split('"')[0];
        }
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("Database backup downloaded!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to backup database.");
      }
    } catch (e) {
      toast.error("Network error while backing up database.");
    }
    setBackingUpDb(false);
  }

  async function handleRestoreDatabase(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      toast.error("Please upload a valid .json backup file.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (!confirm("Are you sure you want to restore the database from this JSON file? Existing records with the same IDs will be overwritten.")) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setRestoring(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/maintenance/restore-db", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success(`Database restored successfully! Updated ${data.totalRestored} records across ${data.tablesAffected} tables.`);
      } else {
        toast.error(`Restore failed: ${data.error}`);
      }
    } catch (err) {
      toast.error("Network error during restore.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
      setRestoring(false);
    }
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        <div className="flex items-center gap-3 mb-6">
          <Wrench className="size-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground tracking-widest uppercase">System Maintenance</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Cache Management */}
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-border/50 pb-3">
              <RefreshCw className="size-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-foreground">Cache Status</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Clear the Next.js cache to immediately apply any manual database changes or static page regeneration.
            </p>
            <div className="mt-auto pt-4 flex">
              <button
                onClick={handleClearCache}
                disabled={clearingCache}
                className="flex items-center justify-center gap-2 px-4 py-2 w-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {clearingCache ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
                Purge All Caches
              </button>
            </div>
          </div>

          {/* Backup Database */}
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-border/50 pb-3">
              <Database className="size-5 text-indigo-500" />
              <h2 className="text-lg font-semibold text-foreground">Database Backup</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Extract all database tables and download them securely as a structured JSON file.
            </p>
            <div className="mt-auto pt-4 flex">
              <button
                onClick={handleBackupDatabase}
                disabled={backingUpDb}
                className="flex items-center justify-center gap-2 px-4 py-2 w-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {backingUpDb ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
                Download Database (.json)
              </button>
            </div>
          </div>
          
          {/* Restore Database */}
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm flex flex-col gap-4 md:col-span-2">
            <div className="flex items-center gap-2 border-b border-border/50 pb-3">
              <Upload className="size-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-foreground">Restore Database</h2>
            </div>
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-md p-4 flex gap-3 text-sm text-blue-400">
              <AlertTriangle className="size-5 shrink-0" />
              <p>Upload a previously downloaded <strong>.json database backup file</strong> to perform a database restoration. Missing or changed data will be accurately retrieved based on Primary IDs.</p>
            </div>
            
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleRestoreDatabase} 
            />
            
            <div className="pt-2 flex">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={restoring}
                className="flex items-center justify-center gap-2 px-4 py-3 w-full border-2 border-dashed border-blue-500/50 hover:bg-blue-500/10 text-blue-500 font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {restoring ? <Loader2 className="size-5 animate-spin" /> : <Upload className="size-5" />}
                {restoring ? "Restoring Database..." : "Select .json Backup File to Restore DB"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
