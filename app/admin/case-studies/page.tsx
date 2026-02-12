"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Save, BookOpen, Plus, Trash2, Loader2, Eye, EyeOff } from "lucide-react";

export default function AdminCaseStudies() {
  const supabase = createClient();
  const [studies, setStudies] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudies();
  }, []);

  async function loadStudies() {
    const { data } = await supabase.from("case_studies").select("*").order("sort_order");
    setStudies(data || []);
    setLoading(false);
  }

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    setMessage("");
    try {
      const { id, created_at, updated_at, ...rest } = selected;
      if (id) {
        await supabase.from("case_studies").update({ ...rest, updated_at: new Date().toISOString() }).eq("id", id);
      } else {
        await supabase.from("case_studies").insert(rest);
      }
      await loadStudies();
      setMessage("Case study saved.");
    } catch {
      setMessage("Error saving.");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this case study?")) return;
    await supabase.from("case_studies").delete().eq("id", id);
    setSelected(null);
    await loadStudies();
  }

  function addNew() {
    setSelected({
      slug: "", title: "", subtitle: "", client: "", category: "", status: "COMPLETED",
      duration: "", team_size: "", summary: "", challenge: "", solution: "", impact: "",
      tags: [], metrics: [], tech_stack: [], is_featured: false, is_visible: true, sort_order: studies.length,
    });
  }

  if (loading) {
    return <div className="flex-1 flex items-center justify-center"><Loader2 className="size-6 text-primary animate-spin" /></div>;
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* List Panel */}
      <div className="w-80 border-r border-border flex flex-col shrink-0 overflow-y-auto bg-surface-dark/30">
        <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-surface-dark/80 z-10" style={{ backdropFilter: "blur(12px)" }}>
          <h2 className="text-sm font-bold text-foreground tracking-widest flex items-center gap-2">
            <BookOpen className="size-4 text-primary" /> MISSIONS
          </h2>
          <button type="button" onClick={addNew} className="p-1.5 hover:bg-primary/10 rounded transition-colors text-primary">
            <Plus className="size-4" />
          </button>
        </div>
        <div className="flex-1">
          {studies.map((cs) => (
            <button
              key={cs.id}
              type="button"
              onClick={() => setSelected(cs)}
              className={`w-full text-left px-4 py-3 border-b border-border hover:bg-foreground/5 transition-colors ${selected?.id === cs.id ? "bg-primary/10 border-l-2 border-l-primary" : ""}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-foreground truncate">{cs.title}</h3>
                {cs.is_visible ? <Eye className="size-3 text-primary shrink-0" /> : <EyeOff className="size-3 text-muted-foreground shrink-0" />}
              </div>
              <p className="text-[10px] text-muted-foreground font-mono truncate mt-0.5">{cs.category}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Edit Panel */}
      <div className="flex-1 overflow-y-auto p-6">
        {!selected ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <BookOpen className="size-12 mb-4 opacity-20" />
            <p className="text-sm font-mono">Select a mission to edit or create a new one</p>
          </div>
        ) : (
          <div className="max-w-3xl space-y-6 pb-20">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground tracking-widest">
                {selected.id ? "EDIT MISSION" : "NEW MISSION"}
              </h2>
              <div className="flex gap-2">
                {selected.id && (
                  <button type="button" onClick={() => handleDelete(selected.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-mono border border-red-500/30 rounded transition-colors">
                    <Trash2 className="size-3" /> Delete
                  </button>
                )}
                <button type="button" onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-1.5 bg-primary hover:bg-primary/90 text-background text-xs font-mono font-bold uppercase tracking-wider rounded transition-colors disabled:opacity-50">
                  {saving ? <Loader2 className="size-3 animate-spin" /> : <Save className="size-3" />}
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>

            {message && (
              <div className={`px-4 py-2 rounded text-xs font-mono border ${message.includes("Error") ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-primary/10 border-primary/30 text-primary"}`}>
                {message}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "title", label: "Title" },
                { key: "slug", label: "Slug" },
                { key: "subtitle", label: "Subtitle" },
                { key: "client", label: "Client" },
                { key: "category", label: "Category" },
                { key: "status", label: "Status" },
                { key: "duration", label: "Duration" },
                { key: "team_size", label: "Team Size" },
              ].map(({ key, label }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{label}</label>
                  <input
                    type="text"
                    value={selected[key] || ""}
                    onChange={(e) => setSelected({ ...selected, [key]: e.target.value })}
                    className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              ))}
            </div>

            {["summary", "challenge", "solution", "impact"].map((key) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{key}</label>
                <textarea
                  value={selected[key] || ""}
                  onChange={(e) => setSelected({ ...selected, [key]: e.target.value })}
                  rows={3}
                  className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none transition-colors resize-none"
                />
              </div>
            ))}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{"Tech Stack (comma-separated)"}</label>
              <input
                type="text"
                value={(selected.tech_stack || []).join(", ")}
                onChange={(e) => setSelected({ ...selected, tech_stack: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) })}
                className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={selected.is_featured || false} onChange={(e) => setSelected({ ...selected, is_featured: e.target.checked })} className="accent-primary" />
                <span className="text-xs font-mono text-muted-foreground uppercase">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={selected.is_visible !== false} onChange={(e) => setSelected({ ...selected, is_visible: e.target.checked })} className="accent-primary" />
                <span className="text-xs font-mono text-muted-foreground uppercase">Visible</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
