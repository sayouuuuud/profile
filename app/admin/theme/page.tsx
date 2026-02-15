"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Save, Palette, Loader2 } from "lucide-react";

export default function AdminThemePage() {
  const supabase = createClient();
  const [theme, setTheme] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("theme_settings").select("*").limit(1).single();
      if (data) setTheme(data);
    }
    load();
  }, []);

  async function handleSave() {
    if (!theme) return;
    setSaving(true);
    try {
      const { id, ...rest } = theme;
      const { error } = await supabase.from("theme_settings").update({ ...rest, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
      setMessage("Theme saved.");
    } catch (err: any) { setMessage(err.message || "Error saving."); }
    setSaving(false);
  }

  if (!theme) return <div className="flex-1 flex items-center justify-center"><Loader2 className="size-6 text-primary animate-spin" /></div>;

  const colorFields = [
    { key: "primary_color", label: "Primary Color" },
    { key: "accent_color", label: "Accent Color" },
    { key: "gold_color", label: "Gold Color" },
    { key: "background_color", label: "Background" },
    { key: "surface_color", label: "Surface" },
    { key: "border_color", label: "Border" },
  ];

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground tracking-widest flex items-center gap-3">
            <Palette className="size-6 text-primary" /> THEME CONTROL
          </h1>
          <button type="button" onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-background text-xs font-bold uppercase tracking-wider rounded transition-colors disabled:opacity-50">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {saving ? "Saving..." : "Deploy Theme"}
          </button>
        </div>

        {message && <div className={`px-4 py-2 rounded text-xs border ${message.includes("Error") ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-primary/10 border-primary/30 text-primary"}`}>{message}</div>}

        {/* Color Matrix */}
        <section className="p-6 rounded border border-border bg-surface-dark/50 space-y-6">
          <h2 className="text-sm font-bold text-foreground tracking-widest">COLOR MATRIX</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colorFields.map(({ key, label }) => (
              <div key={key} className="space-y-2">
                <label className="text-[10px] text-muted-foreground uppercase tracking-widest">{label}</label>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="color"
                      value={theme[key] || "#000000"}
                      onChange={(e) => setTheme({ ...theme, [key]: e.target.value })}
                      className="size-12 rounded border border-border cursor-pointer bg-transparent"
                    />
                  </div>
                  <input
                    type="text"
                    value={theme[key] || ""}
                    onChange={(e) => setTheme({ ...theme, [key]: e.target.value })}
                    className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors flex-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section className="p-6 rounded border border-border bg-surface-dark/50 space-y-6">
          <h2 className="text-sm font-bold text-foreground tracking-widest">TYPOGRAPHY ENGINE</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] text-muted-foreground uppercase tracking-widest">Display Font</label>
              <input
                type="text"
                value={theme.font_display || ""}
                onChange={(e) => setTheme({ ...theme, font_display: e.target.value })}
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
              />
              <p className="text-[10px] text-muted-foreground">Used for headings and UI labels</p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-muted-foreground uppercase tracking-widest">Serif Font</label>
              <input
                type="text"
                value={theme.font_serif || ""}
                onChange={(e) => setTheme({ ...theme, font_serif: e.target.value })}
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
              />
              <p className="text-[10px] text-muted-foreground">Used for decorative headings</p>
            </div>
          </div>
        </section>

        {/* Preview */}
        <section className="p-6 rounded border border-border space-y-4" style={{ background: theme.background_color }}>
          <h2 className="text-sm font-bold tracking-widest" style={{ color: theme.primary_color }}>LIVE PREVIEW</h2>
          <div className="p-4 rounded border" style={{ borderColor: theme.border_color, background: theme.surface_color }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: "#ffffff" }}>Sample Heading</h3>
            <p className="text-sm" style={{ color: "#9ca3af" }}>This is how your theme will look with the selected colors and typography settings.</p>
            <div className="flex gap-2 mt-4">
              <span className="px-3 py-1 rounded text-xs" style={{ background: `${theme.primary_color}20`, color: theme.primary_color, border: `1px solid ${theme.primary_color}40` }}>Primary</span>
              <span className="px-3 py-1 rounded text-xs" style={{ background: `${theme.accent_color}20`, color: theme.accent_color, border: `1px solid ${theme.accent_color}40` }}>Accent</span>
              <span className="px-3 py-1 rounded text-xs" style={{ background: `${theme.gold_color}20`, color: theme.gold_color, border: `1px solid ${theme.gold_color}40` }}>Gold</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
