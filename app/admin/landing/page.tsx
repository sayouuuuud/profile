"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Save, Rocket, BarChart3, FileText, Loader2 } from "lucide-react";

export default function AdminLandingPage() {
  const supabase = createClient();
  const [settings, setSettings] = useState<any>(null);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [brief, setBrief] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const [{ data: s }, { data: m }, { data: b }] = await Promise.all([
        supabase.from("site_settings").select("*").limit(1).single(),
        supabase.from("metrics").select("*").order("sort_order"),
        supabase.from("executive_brief").select("*").limit(1).single(),
      ]);
      if (s) setSettings(s);
      if (m) setMetrics(m);
      if (b) setBrief(b);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      if (settings) {
        await supabase.from("site_settings").update({
          hero_name: settings.hero_name,
          hero_subtitle: settings.hero_subtitle,
          hero_description: settings.hero_description,
          hero_role: settings.hero_role,
          hero_class: settings.hero_class,
          hero_status: settings.hero_status,
          hero_location: settings.hero_location,
          contact_email: settings.contact_email,
        }).eq("id", settings.id);
      }
      for (const m of metrics) {
        await supabase.from("metrics").update({
          title: m.title, value: m.value, suffix: m.suffix,
        }).eq("id", m.id);
      }
      if (brief) {
        await supabase.from("executive_brief").update({
          philosophy: brief.philosophy,
          operating_model: brief.operating_model,
          velocity_factor: brief.velocity_factor,
          summary: brief.summary,
        }).eq("id", brief.id);
      }
      setMessage("All changes saved successfully.");
    } catch {
      setMessage("Error saving changes.");
    }
    setSaving(false);
  }

  if (!settings) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="size-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-widest flex items-center gap-3">
              <Rocket className="size-6 text-primary" />
              LANDING PAGE CONTROL
            </h1>
            <p className="text-xs font-mono text-muted-foreground mt-1">Manage hero section, metrics, and executive brief</p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-background text-xs font-mono font-bold uppercase tracking-wider rounded transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {saving ? "Saving..." : "Deploy Changes"}
          </button>
        </div>
        {message && (
          <div className={`px-4 py-2 rounded text-xs font-mono border ${message.includes("Error") ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-primary/10 border-primary/30 text-primary"}`}>
            {message}
          </div>
        )}

        {/* Hero Section */}
        <section className="p-6 rounded border border-border bg-surface-dark/50 space-y-4">
          <h2 className="text-sm font-bold text-foreground tracking-widest flex items-center gap-2">
            <Rocket className="size-4 text-primary" /> HERO CONFIGURATION
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: "hero_name", label: "Name" },
              { key: "hero_subtitle", label: "Subtitle" },
              { key: "hero_role", label: "Role" },
              { key: "hero_class", label: "Class" },
              { key: "hero_status", label: "Status" },
              { key: "hero_location", label: "Location" },
              { key: "contact_email", label: "Email" },
            ].map(({ key, label }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{label}</label>
                <input
                  type="text"
                  value={settings[key] || ""}
                  onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                  className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Hero Description</label>
            <textarea
              value={settings.hero_description || ""}
              onChange={(e) => setSettings({ ...settings, hero_description: e.target.value })}
              rows={3}
              className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none transition-colors resize-none"
            />
          </div>
        </section>

        {/* Metrics */}
        <section className="p-6 rounded border border-border bg-surface-dark/50 space-y-4">
          <h2 className="text-sm font-bold text-foreground tracking-widest flex items-center gap-2">
            <BarChart3 className="size-4 text-amber-500" /> METRICS CONFIGURATION
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((m, i) => (
              <div key={m.id} className="p-4 rounded border border-border bg-background space-y-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Title</label>
                  <input
                    type="text"
                    value={m.title}
                    onChange={(e) => {
                      const updated = [...metrics];
                      updated[i] = { ...m, title: e.target.value };
                      setMetrics(updated);
                    }}
                    className="bg-surface-dark border border-border rounded px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Value</label>
                    <input
                      type="text"
                      value={m.value}
                      onChange={(e) => {
                        const updated = [...metrics];
                        updated[i] = { ...m, value: e.target.value };
                        setMetrics(updated);
                      }}
                      className="bg-surface-dark border border-border rounded px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Suffix</label>
                    <input
                      type="text"
                      value={m.suffix || ""}
                      onChange={(e) => {
                        const updated = [...metrics];
                        updated[i] = { ...m, suffix: e.target.value };
                        setMetrics(updated);
                      }}
                      className="bg-surface-dark border border-border rounded px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Executive Brief */}
        {brief && (
          <section className="p-6 rounded border border-border bg-surface-dark/50 space-y-4">
            <h2 className="text-sm font-bold text-foreground tracking-widest flex items-center gap-2">
              <FileText className="size-4 text-primary" /> EXECUTIVE BRIEF
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { key: "philosophy", label: "Philosophy" },
                { key: "operating_model", label: "Operating Model" },
                { key: "velocity_factor", label: "Velocity Factor" },
              ].map(({ key, label }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{label}</label>
                  <input
                    type="text"
                    value={brief[key] || ""}
                    onChange={(e) => setBrief({ ...brief, [key]: e.target.value })}
                    className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Summary</label>
              <textarea
                value={brief.summary || ""}
                onChange={(e) => setBrief({ ...brief, summary: e.target.value })}
                rows={4}
                className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none transition-colors resize-none"
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
