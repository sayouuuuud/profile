"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Save, GraduationCap, Plus, Trash2, Loader2 } from "lucide-react";

export default function AdminEducationPage() {
  const supabase = createClient();
  const [education, setEducation] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from("education").select("*").order("sort_order");
    setEducation(data || []);
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      for (const edu of education) {
        if (edu.id) {
          const { id, created_at, updated_at, ...rest } = edu;
          await supabase.from("education").update({ ...rest, updated_at: new Date().toISOString() }).eq("id", id);
        }
      }
      setMessage("Education saved.");
    } catch { setMessage("Error."); }
    setSaving(false);
  }

  async function addEducation() {
    const { data } = await supabase.from("education").insert({
      institution: "New Institution", degree: "", field_of_study: "", start_year: "", end_year: "", description: "", sort_order: education.length,
    }).select().single();
    if (data) setEducation([...education, data]);
  }

  async function deleteEducation(id: string) {
    if (!confirm("Delete?")) return;
    await supabase.from("education").delete().eq("id", id);
    setEducation(education.filter(e => e.id !== id));
  }

  if (loading) return <div className="flex-1 flex items-center justify-center"><Loader2 className="size-6 text-primary animate-spin" /></div>;

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground tracking-widest flex items-center gap-3">
            <GraduationCap className="size-6 text-primary" /> EDUCATION CONTROLLER
          </h1>
          <div className="flex gap-2">
            <button type="button" onClick={addEducation} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-dark hover:bg-foreground/5 text-foreground text-xs font-mono border border-border rounded transition-colors"><Plus className="size-3" /> Add</button>
            <button type="button" onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-1.5 bg-primary hover:bg-primary/90 text-background text-xs font-mono font-bold uppercase rounded transition-colors disabled:opacity-50">
              {saving ? <Loader2 className="size-3 animate-spin" /> : <Save className="size-3" />} Save
            </button>
          </div>
        </div>

        {message && <div className={`px-4 py-2 rounded text-xs font-mono border ${message.includes("Error") ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-primary/10 border-primary/30 text-primary"}`}>{message}</div>}

        {education.map((edu, i) => (
          <section key={edu.id} className="p-6 rounded border border-border bg-surface-dark/50 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-primary uppercase tracking-widest">EDUCATION_{String(i + 1).padStart(2, "0")}</span>
              <button type="button" onClick={() => deleteEducation(edu.id)} className="p-1 hover:bg-red-500/10 rounded text-red-400"><Trash2 className="size-3.5" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "institution", label: "Institution" },
                { key: "degree", label: "Degree" },
                { key: "field_of_study", label: "Field of Study" },
                { key: "grade", label: "Grade" },
                { key: "start_year", label: "Start Year" },
                { key: "end_year", label: "End Year" },
              ].map(({ key, label }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{label}</label>
                  <input
                    type="text"
                    value={edu[key] || ""}
                    onChange={(e) => { const u = [...education]; u[i] = { ...edu, [key]: e.target.value }; setEducation(u); }}
                    className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Description</label>
              <textarea
                value={edu.description || ""}
                onChange={(e) => { const u = [...education]; u[i] = { ...edu, description: e.target.value }; setEducation(u); }}
                rows={3}
                className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none transition-colors resize-none"
              />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
