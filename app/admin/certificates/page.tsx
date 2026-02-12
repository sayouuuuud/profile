"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Save, Award, Plus, Trash2, Loader2 } from "lucide-react";

export default function AdminCertificatesPage() {
  const supabase = createClient();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from("certificates").select("*").order("sort_order");
    setCertificates(data || []);
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      for (const cert of certificates) {
        if (cert.id) {
          const { id, created_at, updated_at, ...rest } = cert;
          await supabase.from("certificates").update({ ...rest, updated_at: new Date().toISOString() }).eq("id", id);
        }
      }
      setMessage("Certificates saved.");
    } catch { setMessage("Error."); }
    setSaving(false);
  }

  async function addCertificate() {
    const { data } = await supabase.from("certificates").insert({
      title: "New Certificate", issuer: "", issue_date: "", category: "", sort_order: certificates.length,
    }).select().single();
    if (data) setCertificates([...certificates, data]);
  }

  async function deleteCertificate(id: string) {
    await supabase.from("certificates").delete().eq("id", id);
    setCertificates(certificates.filter(c => c.id !== id));
  }

  if (loading) return <div className="flex-1 flex items-center justify-center"><Loader2 className="size-6 text-primary animate-spin" /></div>;

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground tracking-widest flex items-center gap-3">
            <Award className="size-6 text-primary" /> CERTIFICATE VAULT
          </h1>
          <div className="flex gap-2">
            <button type="button" onClick={addCertificate} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-dark hover:bg-foreground/5 text-foreground text-xs font-mono border border-border rounded transition-colors"><Plus className="size-3" /> Add</button>
            <button type="button" onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-1.5 bg-primary hover:bg-primary/90 text-background text-xs font-mono font-bold uppercase rounded transition-colors disabled:opacity-50">
              {saving ? <Loader2 className="size-3 animate-spin" /> : <Save className="size-3" />} Save
            </button>
          </div>
        </div>

        {message && <div className={`px-4 py-2 rounded text-xs font-mono border ${message.includes("Error") ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-primary/10 border-primary/30 text-primary"}`}>{message}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map((cert, i) => (
            <div key={cert.id} className="p-5 rounded border border-border bg-surface-dark/50 space-y-3 relative group">
              <button type="button" onClick={() => deleteCertificate(cert.id)} className="absolute top-3 right-3 p-1 hover:bg-red-500/10 rounded text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="size-3.5" /></button>
              {[
                { key: "title", label: "Title" },
                { key: "issuer", label: "Issuer" },
                { key: "issue_date", label: "Issue Date" },
                { key: "category", label: "Category" },
                { key: "credential_id", label: "Credential ID" },
                { key: "credential_url", label: "Credential URL" },
              ].map(({ key, label }) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{label}</label>
                  <input
                    type="text"
                    value={cert[key] || ""}
                    onChange={(e) => { const u = [...certificates]; u[i] = { ...cert, [key]: e.target.value }; setCertificates(u); }}
                    className="bg-background border border-border rounded px-3 py-1.5 text-sm text-foreground font-mono focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
