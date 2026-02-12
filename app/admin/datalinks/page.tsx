"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Save, Link2, Plus, Trash2, Loader2, Globe } from "lucide-react";

export default function AdminDatalinksPage() {
  const supabase = createClient();
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [datalinks, setDatalinks] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    const [{ data: sl }, { data: dl }] = await Promise.all([
      supabase.from("social_links").select("*").order("sort_order"),
      supabase.from("datalinks").select("*").order("sort_order"),
    ]);
    setSocialLinks(sl || []);
    setDatalinks(dl || []);
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      for (const link of socialLinks) {
        if (link.id) {
          const { id, created_at, updated_at, ...rest } = link;
          await supabase.from("social_links").update({ ...rest, updated_at: new Date().toISOString() }).eq("id", id);
        }
      }
      for (const dl of datalinks) {
        if (dl.id) {
          const { id, created_at, updated_at, ...rest } = dl;
          await supabase.from("datalinks").update({ ...rest, updated_at: new Date().toISOString() }).eq("id", id);
        }
      }
      setMessage("Datalinks saved.");
    } catch { setMessage("Error."); }
    setSaving(false);
  }

  async function addSocialLink() {
    const { data } = await supabase.from("social_links").insert({ platform: "New Platform", url: "", icon: "", sort_order: socialLinks.length }).select().single();
    if (data) setSocialLinks([...socialLinks, data]);
  }

  async function deleteSocialLink(id: string) {
    await supabase.from("social_links").delete().eq("id", id);
    setSocialLinks(socialLinks.filter(l => l.id !== id));
  }

  async function addDatalink() {
    const { data } = await supabase.from("datalinks").insert({ section: "general", label: "New Link", url: "", sort_order: datalinks.length }).select().single();
    if (data) setDatalinks([...datalinks, data]);
  }

  async function deleteDatalink(id: string) {
    await supabase.from("datalinks").delete().eq("id", id);
    setDatalinks(datalinks.filter(d => d.id !== id));
  }

  if (loading) return <div className="flex-1 flex items-center justify-center"><Loader2 className="size-6 text-primary animate-spin" /></div>;

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground tracking-widest flex items-center gap-3">
            <Link2 className="size-6 text-primary" /> SYSTEM DATALINKS
          </h1>
          <button type="button" onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-background text-xs font-mono font-bold uppercase tracking-wider rounded transition-colors disabled:opacity-50">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Save
          </button>
        </div>

        {message && <div className={`px-4 py-2 rounded text-xs font-mono border ${message.includes("Error") ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-primary/10 border-primary/30 text-primary"}`}>{message}</div>}

        {/* Social Links */}
        <section className="p-6 rounded border border-border bg-surface-dark/50 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground tracking-widest flex items-center gap-2">
              <Globe className="size-4 text-primary" /> SOCIAL LINKS MATRIX
            </h2>
            <button type="button" onClick={addSocialLink} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-dark hover:bg-foreground/5 text-foreground text-xs font-mono border border-border rounded transition-colors"><Plus className="size-3" /> Add</button>
          </div>
          <div className="space-y-3">
            {socialLinks.map((link, i) => (
              <div key={link.id} className="flex items-center gap-3 p-3 rounded bg-background border border-border">
                <input type="text" value={link.platform} onChange={(e) => { const u = [...socialLinks]; u[i] = { ...link, platform: e.target.value }; setSocialLinks(u); }} placeholder="Platform" className="bg-transparent text-sm text-foreground font-mono focus:outline-none w-32" />
                <input type="text" value={link.url} onChange={(e) => { const u = [...socialLinks]; u[i] = { ...link, url: e.target.value }; setSocialLinks(u); }} placeholder="URL" className="bg-transparent flex-1 text-sm text-foreground font-mono focus:outline-none" />
                <input type="text" value={link.icon || ""} onChange={(e) => { const u = [...socialLinks]; u[i] = { ...link, icon: e.target.value }; setSocialLinks(u); }} placeholder="Icon" className="bg-transparent text-sm text-foreground font-mono focus:outline-none w-24" />
                <button type="button" onClick={() => deleteSocialLink(link.id)} className="p-1 hover:bg-red-500/10 rounded text-red-400"><Trash2 className="size-3.5" /></button>
              </div>
            ))}
          </div>
        </section>

        {/* Datalinks */}
        <section className="p-6 rounded border border-border bg-surface-dark/50 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground tracking-widest flex items-center gap-2">
              <Link2 className="size-4 text-amber-500" /> DATALINKS
            </h2>
            <button type="button" onClick={addDatalink} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-dark hover:bg-foreground/5 text-foreground text-xs font-mono border border-border rounded transition-colors"><Plus className="size-3" /> Add</button>
          </div>
          <div className="space-y-3">
            {datalinks.map((dl, i) => (
              <div key={dl.id} className="flex items-center gap-3 p-3 rounded bg-background border border-border">
                <input type="text" value={dl.section} onChange={(e) => { const u = [...datalinks]; u[i] = { ...dl, section: e.target.value }; setDatalinks(u); }} placeholder="Section" className="bg-transparent text-sm text-foreground font-mono focus:outline-none w-28" />
                <input type="text" value={dl.label} onChange={(e) => { const u = [...datalinks]; u[i] = { ...dl, label: e.target.value }; setDatalinks(u); }} placeholder="Label" className="bg-transparent text-sm text-foreground font-mono focus:outline-none w-32" />
                <input type="text" value={dl.url || ""} onChange={(e) => { const u = [...datalinks]; u[i] = { ...dl, url: e.target.value }; setDatalinks(u); }} placeholder="URL" className="bg-transparent flex-1 text-sm text-foreground font-mono focus:outline-none" />
                <button type="button" onClick={() => deleteDatalink(dl.id)} className="p-1 hover:bg-red-500/10 rounded text-red-400"><Trash2 className="size-3.5" /></button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
