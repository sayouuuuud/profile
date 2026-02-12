"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Save, Wrench, Plus, Trash2, Loader2 } from "lucide-react";

export default function AdminSkillsPage() {
  const supabase = createClient();
  const [categories, setCategories] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    const [{ data: cats }, { data: sk }] = await Promise.all([
      supabase.from("skill_categories").select("*").order("sort_order"),
      supabase.from("skills").select("*").order("sort_order"),
    ]);
    setCategories(cats || []);
    setSkills(sk || []);
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      for (const cat of categories) {
        if (cat.id) {
          await supabase.from("skill_categories").update({ name: cat.name, proficiency: cat.proficiency, sort_order: cat.sort_order }).eq("id", cat.id);
        }
      }
      for (const sk of skills) {
        if (sk.id) {
          await supabase.from("skills").update({ name: sk.name, level: sk.level, sort_order: sk.sort_order }).eq("id", sk.id);
        }
      }
      setMessage("Skills saved.");
    } catch { setMessage("Error."); }
    setSaving(false);
  }

  async function addCategory() {
    const { data } = await supabase.from("skill_categories").insert({ name: "New Category", proficiency: 50, sort_order: categories.length }).select().single();
    if (data) setCategories([...categories, data]);
  }

  async function addSkill(categoryId: string) {
    const { data } = await supabase.from("skills").insert({ category_id: categoryId, name: "New Skill", level: 50, sort_order: skills.filter(s => s.category_id === categoryId).length }).select().single();
    if (data) setSkills([...skills, data]);
  }

  async function deleteSkill(id: string) {
    await supabase.from("skills").delete().eq("id", id);
    setSkills(skills.filter(s => s.id !== id));
  }

  async function deleteCategory(id: string) {
    if (!confirm("Delete category and all its skills?")) return;
    await supabase.from("skill_categories").delete().eq("id", id);
    setCategories(categories.filter(c => c.id !== id));
    setSkills(skills.filter(s => s.category_id !== id));
  }

  if (loading) return <div className="flex-1 flex items-center justify-center"><Loader2 className="size-6 text-primary animate-spin" /></div>;

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground tracking-widest flex items-center gap-3">
            <Wrench className="size-6 text-primary" /> SKILLS MATRIX
          </h1>
          <div className="flex gap-2">
            <button type="button" onClick={addCategory} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-dark hover:bg-foreground/5 text-foreground text-xs font-mono border border-border rounded transition-colors">
              <Plus className="size-3" /> Category
            </button>
            <button type="button" onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-1.5 bg-primary hover:bg-primary/90 text-background text-xs font-mono font-bold uppercase rounded transition-colors disabled:opacity-50">
              {saving ? <Loader2 className="size-3 animate-spin" /> : <Save className="size-3" />} Save
            </button>
          </div>
        </div>

        {message && <div className={`px-4 py-2 rounded text-xs font-mono border ${message.includes("Error") ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-primary/10 border-primary/30 text-primary"}`}>{message}</div>}

        {categories.map((cat, ci) => (
          <section key={cat.id} className="p-6 rounded border border-border bg-surface-dark/50 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="text"
                  value={cat.name}
                  onChange={(e) => { const u = [...categories]; u[ci] = { ...cat, name: e.target.value }; setCategories(u); }}
                  className="bg-transparent border-b border-border text-foreground font-bold text-sm tracking-widest focus:border-primary focus:outline-none transition-colors"
                />
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground">Proficiency:</span>
                  <input
                    type="number" min="0" max="100"
                    value={cat.proficiency || 0}
                    onChange={(e) => { const u = [...categories]; u[ci] = { ...cat, proficiency: parseInt(e.target.value) || 0 }; setCategories(u); }}
                    className="bg-background border border-border rounded px-2 py-1 text-xs text-foreground font-mono w-16 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => addSkill(cat.id)} className="p-1 hover:bg-primary/10 rounded text-primary"><Plus className="size-3.5" /></button>
                <button type="button" onClick={() => deleteCategory(cat.id)} className="p-1 hover:bg-red-500/10 rounded text-red-400"><Trash2 className="size-3.5" /></button>
              </div>
            </div>
            <div className="space-y-2">
              {skills.filter(s => s.category_id === cat.id).map((sk, si) => (
                <div key={sk.id} className="flex items-center gap-3 p-3 rounded bg-background border border-border">
                  <input
                    type="text"
                    value={sk.name}
                    onChange={(e) => { const u = [...skills]; const idx = u.findIndex(s => s.id === sk.id); u[idx] = { ...sk, name: e.target.value }; setSkills(u); }}
                    className="bg-transparent flex-1 text-sm text-foreground font-mono focus:outline-none"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="range" min="0" max="100"
                      value={sk.level || 0}
                      onChange={(e) => { const u = [...skills]; const idx = u.findIndex(s => s.id === sk.id); u[idx] = { ...sk, level: parseInt(e.target.value) }; setSkills(u); }}
                      className="w-24 accent-primary"
                    />
                    <span className="text-xs font-mono text-primary w-8 text-right">{sk.level}%</span>
                  </div>
                  <button type="button" onClick={() => deleteSkill(sk.id)} className="p-1 hover:bg-red-500/10 rounded text-red-400"><Trash2 className="size-3" /></button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
