"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Save, Rocket, BarChart3, FileText, Loader2, Brain, GitBranch, Plus, Trash2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/image-upload";

export default function AdminLandingPage() {
  const supabase = createClient();
  const [settings, setSettings] = useState<any>(null);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [brief, setBrief] = useState<any>(null);
  const [philosophy, setPhilosophy] = useState<any>(null);
  const [process, setProcess] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const [{ data: s }, { data: m }, { data: b }, { data: sections }] = await Promise.all([
        supabase.from("site_settings").select("*").limit(1).single(),
        supabase.from("metrics").select("*").order("sort_order"),
        supabase.from("executive_brief").select("*").limit(1).single(),
        supabase.from("landing_sections").select("*").in("section_key", ["product_philosophy", "process"]),
      ]);
      if (s) setSettings(s);
      if (m) setMetrics(m);
      if (b) setBrief(b);
      if (sections) {
        setPhilosophy(sections.find((s: any) => s.section_key === "product_philosophy"));
        setProcess(sections.find((s: any) => s.section_key === "process"));
      }
    }
    load();
  }, [supabase]);

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      if (settings) {
        const { error } = await supabase.from("site_settings").update({
          hero_name: settings.hero_name,
          hero_subtitle: settings.hero_subtitle,
          hero_description: settings.hero_description,
          hero_role: settings.hero_role,
          hero_class: settings.hero_class,
          hero_status: settings.hero_status,
          hero_location: settings.hero_location,
          hero_image_url: settings.hero_image_url,
          contact_email: settings.contact_email,
        }).eq("id", settings.id);
        if (error) throw error;
      }
      for (const m of metrics) {
        const { error } = await supabase.from("metrics").update({
          title: m.title, value: m.value, suffix: m.suffix,
        }).eq("id", m.id);
        if (error) throw error;
      }
      if (brief) {
        const { error } = await supabase.from("executive_brief").update({
          philosophy: brief.philosophy,
          operating_model: brief.operating_model,
          velocity_factor: brief.velocity_factor,
          summary: brief.summary,
        }).eq("id", brief.id);
        if (error) throw error;
      }
      if (philosophy) {
        const { error } = await supabase.from("landing_sections").update({
          content: philosophy.content,
        }).eq("id", philosophy.id);
        if (error) throw error;
      }
      if (process) {
        const { error } = await supabase.from("landing_sections").update({
          content: process.content,
        }).eq("id", process.id);
        if (error) throw error;
      }
      setMessage("All changes saved successfully.");
    } catch (err: any) {
      setMessage(err.message || "Error saving changes.");
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
            <p className="text-xs text-muted-foreground mt-1">Manage hero section, metrics, philosophy, and process</p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-background text-xs font-bold uppercase tracking-wider rounded transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {saving ? "Saving..." : "Deploy Changes"}
          </button>
        </div>
        {message && (
          <div className={`px-4 py-2 rounded text-xs border ${message.includes("Error") ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-primary/10 border-primary/30 text-primary"}`}>
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
                <label className="text-[10px] text-muted-foreground uppercase tracking-widest">{label}</label>
                <input
                  type="text"
                  value={settings[key] || ""}
                  onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                  className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-muted-foreground uppercase tracking-widest">Hero Description</label>
            <textarea
              value={settings.hero_description || ""}
              onChange={(e) => setSettings({ ...settings, hero_description: e.target.value })}
              rows={3}
              className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors resize-none"
            />
          </div>
          <ImageUpload
            label="Hero Image"
            value={settings.hero_image_url || ""}
            onChange={(url) => setSettings({ ...settings, hero_image_url: url })}
          />
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
                    className="bg-surface-dark border border-border rounded px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
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
                      className="bg-surface-dark border border-border rounded px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
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
                      className="bg-surface-dark border border-border rounded px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
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
                  <label className="text-[10px] text-muted-foreground uppercase tracking-widest">{label}</label>
                  <input
                    type="text"
                    value={brief[key] || ""}
                    onChange={(e) => setBrief({ ...brief, [key]: e.target.value })}
                    className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-muted-foreground uppercase tracking-widest">Summary</label>
              <textarea
                value={brief.summary || ""}
                onChange={(e) => setBrief({ ...brief, summary: e.target.value })}
                rows={4}
                className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors resize-none"
              />
            </div>
          </section>
        )}

        {/* Product Philosophy */}
        {philosophy && (
          <section className="p-6 rounded border border-border bg-surface-dark/50 space-y-4">
            <h2 className="text-sm font-bold text-foreground tracking-widest flex items-center gap-2">
              <Brain className="size-4 text-emerald-500" /> PRODUCT PHILOSOPHY
            </h2>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-muted-foreground uppercase tracking-widest">Manifesto Quote</label>
              <textarea
                value={philosophy.content.quote || ""}
                onChange={(e) => setPhilosophy({
                  ...philosophy,
                  content: { ...philosophy.content, quote: e.target.value }
                })}
                rows={3}
                className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors resize-none mb-4"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] text-muted-foreground uppercase tracking-widest">Principles</label>
              {philosophy.content.principles?.map((p: any, i: number) => (
                <div key={i} className="flex gap-4 p-4 rounded border border-border bg-background">
                  <div className="w-12 pt-2">
                    <input
                      type="text"
                      value={p.num}
                      onChange={(e) => {
                        const newPrinciples = [...philosophy.content.principles];
                        newPrinciples[i] = { ...p, num: e.target.value };
                        setPhilosophy({ ...philosophy, content: { ...philosophy.content, principles: newPrinciples } });
                      }}
                      className="w-full bg-surface-dark border border-border rounded px-2 py-1 text-xs text-center font-mono"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={p.title}
                      onChange={(e) => {
                        const newPrinciples = [...philosophy.content.principles];
                        newPrinciples[i] = { ...p, title: e.target.value };
                        setPhilosophy({ ...philosophy, content: { ...philosophy.content, principles: newPrinciples } });
                      }}
                      className="w-full bg-surface-dark border border-border rounded px-3 py-2 text-sm font-bold"
                    />
                    <textarea
                      value={p.description}
                      onChange={(e) => {
                        const newPrinciples = [...philosophy.content.principles];
                        newPrinciples[i] = { ...p, description: e.target.value };
                        setPhilosophy({ ...philosophy, content: { ...philosophy.content, principles: newPrinciples } });
                      }}
                      rows={2}
                      className="w-full bg-surface-dark border border-border rounded px-3 py-2 text-sm resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Workflow / Process */}
        {process && (
          <section className="p-6 rounded border border-border bg-surface-dark/50 space-y-4">
            <h2 className="text-sm font-bold text-foreground tracking-widest flex items-center gap-2">
              <GitBranch className="size-4 text-emerald-500" /> WORKFLOW STEPS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {process.content.steps?.map((step: any, i: number) => (
                <div key={step.id} className="p-4 rounded border border-border bg-background space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-emerald-500 uppercase">{step.id}</span>
                    <select
                      value={step.direction}
                      onChange={(e) => {
                        const newSteps = [...process.content.steps];
                        newSteps[i] = { ...step, direction: e.target.value };
                        setProcess({ ...process, content: { ...process.content, steps: newSteps } });
                      }}
                      className="bg-surface-dark border border-border rounded px-2 py-1 text-xs"
                    >
                      <option value="up">UP</option>
                      <option value="down">DOWN</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-widest">Label</label>
                    <input
                      type="text"
                      value={step.label}
                      onChange={(e) => {
                        const newSteps = [...process.content.steps];
                        newSteps[i] = { ...step, label: e.target.value };
                        setProcess({ ...process, content: { ...process.content, steps: newSteps } });
                      }}
                      className="w-full bg-surface-dark border border-border rounded px-3 py-2 text-sm font-bold mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-widest">Description</label>
                    <input
                      type="text"
                      value={step.description}
                      onChange={(e) => {
                        const newSteps = [...process.content.steps];
                        newSteps[i] = { ...step, description: e.target.value };
                        setProcess({ ...process, content: { ...process.content, steps: newSteps } });
                      }}
                      className="w-full bg-surface-dark border border-border rounded px-3 py-2 text-sm mt-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
