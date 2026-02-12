"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import {
  Save, BookOpen, Plus, Trash2, Loader2, Eye, EyeOff,
  ChevronDown, ChevronUp, GripVertical, X, ArrowUp, ArrowDown,
  PieChart, BarChart3, BarChart, XCircle, CheckCircle, Network, Terminal, Shield,
  TrendingUp, GitBranch, Columns, Workflow, Gauge, Activity, Zap, AlignLeft
} from "lucide-react"
import { BLOCK_REGISTRY, getBlocksByCategory, type BlockWidth } from "@/lib/block-registry"
import { ImageUpload } from "@/components/admin/image-upload"

type Block = { id: string; type: string; width: BlockWidth; sort_order: number; data: any }

const BLOCK_ICONS: Record<string, any> = {
  PieChart, BarChart3, BarChart, XCircle, CheckCircle, Network, Terminal, Shield,
  TrendingUp, GitBranch, Columns, Workflow, Gauge, Activity, Zap, AlignLeft,
}

const WIDTH_OPTIONS: { value: BlockWidth; label: string }[] = [
  { value: "1/3", label: "1/3" },
  { value: "1/2", label: "1/2" },
  { value: "2/3", label: "2/3" },
  { value: "full", label: "Full" },
]

/* ========== Block Visual Editors ========== */
function BlockEditor({ block, onChange }: { block: Block; onChange: (data: any) => void }) {
  const d = block.data
  const set = (key: string, val: any) => onChange({ ...d, [key]: val })

  switch (block.type) {
    case "stat-donut":
      return (
        <div className="space-y-3">
          <FieldRow label="Tag"><Input value={d.tag || ""} onChange={(v) => set("tag", v)} /></FieldRow>
          <FieldRow label="Title"><Input value={d.title || ""} onChange={(v) => set("title", v)} /></FieldRow>
          <FieldRow label="Center Value"><Input value={d.center_value || ""} onChange={(v) => set("center_value", v)} /></FieldRow>
          <FieldRow label="Center Label"><Input value={d.center_label || ""} onChange={(v) => set("center_label", v)} /></FieldRow>
          <FieldRow label="Fill %">
            <div className="flex items-center gap-3">
              <input type="range" min="0" max="100" value={d.fill_percent || 75}
                onChange={(e) => set("fill_percent", parseInt(e.target.value))}
                className="flex-1 accent-emerald-500" />
              <span className="text-xs font-mono text-foreground w-8">{d.fill_percent || 75}%</span>
            </div>
          </FieldRow>
          <FieldRow label="Description"><TextArea value={d.description || ""} onChange={(v) => set("description", v)} /></FieldRow>
        </div>
      )

    case "stat-progress":
      return (
        <div className="space-y-3">
          <FieldRow label="Tag"><Input value={d.tag || ""} onChange={(v) => set("tag", v)} /></FieldRow>
          <FieldRow label="Tag Color">
            <select value={d.tag_color || "emerald"} onChange={(e) => set("tag_color", e.target.value)}
              className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none w-full">
              <option value="emerald">Emerald</option><option value="orange">Orange</option><option value="red">Red</option>
            </select>
          </FieldRow>
          <FieldRow label="Title"><Input value={d.title || ""} onChange={(v) => set("title", v)} /></FieldRow>
          <FieldRow label="Badge"><Input value={d.badge || ""} onChange={(v) => set("badge", v)} /></FieldRow>
          <FieldRow label="Description"><TextArea value={d.description || ""} onChange={(v) => set("description", v)} /></FieldRow>
          <div className="border-t border-border pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Bars</span>
              <button type="button" onClick={() => set("bars", [...(d.bars || []), { label: "NEW", value: "0", percent: 50, color: "emerald" }])}
                className="text-primary text-[10px] font-mono hover:underline">+ Add Bar</button>
            </div>
            {(d.bars || []).map((bar: any, i: number) => (
              <div key={i} className="grid grid-cols-5 gap-2 mb-2 items-center">
                <Input value={bar.label} onChange={(v) => { const bars = [...d.bars]; bars[i] = { ...bars[i], label: v }; set("bars", bars) }} />
                <Input value={bar.value} onChange={(v) => { const bars = [...d.bars]; bars[i] = { ...bars[i], value: v }; set("bars", bars) }} />
                <input type="number" min="0" max="100" value={bar.percent}
                  onChange={(e) => { const bars = [...d.bars]; bars[i] = { ...bars[i], percent: parseInt(e.target.value) || 0 }; set("bars", bars) }}
                  className="bg-background border border-border rounded px-2 py-1.5 text-xs text-foreground font-mono focus:border-primary focus:outline-none" />
                <select value={bar.color} onChange={(e) => { const bars = [...d.bars]; bars[i] = { ...bars[i], color: e.target.value }; set("bars", bars) }}
                  className="bg-background border border-border rounded px-2 py-1.5 text-xs text-foreground font-mono focus:border-primary focus:outline-none">
                  <option value="emerald">Green</option><option value="orange">Orange</option><option value="red">Red</option><option value="slate">Gray</option>
                </select>
                <button type="button" onClick={() => { const bars = [...d.bars]; bars.splice(i, 1); set("bars", bars) }}
                  className="text-red-400 hover:text-red-300 text-center"><Trash2 className="size-3 mx-auto" /></button>
              </div>
            ))}
          </div>
        </div>
      )

    case "stat-bars":
      return (
        <div className="space-y-3">
          <FieldRow label="Tag"><Input value={d.tag || ""} onChange={(v) => set("tag", v)} /></FieldRow>
          <FieldRow label="Title"><Input value={d.title || ""} onChange={(v) => set("title", v)} /></FieldRow>
          <FieldRow label="Bar Heights (comma-separated)">
            <Input value={(d.bar_heights || []).join(", ")} onChange={(v) => set("bar_heights", v.split(",").map((s: string) => parseInt(s.trim()) || 0))} />
          </FieldRow>
          <FieldRow label="Load Before"><Input value={d.load_before || ""} onChange={(v) => set("load_before", v)} /></FieldRow>
          <FieldRow label="Load After"><Input value={d.load_after || ""} onChange={(v) => set("load_after", v)} /></FieldRow>
        </div>
      )

    case "challenges-list":
    case "solutions-list":
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Items</span>
            <button type="button" onClick={() => set("items", [...(d.items || []), { title: "New Item", desc: "Description" }])}
              className="text-primary text-[10px] font-mono hover:underline">+ Add Item</button>
          </div>
          {(d.items || []).map((item: any, i: number) => (
            <div key={i} className="border border-border rounded p-3 space-y-2 relative">
              <button type="button" onClick={() => { const items = [...d.items]; items.splice(i, 1); set("items", items) }}
                className="absolute top-2 right-2 text-red-400 hover:text-red-300"><Trash2 className="size-3" /></button>
              <Input value={item.title} onChange={(v) => { const items = [...d.items]; items[i] = { ...items[i], title: v }; set("items", items) }} />
              <TextArea value={item.desc} onChange={(v) => { const items = [...d.items]; items[i] = { ...items[i], desc: v }; set("items", items) }} />
            </div>
          ))}
        </div>
      )

    case "kpi-card":
      return (
        <div className="space-y-3">
          <FieldRow label="Tag"><Input value={d.tag || ""} onChange={(v) => set("tag", v)} /></FieldRow>
          <FieldRow label="Value (large text)"><Input value={d.title || ""} onChange={(v) => set("title", v)} /></FieldRow>
          <FieldRow label="Subtitle"><Input value={d.subtitle || ""} onChange={(v) => set("subtitle", v)} /></FieldRow>
          <FieldRow label="Delta"><Input value={d.delta || ""} onChange={(v) => set("delta", v)} /></FieldRow>
          <FieldRow label="Direction">
            <select value={d.delta_direction || "up"} onChange={(e) => set("delta_direction", e.target.value)}
              className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none w-full">
              <option value="up">Up (Green)</option><option value="down">Down (Red)</option>
            </select>
          </FieldRow>
          <FieldRow label="Sparkline (comma-separated)">
            <Input value={(d.sparkline || []).join(", ")} onChange={(v) => set("sparkline", v.split(",").map((s: string) => parseInt(s.trim()) || 0))} />
          </FieldRow>
        </div>
      )

    case "timeline":
      return (
        <div className="space-y-3">
          <FieldRow label="Title"><Input value={d.title || ""} onChange={(v) => set("title", v)} /></FieldRow>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Milestones</span>
            <button type="button" onClick={() => set("milestones", [...(d.milestones || []), { title: "New Milestone", date: "Week X", status: "pending", description: "" }])}
              className="text-primary text-[10px] font-mono hover:underline">+ Add</button>
          </div>
          {(d.milestones || []).map((m: any, i: number) => (
            <div key={i} className="border border-border rounded p-3 space-y-2 relative">
              <button type="button" onClick={() => { const ms = [...d.milestones]; ms.splice(i, 1); set("milestones", ms) }}
                className="absolute top-2 right-2 text-red-400 hover:text-red-300"><Trash2 className="size-3" /></button>
              <div className="grid grid-cols-3 gap-2">
                <Input value={m.title} onChange={(v) => { const ms = [...d.milestones]; ms[i] = { ...ms[i], title: v }; set("milestones", ms) }} />
                <Input value={m.date} onChange={(v) => { const ms = [...d.milestones]; ms[i] = { ...ms[i], date: v }; set("milestones", ms) }} />
                <select value={m.status} onChange={(e) => { const ms = [...d.milestones]; ms[i] = { ...ms[i], status: e.target.value }; set("milestones", ms) }}
                  className="bg-background border border-border rounded px-2 py-1.5 text-xs text-foreground font-mono focus:border-primary focus:outline-none">
                  <option value="completed">Completed</option><option value="in-progress">In Progress</option><option value="pending">Pending</option>
                </select>
              </div>
              <TextArea value={m.description} onChange={(v) => { const ms = [...d.milestones]; ms[i] = { ...ms[i], description: v }; set("milestones", ms) }} />
            </div>
          ))}
        </div>
      )

    case "comparison-table":
      return (
        <div className="space-y-3">
          <FieldRow label="Title"><Input value={d.title || ""} onChange={(v) => set("title", v)} /></FieldRow>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Rows</span>
            <button type="button" onClick={() => set("rows", [...(d.rows || []), { label: "New", before: "-", after: "-", status: "improved" }])}
              className="text-primary text-[10px] font-mono hover:underline">+ Add Row</button>
          </div>
          {(d.rows || []).map((row: any, i: number) => (
            <div key={i} className="grid grid-cols-5 gap-2 items-center">
              <Input value={row.label} onChange={(v) => { const rows = [...d.rows]; rows[i] = { ...rows[i], label: v }; set("rows", rows) }} />
              <Input value={row.before} onChange={(v) => { const rows = [...d.rows]; rows[i] = { ...rows[i], before: v }; set("rows", rows) }} />
              <Input value={row.after} onChange={(v) => { const rows = [...d.rows]; rows[i] = { ...rows[i], after: v }; set("rows", rows) }} />
              <select value={row.status} onChange={(e) => { const rows = [...d.rows]; rows[i] = { ...rows[i], status: e.target.value }; set("rows", rows) }}
                className="bg-background border border-border rounded px-2 py-1.5 text-xs text-foreground font-mono focus:border-primary focus:outline-none">
                <option value="improved">Improved</option><option value="degraded">Degraded</option><option value="unchanged">Same</option>
              </select>
              <button type="button" onClick={() => { const rows = [...d.rows]; rows.splice(i, 1); set("rows", rows) }}
                className="text-red-400 hover:text-red-300 text-center"><Trash2 className="size-3 mx-auto" /></button>
            </div>
          ))}
        </div>
      )

    case "flow-diagram":
      return (
        <div className="space-y-3">
          <FieldRow label="Title"><Input value={d.title || ""} onChange={(v) => set("title", v)} /></FieldRow>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Steps</span>
            <button type="button" onClick={() => set("steps", [...(d.steps || []), { label: "Step", description: "Desc", icon: "Zap" }])}
              className="text-primary text-[10px] font-mono hover:underline">+ Add Step</button>
          </div>
          {(d.steps || []).map((step: any, i: number) => (
            <div key={i} className="grid grid-cols-4 gap-2 items-center">
              <Input value={step.label} onChange={(v) => { const steps = [...d.steps]; steps[i] = { ...steps[i], label: v }; set("steps", steps) }} />
              <Input value={step.description} onChange={(v) => { const steps = [...d.steps]; steps[i] = { ...steps[i], description: v }; set("steps", steps) }} />
              <select value={step.icon} onChange={(e) => { const steps = [...d.steps]; steps[i] = { ...steps[i], icon: e.target.value }; set("steps", steps) }}
                className="bg-background border border-border rounded px-2 py-1.5 text-xs text-foreground font-mono focus:border-primary focus:outline-none">
                {["Upload", "Cpu", "Shield", "Rocket", "Database", "Network", "Code", "Zap"].map(ic => <option key={ic} value={ic}>{ic}</option>)}
              </select>
              <button type="button" onClick={() => { const steps = [...d.steps]; steps.splice(i, 1); set("steps", steps) }}
                className="text-red-400 hover:text-red-300 text-center"><Trash2 className="size-3 mx-auto" /></button>
            </div>
          ))}
        </div>
      )

    case "metric-gauge":
      return (
        <div className="space-y-3">
          <FieldRow label="Tag"><Input value={d.tag || ""} onChange={(v) => set("tag", v)} /></FieldRow>
          <FieldRow label="Title"><Input value={d.title || ""} onChange={(v) => set("title", v)} /></FieldRow>
          <FieldRow label="Value"><input type="number" value={d.value || 0} onChange={(e) => set("value", parseFloat(e.target.value) || 0)}
            className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none w-full" /></FieldRow>
          <FieldRow label="Max"><input type="number" value={d.max || 100} onChange={(e) => set("max", parseFloat(e.target.value) || 100)}
            className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none w-full" /></FieldRow>
          <FieldRow label="Suffix"><Input value={d.suffix || ""} onChange={(v) => set("suffix", v)} /></FieldRow>
          <FieldRow label="Color">
            <select value={d.color || "emerald"} onChange={(e) => set("color", e.target.value)}
              className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none w-full">
              <option value="emerald">Emerald</option><option value="blue">Blue</option><option value="orange">Orange</option><option value="red">Red</option><option value="indigo">Indigo</option>
            </select>
          </FieldRow>
        </div>
      )

    case "status-panel":
      return (
        <div className="space-y-3">
          <FieldRow label="Title"><Input value={d.title || ""} onChange={(v) => set("title", v)} /></FieldRow>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Indicators</span>
            <button type="button" onClick={() => set("indicators", [...(d.indicators || []), { label: "Service", status: "operational", value: "100%" }])}
              className="text-primary text-[10px] font-mono hover:underline">+ Add</button>
          </div>
          {(d.indicators || []).map((ind: any, i: number) => (
            <div key={i} className="grid grid-cols-4 gap-2 items-center">
              <Input value={ind.label} onChange={(v) => { const inds = [...d.indicators]; inds[i] = { ...inds[i], label: v }; set("indicators", inds) }} />
              <Input value={ind.value} onChange={(v) => { const inds = [...d.indicators]; inds[i] = { ...inds[i], value: v }; set("indicators", inds) }} />
              <select value={ind.status} onChange={(e) => { const inds = [...d.indicators]; inds[i] = { ...inds[i], status: e.target.value }; set("indicators", inds) }}
                className="bg-background border border-border rounded px-2 py-1.5 text-xs text-foreground font-mono focus:border-primary focus:outline-none">
                <option value="operational">Operational</option><option value="degraded">Degraded</option><option value="down">Down</option>
              </select>
              <button type="button" onClick={() => { const inds = [...d.indicators]; inds.splice(i, 1); set("indicators", inds) }}
                className="text-red-400 hover:text-red-300 text-center"><Trash2 className="size-3 mx-auto" /></button>
            </div>
          ))}
        </div>
      )

    case "metric-highlight":
      return (
        <div className="space-y-3">
          <FieldRow label="Tag"><Input value={d.tag || ""} onChange={(v) => set("tag", v)} /></FieldRow>
          <FieldRow label="Value"><Input value={d.value || ""} onChange={(v) => set("value", v)} /></FieldRow>
          <FieldRow label="Label"><Input value={d.label || ""} onChange={(v) => set("label", v)} /></FieldRow>
          <FieldRow label="Description"><TextArea value={d.description || ""} onChange={(v) => set("description", v)} /></FieldRow>
          <div className="border-t border-border pt-3">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">Comparison (optional)</span>
            <div className="grid grid-cols-2 gap-2">
              <FieldRow label="Before"><Input value={d.comparison?.before || ""} onChange={(v) => set("comparison", { ...d.comparison, before: v })} /></FieldRow>
              <FieldRow label="After"><Input value={d.comparison?.after || ""} onChange={(v) => set("comparison", { ...d.comparison, after: v })} /></FieldRow>
            </div>
          </div>
        </div>
      )

    case "text-block":
      return (
        <div className="space-y-3">
          <FieldRow label="Heading"><Input value={d.heading || ""} onChange={(v) => set("heading", v)} /></FieldRow>
          <FieldRow label="Body"><TextArea value={d.body || ""} onChange={(v) => set("body", v)} rows={4} /></FieldRow>
          <FieldRow label="Accent Color">
            <select value={d.accent_color || "emerald"} onChange={(e) => set("accent_color", e.target.value)}
              className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none w-full">
              <option value="emerald">Emerald</option><option value="blue">Blue</option><option value="orange">Orange</option><option value="red">Red</option><option value="indigo">Indigo</option>
            </select>
          </FieldRow>
        </div>
      )

    case "architecture-diagram":
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Corner Nodes (4 max)</span>
            {(d.nodes || []).length < 4 && (
              <button type="button" onClick={() => set("nodes", [...(d.nodes || []), { title: "NODE", sub: "Service", color: "emerald", icon_type: "code", stats: [{ l: "Metric", v: "0", v_color: "emerald-500" }] }])}
                className="text-primary text-[10px] font-mono hover:underline">+ Add Node</button>
            )}
          </div>
          {(d.nodes || []).map((node: any, i: number) => (
            <div key={i} className="border border-border rounded p-3 space-y-2 relative">
              <button type="button" onClick={() => { const nodes = [...d.nodes]; nodes.splice(i, 1); set("nodes", nodes) }}
                className="absolute top-2 right-2 text-red-400 hover:text-red-300"><Trash2 className="size-3" /></button>
              <div className="grid grid-cols-2 gap-2">
                <Input value={node.title} onChange={(v) => { const nodes = [...d.nodes]; nodes[i] = { ...nodes[i], title: v }; set("nodes", nodes) }} />
                <Input value={node.sub} onChange={(v) => { const nodes = [...d.nodes]; nodes[i] = { ...nodes[i], sub: v }; set("nodes", nodes) }} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select value={node.color} onChange={(e) => { const nodes = [...d.nodes]; nodes[i] = { ...nodes[i], color: e.target.value }; set("nodes", nodes) }}
                  className="bg-background border border-border rounded px-2 py-1.5 text-xs text-foreground font-mono focus:border-primary focus:outline-none">
                  {["emerald", "indigo", "rose", "red", "blue", "orange"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={node.icon_type} onChange={(e) => { const nodes = [...d.nodes]; nodes[i] = { ...nodes[i], icon_type: e.target.value }; set("nodes", nodes) }}
                  className="bg-background border border-border rounded px-2 py-1.5 text-xs text-foreground font-mono focus:border-primary focus:outline-none">
                  {["vercel", "database", "streaming", "upload", "code", "rocket"].map(ic => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )

    case "code-terminal":
      return (
        <div className="space-y-3">
          <FieldRow label="Filename"><Input value={d.filename || ""} onChange={(v) => set("filename", v)} /></FieldRow>
          <FieldRow label="Language"><Input value={d.lang || ""} onChange={(v) => set("lang", v)} /></FieldRow>
          <FieldRow label="Content (JSON)">
            <textarea value={JSON.stringify(d.content || [], null, 2)}
              onChange={(e) => { try { set("content", JSON.parse(e.target.value)) } catch {} }}
              rows={8}
              className="w-full bg-background border border-border rounded px-3 py-2 text-xs text-foreground font-mono focus:border-primary focus:outline-none resize-none"
              spellCheck={false} />
          </FieldRow>
        </div>
      )

    case "system-report":
      return (
        <div className="space-y-3">
          <FieldRow label="Version"><Input value={d.version || ""} onChange={(v) => set("version", v)} /></FieldRow>
          <div className="border-t border-border pt-3">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">Left Panel</span>
            <div className="space-y-2">
              <Input value={d.left_panel?.label || ""} onChange={(v) => set("left_panel", { ...d.left_panel, label: v })} />
              <Input value={d.left_panel?.badge || ""} onChange={(v) => set("left_panel", { ...d.left_panel, badge: v })} />
              <Input value={d.left_panel?.value || ""} onChange={(v) => set("left_panel", { ...d.left_panel, value: v })} />
              <Input value={d.left_panel?.value_label || ""} onChange={(v) => set("left_panel", { ...d.left_panel, value_label: v })} />
            </div>
          </div>
          <div className="border-t border-border pt-3">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">Right Panel</span>
            <div className="space-y-2">
              <Input value={d.right_panel?.label || ""} onChange={(v) => set("right_panel", { ...d.right_panel, label: v })} />
              <Input value={d.right_panel?.badge || ""} onChange={(v) => set("right_panel", { ...d.right_panel, badge: v })} />
              <Input value={d.right_panel?.value || ""} onChange={(v) => set("right_panel", { ...d.right_panel, value: v })} />
              <Input value={d.right_panel?.value_label || ""} onChange={(v) => set("right_panel", { ...d.right_panel, value_label: v })} />
            </div>
          </div>
        </div>
      )

    case "impact-card":
      return (
        <div className="space-y-3">
          <FieldRow label="Title"><Input value={d.title || ""} onChange={(v) => set("title", v)} /></FieldRow>
          <div className="grid grid-cols-2 gap-3">
            <div><FieldRow label="Before Label"><Input value={d.before_label || ""} onChange={(v) => set("before_label", v)} /></FieldRow></div>
            <div><FieldRow label="After Label"><Input value={d.after_label || ""} onChange={(v) => set("after_label", v)} /></FieldRow></div>
            <div><FieldRow label="Before Value"><Input value={d.before_value || ""} onChange={(v) => set("before_value", v)} /></FieldRow></div>
            <div><FieldRow label="After Value"><Input value={d.after_value || ""} onChange={(v) => set("after_value", v)} /></FieldRow></div>
          </div>
          <FieldRow label="Improvement %"><Input value={d.improvement || ""} onChange={(v) => set("improvement", v)} /></FieldRow>
          <FieldRow label="Description"><TextArea value={d.description || ""} onChange={(v) => set("description", v)} /></FieldRow>
        </div>
      )

    case "tech-stack":
      return (
        <div className="space-y-3">
          <FieldRow label="Title"><Input value={d.title || ""} onChange={(v) => set("title", v)} /></FieldRow>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Technologies</span>
            <button type="button" onClick={() => set("technologies", [...(d.technologies || []), { name: "Tech", category: "Category", color: "bg-emerald-500" }])}
              className="text-primary text-[10px] font-mono hover:underline">+ Add</button>
          </div>
          {(d.technologies || []).map((tech: any, i: number) => (
            <div key={i} className="grid grid-cols-4 gap-2 items-center">
              <Input value={tech.name} onChange={(v) => { const ts = [...d.technologies]; ts[i] = { ...ts[i], name: v }; set("technologies", ts) }} />
              <Input value={tech.category} onChange={(v) => { const ts = [...d.technologies]; ts[i] = { ...ts[i], category: v }; set("technologies", ts) }} />
              <select value={tech.color} onChange={(e) => { const ts = [...d.technologies]; ts[i] = { ...ts[i], color: e.target.value }; set("technologies", ts) }}
                className="bg-background border border-border rounded px-2 py-1.5 text-xs text-foreground font-mono focus:border-primary focus:outline-none">
                <option value="bg-emerald-500">Green</option><option value="bg-blue-500">Blue</option><option value="bg-cyan-500">Cyan</option><option value="bg-orange-500">Orange</option>
              </select>
              <button type="button" onClick={() => { const ts = [...d.technologies]; ts.splice(i, 1); set("technologies", ts) }}
                className="text-red-400 hover:text-red-300 text-center"><Trash2 className="size-3 mx-auto" /></button>
            </div>
          ))}
        </div>
      )

    case "quote-card":
      return (
        <div className="space-y-3">
          <FieldRow label="Quote"><TextArea value={d.quote || ""} onChange={(v) => set("quote", v)} rows={3} /></FieldRow>
          <FieldRow label="Author"><Input value={d.author || ""} onChange={(v) => set("author", v)} /></FieldRow>
          <FieldRow label="Role"><Input value={d.role || ""} onChange={(v) => set("role", v)} /></FieldRow>
          <FieldRow label="Company"><Input value={d.company || ""} onChange={(v) => set("company", v)} /></FieldRow>
          <FieldRow label="Avatar URL"><Input value={d.avatar_url || ""} onChange={(v) => set("avatar_url", v)} /></FieldRow>
        </div>
      )

    case "feature-highlight":
      return (
        <div className="space-y-3">
          <FieldRow label="Icon (emoji or text)"><Input value={d.icon || ""} onChange={(v) => set("icon", v)} /></FieldRow>
          <FieldRow label="Title"><Input value={d.title || ""} onChange={(v) => set("title", v)} /></FieldRow>
          <FieldRow label="Description"><TextArea value={d.description || ""} onChange={(v) => set("description", v)} /></FieldRow>
          <FieldRow label="Badge"><Input value={d.badge || ""} onChange={(v) => set("badge", v)} /></FieldRow>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Metrics</span>
            <button type="button" onClick={() => set("metrics", [...(d.metrics || []), { label: "Metric", value: "0" }])}
              className="text-primary text-[10px] font-mono hover:underline">+ Add</button>
          </div>
          {(d.metrics || []).map((m: any, i: number) => (
            <div key={i} className="grid grid-cols-3 gap-2 items-center">
              <Input value={m.label} onChange={(v) => { const ms = [...d.metrics]; ms[i] = { ...ms[i], label: v }; set("metrics", ms) }} />
              <Input value={m.value} onChange={(v) => { const ms = [...d.metrics]; ms[i] = { ...ms[i], value: v }; set("metrics", ms) }} />
              <button type="button" onClick={() => { const ms = [...d.metrics]; ms.splice(i, 1); set("metrics", ms) }}
                className="text-red-400 hover:text-red-300 text-center"><Trash2 className="size-3 mx-auto" /></button>
            </div>
          ))}
        </div>
      )

    case "process-steps":
      return (
        <div className="space-y-3">
          <FieldRow label="Title"><Input value={d.title || ""} onChange={(v) => set("title", v)} /></FieldRow>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Steps</span>
            <button type="button" onClick={() => set("steps", [...(d.steps || []), { number: String((d.steps || []).length + 1).padStart(2, "0"), title: "Step", description: "" }])}
              className="text-primary text-[10px] font-mono hover:underline">+ Add</button>
          </div>
          {(d.steps || []).map((step: any, i: number) => (
            <div key={i} className="border border-border rounded p-3 space-y-2 relative">
              <button type="button" onClick={() => { const s = [...d.steps]; s.splice(i, 1); set("steps", s) }}
                className="absolute top-2 right-2 text-red-400 hover:text-red-300"><Trash2 className="size-3" /></button>
              <div className="grid grid-cols-2 gap-2"><Input value={step.number} onChange={(v) => { const s = [...d.steps]; s[i] = { ...s[i], number: v }; set("steps", s) }} placeholder="01" />
                <Input value={step.title} onChange={(v) => { const s = [...d.steps]; s[i] = { ...s[i], title: v }; set("steps", s) }} /></div>
              <TextArea value={step.description} onChange={(v) => { const s = [...d.steps]; s[i] = { ...s[i], description: v }; set("steps", s) }} /></div>
          ))}
        </div>
      )

    case "performance-metrics":
      return (
        <div className="space-y-3">
          <FieldRow label="Title"><Input value={d.title || ""} onChange={(v) => set("title", v)} /></FieldRow>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Metrics</span>
            <button type="button" onClick={() => set("metrics", [...(d.metrics || []), { label: "Metric", value: "0", trend: "+0%", color: "#10b981" }])}
              className="text-primary text-[10px] font-mono hover:underline">+ Add</button>
          </div>
          {(d.metrics || []).map((m: any, i: number) => (
            <div key={i} className="grid grid-cols-5 gap-2 items-center">
              <Input value={m.label} onChange={(v) => { const ms = [...d.metrics]; ms[i] = { ...ms[i], label: v }; set("metrics", ms) }} />
              <Input value={m.value} onChange={(v) => { const ms = [...d.metrics]; ms[i] = { ...ms[i], value: v }; set("metrics", ms) }} />
              <Input value={m.trend} onChange={(v) => { const ms = [...d.metrics]; ms[i] = { ...ms[i], trend: v }; set("metrics", ms) }} />
              <input type="color" value={m.color} onChange={(e) => { const ms = [...d.metrics]; ms[i] = { ...ms[i], color: e.target.value }; set("metrics", ms) }}
                className="bg-background border border-border rounded px-2 py-2 text-sm focus:border-primary focus:outline-none w-full h-9 cursor-pointer" />
              <button type="button" onClick={() => { const ms = [...d.metrics]; ms.splice(i, 1); set("metrics", ms) }}
                className="text-red-400 hover:text-red-300 text-center"><Trash2 className="size-3 mx-auto" /></button>
            </div>
          ))}
        </div>
      )

    case "team-member":
      return (
        <div className="space-y-3">
          <FieldRow label="Name"><Input value={d.name || ""} onChange={(v) => set("name", v)} /></FieldRow>
          <FieldRow label="Role"><Input value={d.role || ""} onChange={(v) => set("role", v)} /></FieldRow>
          <FieldRow label="Avatar URL"><Input value={d.avatar_url || ""} onChange={(v) => set("avatar_url", v)} /></FieldRow>
          <FieldRow label="Bio"><TextArea value={d.bio || ""} onChange={(v) => set("bio", v)} rows={2} /></FieldRow>
          <FieldRow label="Skills (comma-separated)"><Input value={(d.skills || []).join(", ")} onChange={(v) => set("skills", v.split(",").map((s: string) => s.trim()).filter((s: string) => s))} /></FieldRow>
        </div>
      )

    case "challenge-badge":
      return (
        <div className="space-y-3">
          <FieldRow label="Title"><Input value={d.title || ""} onChange={(v) => set("title", v)} /></FieldRow>
          <FieldRow label="Category"><Input value={d.category || ""} onChange={(v) => set("category", v)} /></FieldRow>
          <FieldRow label="Description"><TextArea value={d.description || ""} onChange={(v) => set("description", v)} /></FieldRow>
          <FieldRow label="Severity">
            <select value={d.severity || "medium"} onChange={(e) => set("severity", e.target.value)}
              className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none w-full">
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
            </select>
          </FieldRow>
          <FieldRow label="Status">
            <select value={d.status || "pending"} onChange={(e) => set("status", e.target.value)}
              className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none w-full">
              <option value="pending">Pending</option><option value="in-progress">In Progress</option><option value="resolved">Resolved</option>
            </select>
          </FieldRow>
        </div>
      )

    case "roi-display":
      return (
        <div className="space-y-3">
          <FieldRow label="Title"><Input value={d.title || ""} onChange={(v) => set("title", v)} /></FieldRow>
          <div className="grid grid-cols-2 gap-3">
            <FieldRow label="Investment"><Input value={d.investment || ""} onChange={(v) => set("investment", v)} /></FieldRow>
            <FieldRow label="Returns"><Input value={d.returns || ""} onChange={(v) => set("returns", v)} /></FieldRow>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FieldRow label="ROI %"><Input value={d.roi_percentage || ""} onChange={(v) => set("roi_percentage", v)} /></FieldRow>
            <FieldRow label="Timeframe"><Input value={d.timeframe || ""} onChange={(v) => set("timeframe", v)} /></FieldRow>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Breakdown</span>
            <button type="button" onClick={() => set("breakdown", [...(d.breakdown || []), { label: "Item", value: "$0" }])}
              className="text-primary text-[10px] font-mono hover:underline">+ Add</button>
          </div>
          {(d.breakdown || []).map((item: any, i: number) => (
            <div key={i} className="grid grid-cols-3 gap-2 items-center">
              <Input value={item.label} onChange={(v) => { const bd = [...d.breakdown]; bd[i] = { ...bd[i], label: v }; set("breakdown", bd) }} />
              <Input value={item.value} onChange={(v) => { const bd = [...d.breakdown]; bd[i] = { ...bd[i], value: v }; set("breakdown", bd) }} />
              <button type="button" onClick={() => { const bd = [...d.breakdown]; bd.splice(i, 1); set("breakdown", bd) }}
                className="text-red-400 hover:text-red-300 text-center"><Trash2 className="size-3 mx-auto" /></button>
            </div>
          ))}
        </div>
      )

    case "data-visual":
      return (
        <div className="space-y-3">
          <FieldRow label="Title"><Input value={d.title || ""} onChange={(v) => set("title", v)} /></FieldRow>
          <FieldRow label="Chart Type">
            <select value={d.chart_type || "area"} onChange={(e) => set("chart_type", e.target.value)}
              className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none w-full">
              <option value="area">Area</option><option value="line">Line</option><option value="bar">Bar</option>
            </select>
          </FieldRow>
          <FieldRow label="Data Points (comma-separated)">
            <Input value={(d.data_points || []).join(", ")} onChange={(v) => set("data_points", v.split(",").map((s: string) => parseInt(s.trim()) || 0))} />
          </FieldRow>
          <FieldRow label="Data Label"><Input value={d.label || ""} onChange={(v) => set("label", v)} /></FieldRow>
          <FieldRow label="Summary"><TextArea value={d.summary || ""} onChange={(v) => set("summary", v)} rows={2} /></FieldRow>
        </div>
      )

    default:
      return <p className="text-xs text-muted-foreground font-mono">No visual editor for this block type. Edit raw JSON below:</p>
  }
}

/* ========== Shared Form Components ========== */
function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{label}</label>
      {children}
    </div>
  )
}
function Input({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
    className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none transition-colors w-full" />
}
function TextArea({ value, onChange, rows = 2 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows}
    className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none transition-colors resize-none w-full" />
}

/* ========== MAIN ADMIN PAGE ========== */
export default function AdminCaseStudies() {
  const supabase = createClient()
  const [studies, setStudies] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [expandedBlocks, setExpandedBlocks] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState<"info" | "blocks" | "images">("info")

  useEffect(() => { loadStudies() }, [])

  async function loadStudies() {
    const { data } = await supabase.from("case_studies").select("*").order("sort_order")
    setStudies(data || [])
    setLoading(false)
  }

  async function handleSave() {
    if (!selected) return
    setSaving(true)
    setMessage("")
    try {
      const { id, created_at, updated_at, ...rest } = selected
      if (id) {
        await supabase.from("case_studies").update({ ...rest, updated_at: new Date().toISOString() }).eq("id", id)
      } else {
        await supabase.from("case_studies").insert(rest)
      }
      await loadStudies()
      setMessage("Case study saved.")
    } catch {
      setMessage("Error saving.")
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this case study?")) return
    await supabase.from("case_studies").delete().eq("id", id)
    setSelected(null)
    await loadStudies()
  }

  function addNew() {
    setSelected({
      slug: "", title: "", subtitle: "", client: "", category: "", status: "COMPLETED",
      duration: "", team_size: "", summary: "", challenge: "", solution: "", impact: "",
      hero_tag: "", footer_text: "",
      tags: [], metrics: [], tech_stack: [], content_blocks: [],
      is_featured: false, is_visible: true, sort_order: studies.length,
    })
  }

  // Block management
  function addBlock(type: string) {
    const def = BLOCK_REGISTRY.find(b => b.type === type)
    if (!def) return
    const blocks: Block[] = selected.content_blocks || []
    const newBlock: Block = {
      id: crypto.randomUUID(),
      type: def.type,
      width: def.defaultWidth,
      sort_order: blocks.length,
      data: JSON.parse(JSON.stringify(def.defaultData)),
    }
    setSelected({ ...selected, content_blocks: [...blocks, newBlock] })
    setExpandedBlocks(prev => ({ ...prev, [newBlock.id]: true }))
    setShowModal(false)
  }

  function updateBlock(id: string, updates: Partial<Block>) {
    const blocks = (selected.content_blocks || []).map((b: Block) => b.id === id ? { ...b, ...updates } : b)
    setSelected({ ...selected, content_blocks: blocks })
  }

  function deleteBlock(id: string) {
    const blocks = (selected.content_blocks || []).filter((b: Block) => b.id !== id)
    setSelected({ ...selected, content_blocks: blocks.map((b: Block, i: number) => ({ ...b, sort_order: i })) })
  }

  function moveBlock(id: string, direction: "up" | "down") {
    const blocks = [...(selected.content_blocks || [])]
    const idx = blocks.findIndex((b: Block) => b.id === id)
    if (direction === "up" && idx > 0) { [blocks[idx - 1], blocks[idx]] = [blocks[idx], blocks[idx - 1]] }
    if (direction === "down" && idx < blocks.length - 1) { [blocks[idx], blocks[idx + 1]] = [blocks[idx + 1], blocks[idx]] }
    setSelected({ ...selected, content_blocks: blocks.map((b: Block, i: number) => ({ ...b, sort_order: i })) })
  }

  if (loading) {
    return <div className="flex-1 flex items-center justify-center"><Loader2 className="size-6 text-primary animate-spin" /></div>
  }

  const blocksByCategory = getBlocksByCategory()

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* List Panel */}
      <div className="w-80 border-r border-border flex flex-col shrink-0 overflow-y-auto bg-surface-dark/30">
        <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-surface-dark/80 backdrop-blur-xl z-10">
          <h2 className="text-sm font-bold text-foreground tracking-widest flex items-center gap-2">
            <BookOpen className="size-4 text-primary" /> MISSIONS
          </h2>
          <button type="button" onClick={addNew} className="p-1.5 hover:bg-primary/10 rounded transition-colors text-primary"><Plus className="size-4" /></button>
        </div>
        <div className="flex-1">
          {studies.map((cs) => (
            <button key={cs.id} type="button" onClick={() => { setSelected(cs); setExpandedBlocks({}) }}
              className={`w-full text-left px-4 py-3 border-b border-border hover:bg-foreground/5 transition-colors ${selected?.id === cs.id ? "bg-primary/10 border-l-2 border-l-primary" : ""}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-foreground truncate">{cs.title}</h3>
                {cs.is_visible ? <Eye className="size-3 text-primary shrink-0" /> : <EyeOff className="size-3 text-muted-foreground shrink-0" />}
              </div>
              <p className="text-[10px] text-muted-foreground font-mono truncate mt-0.5">{cs.category} -- {(cs.content_blocks || []).length} blocks</p>
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
          <div className="max-w-4xl space-y-6 pb-20">
            {/* Header actions */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground tracking-widest">{selected.id ? "EDIT MISSION" : "NEW MISSION"}</h2>
              <div className="flex gap-2">
                {selected.id && (
                  <button type="button" onClick={() => handleDelete(selected.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-mono border border-red-500/30 rounded transition-colors">
                    <Trash2 className="size-3" /> Delete
                  </button>
                )}
                <button type="button" onClick={handleSave} disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-primary hover:bg-primary/90 text-background text-xs font-mono font-bold uppercase tracking-wider rounded transition-colors disabled:opacity-50">
                  {saving ? <Loader2 className="size-3 animate-spin" /> : <Save className="size-3" />}
                  {saving ? "Saving..." : "Deploy Changes"}
                </button>
              </div>
            </div>

            {message && (
              <div className={`px-4 py-2 rounded text-xs font-mono border ${message.includes("Error") ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-primary/10 border-primary/30 text-primary"}`}>{message}</div>
            )}

            {/* Tabs Navigation */}
            <div className="flex gap-2 border-b border-border">
              {[
                { id: "info" as const, label: "Basic Info" },
                { id: "blocks" as const, label: `Content Blocks (${(selected.content_blocks || []).length})` },
                { id: "images" as const, label: "Images" }
              ].map(tab => (
                <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Basic Fields */}
            {activeTab === "info" && (
            <section className="p-6 rounded border border-border bg-surface-dark/50 space-y-4">
              <h2 className="text-sm font-bold text-foreground tracking-widest flex items-center gap-2">
                <BookOpen className="size-4 text-primary" /> MISSION CONFIGURATION
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "title", label: "Title" }, { key: "slug", label: "Slug" }, { key: "subtitle", label: "Subtitle" },
                  { key: "client", label: "Client" }, { key: "category", label: "Category" }, { key: "status", label: "Status" },
                  { key: "duration", label: "Duration" }, { key: "team_size", label: "Team Size" },
                  { key: "hero_tag", label: "Hero Tag" }, { key: "date", label: "Date" },
                ].map(({ key, label }) => (
                  <FieldRow key={key} label={label}>
                    <Input value={selected[key] || ""} onChange={(v) => setSelected({ ...selected, [key]: v })} />
                  </FieldRow>
                ))}
              </div>
              {["summary", "footer_text"].map((key) => (
                <FieldRow key={key} label={key.replace(/_/g, " ")}>
                  <TextArea value={selected[key] || ""} onChange={(v) => setSelected({ ...selected, [key]: v })} rows={3} />
                </FieldRow>
              ))}
              <FieldRow label="Tech Stack (comma-separated)">
                <Input value={(selected.tech_stack || []).join(", ")} onChange={(v) => setSelected({ ...selected, tech_stack: v.split(",").map((s: string) => s.trim()).filter(Boolean) })} />
              </FieldRow>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={selected.is_featured || false} onChange={(e) => setSelected({ ...selected, is_featured: e.target.checked })} className="accent-emerald-500" />
                  <span className="text-xs font-mono text-muted-foreground uppercase">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={selected.is_visible !== false} onChange={(e) => setSelected({ ...selected, is_visible: e.target.checked })} className="accent-emerald-500" />
                  <span className="text-xs font-mono text-muted-foreground uppercase">Visible</span>
                </label>
              </div>
            </section>
            )}

            {/* ======== CONTENT BLOCKS BUILDER ======== */}
            {activeTab === "blocks" && (
            <section className="p-6 rounded border border-border bg-surface-dark/50 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-foreground tracking-widest flex items-center gap-2">
                  <GripVertical className="size-4 text-primary" /> CONTENT BLOCKS
                  <span className="text-[10px] font-mono text-muted-foreground ml-2">({(selected.content_blocks || []).length} blocks)</span>
                </h2>
                <button type="button" onClick={() => setShowModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-mono border border-primary/30 rounded transition-colors">
                  <Plus className="size-3" /> Add Block
                </button>
              </div>

              {/* Blocks list */}
              <div className="space-y-3">
                {(selected.content_blocks || []).map((block: Block, idx: number) => {
                  const def = BLOCK_REGISTRY.find(b => b.type === block.type)
                  const IconComp = BLOCK_ICONS[def?.icon || "Zap"] || Zap
                  const isExpanded = expandedBlocks[block.id]
                  return (
                    <div key={block.id} className={`border rounded overflow-hidden transition-colors ${isExpanded ? "border-primary/40 bg-primary/[0.02]" : "border-border"}`}>
                      {/* Block header */}
                      <div className="flex items-center gap-3 px-4 py-3 bg-background hover:bg-foreground/[0.02] transition-colors">
                        {/* Reorder */}
                        <div className="flex flex-col gap-0.5">
                          <button type="button" onClick={() => moveBlock(block.id, "up")} disabled={idx === 0}
                            className="text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"><ArrowUp className="size-3" /></button>
                          <button type="button" onClick={() => moveBlock(block.id, "down")} disabled={idx === (selected.content_blocks || []).length - 1}
                            className="text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"><ArrowDown className="size-3" /></button>
                        </div>
                        {/* Icon + info */}
                        <div className="size-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                          <IconComp className="size-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-foreground truncate">{def?.label || block.type}</div>
                          <div className="text-[10px] text-muted-foreground font-mono">{def?.category}</div>
                        </div>
                        {/* Width selector */}
                        <div className="flex gap-1 shrink-0">
                          {(def?.widths || WIDTH_OPTIONS.map(w => w.value)).map((w) => (
                            <button key={w} type="button" onClick={() => updateBlock(block.id, { width: w as BlockWidth })}
                              className={`text-[9px] font-mono px-2 py-1 rounded border transition-colors ${block.width === w ? "bg-primary/20 border-primary/40 text-primary" : "border-border text-muted-foreground hover:border-foreground/20"}`}>
                              {w}
                            </button>
                          ))}
                        </div>
                        {/* Edit toggle + delete */}
                        <button type="button" onClick={() => setExpandedBlocks(prev => ({ ...prev, [block.id]: !prev[block.id] }))}
                          className="text-muted-foreground hover:text-primary transition-colors">
                          {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                        </button>
                        <button type="button" onClick={() => deleteBlock(block.id)}
                          className="text-red-400/50 hover:text-red-400 transition-colors"><Trash2 className="size-3.5" /></button>
                      </div>
                      {/* Block editor (expanded) */}
                      {isExpanded && (
                        <div className="px-4 py-4 border-t border-border bg-background">
                          <BlockEditor block={block} onChange={(data) => updateBlock(block.id, { data })} />
                        </div>
                      )}
                    </div>
                  )
                })}
                {(selected.content_blocks || []).length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <GripVertical className="size-8 mx-auto mb-3 opacity-20" />
                    <p className="text-xs font-mono">No content blocks yet. Click "Add Block" to start building.</p>
                  </div>
                )}
              </div>
            </section>
            )}

            {/* ======== IMAGES TAB ======== */}
            {activeTab === "images" && (
            <section className="p-6 rounded border border-border bg-surface-dark/50 space-y-4">
              <h2 className="text-sm font-bold text-foreground tracking-widest flex items-center gap-2">
                <Eye className="size-4 text-primary" /> IMAGE ASSETS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUpload
                  label="Thumbnail Image"
                  value={selected.thumbnail_url || ""}
                  onChange={(url) => setSelected({ ...selected, thumbnail_url: url })}
                />
                <ImageUpload
                  label="Cover Image"
                  value={selected.cover_image_url || ""}
                  onChange={(url) => setSelected({ ...selected, cover_image_url: url })}
                />
              </div>
              <div className="text-[10px] text-muted-foreground font-mono mt-4 p-3 bg-background border border-border rounded">
                <p className="mb-1"><strong className="text-foreground">Thumbnail:</strong> Used in the case studies listing grid.</p>
                <p><strong className="text-foreground">Cover:</strong> Displayed as the hero image on the case study detail page.</p>
              </div>
            </section>
            )}
          </div>
        )}
      </div>

      {/* ======== ADD BLOCK MODAL ======== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-background border border-border rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-background z-10">
              <h3 className="text-sm font-bold text-foreground tracking-widest">ADD CONTENT BLOCK</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              {Object.entries(blocksByCategory).map(([category, blocks]) => (
                <div key={category}>
                  <h4 className="text-[10px] font-mono text-primary uppercase tracking-widest mb-3">{category}</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {blocks.map((def) => {
                      const IconComp = BLOCK_ICONS[def.icon] || Zap
                      return (
                        <button key={def.type} type="button" onClick={() => addBlock(def.type)}
                          className="flex items-start gap-3 p-4 border border-border rounded hover:border-primary/40 hover:bg-primary/[0.02] transition-all text-left group">
                          <div className="size-10 rounded bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                            <IconComp className="size-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-foreground">{def.label}</div>
                            <div className="text-[10px] text-muted-foreground font-mono leading-relaxed mt-0.5">{def.description}</div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
