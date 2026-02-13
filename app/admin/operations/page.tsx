"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Save, Briefcase, Plus, Trash2, Loader2 } from "lucide-react";

export default function AdminOperationsPage() {
  const supabase = createClient();
  const [operations, setOperations] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from("operations").select("*").order("sort_order");
    setOperations(data || []);
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      for (const op of operations) {
        if (op.id) {
          const { id, created_at, updated_at, ...rest } = op;
          const { error } = await supabase.from("operations").update({ ...rest, updated_at: new Date().toISOString() }).eq("id", id);
          if (error) throw error;
        }
      }
      setMessage("Operations saved.");
    } catch (err: any) { setMessage(err.message || "Error saving."); }
    setSaving(false);
  }

  async function addOperation() {
    const { data } = await supabase.from("operations").insert({
      title: "New Position", company: "", location: "", start_date: "", end_date: "", description: "", status: "COMPLETED", sort_order: operations.length, tags: [],
    }).select().single();
    if (data) setOperations([...operations, data]);
  }

  async function deleteOperation(id: string) {
    if (!confirm("Delete this operation?")) return;
    await supabase.from("operations").delete().eq("id", id);
    setOperations(operations.filter(o => o.id !== id));
  }

  if (loading) return <div className="flex-1 flex items-center justify-center"><Loader2 className="size-6 text-primary animate-spin" /></div>;

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground tracking-widest flex items-center gap-3">
            <Briefcase className="size-6 text-primary" /> OPERATIONS TIMELINE
          </h1>
          <div className="flex gap-2">
            <button type="button" onClick={addOperation} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-dark hover:bg-foreground/5 text-foreground text-xs font-mono border border-border rounded transition-colors"><Plus className="size-3" /> Add</button>
            <button type="button" onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-1.5 bg-primary hover:bg-primary/90 text-background text-xs font-mono font-bold uppercase rounded transition-colors disabled:opacity-50">
              {saving ? <Loader2 className="size-3 animate-spin" /> : <Save className="size-3" />} Save
            </button>
          </div>
        </div>

        {message && <div className={`px-4 py-2 rounded text-xs font-mono border ${message.includes("Error") ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-primary/10 border-primary/30 text-primary"}`}>{message}</div>}

        {operations.map((op, i) => (
          <section key={op.id} className="p-6 rounded border border-border bg-surface-dark/50 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-primary uppercase tracking-widest">OPERATION_{String(i + 1).padStart(2, "0")}</span>
              <button type="button" onClick={() => deleteOperation(op.id)} className="p-1 hover:bg-red-500/10 rounded text-red-400"><Trash2 className="size-3.5" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "title", label: "Title" },
                { key: "company", label: "Company" },
                { key: "location", label: "Location" },
                { key: "status", label: "Status" },
                { key: "start_date", label: "Start Date" },
                { key: "end_date", label: "End Date" },
              ].map(({ key, label }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{label}</label>
                  <input
                    type="text"
                    value={op[key] || ""}
                    onChange={(e) => { const u = [...operations]; u[i] = { ...op, [key]: e.target.value }; setOperations(u); }}
                    className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Description</label>
              <textarea
                value={op.description || ""}
                onChange={(e) => { const u = [...operations]; u[i] = { ...op, description: e.target.value }; setOperations(u); }}
                rows={3}
                className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none transition-colors resize-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{"Tags (comma-separated)"}</label>
              <input
                type="text"
                value={(op.tags || []).join(", ")}
                onChange={(e) => { const u = [...operations]; u[i] = { ...op, tags: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) }; setOperations(u); }}
                className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
