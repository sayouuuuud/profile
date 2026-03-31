"use client"

import { useEffect, useState, use } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import {
    ArrowLeft, Save, Loader2, Sparkles, X, BookOpen,
    Plus, Trash2, Eye, EyeOff, ChevronDown, ChevronUp,
    GripVertical, ArrowUp, ArrowDown,
    PieChart, BarChart3, BarChart, XCircle, CheckCircle, Network, Terminal, Shield,
    TrendingUp, GitBranch, Columns, Workflow, Gauge, Activity, Zap, AlignLeft,
    Target, Cloud, DollarSign, AlertTriangle, Layers, Layout
} from "lucide-react"
import Link from "next/link"
import { GitHubImporter, ImportedRepo } from "@/components/admin/case-study/github-importer"
import { ImageUpload } from "@/components/admin/image-upload"
import { BLOCK_REGISTRY, getBlocksByCategory, type BlockWidth } from "@/lib/block-registry"

// --- Types & Constants ---
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

// --- UI Components ---
function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</label>
            {children}
        </div>
    )
}

function Input({ value, onChange, className, ...props }: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & { value: string; onChange: (v: string) => void }) {
    return <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)}
        className={`bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors w-full ${className || ''}`}
        {...props} />
}

function TextArea({ value, onChange, rows = 3, className, ...props }: { value: string; onChange: (v: string) => void; rows?: number } & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange">) {
    return <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} rows={rows}
        className={`bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors resize-none w-full ${className || ''}`}
        {...props} />
}

// --- Block Editor Component ---
function BlockEditor({ block, onChange }: { block: Block; onChange: (data: any) => void }) {
    const d = block.data || {}
    const set = (key: string, val: any) => onChange({ ...d, [key]: val })

    switch (block.type) {
        case "stat-donut":
            return (
                <div className="space-y-3">
                    <FieldRow label="Tag"><Input value={d.tag} onChange={(v) => set("tag", v)} /></FieldRow>
                    <FieldRow label="Title"><Input value={d.title} onChange={(v) => set("title", v)} /></FieldRow>
                    <FieldRow label="Center Value"><Input value={d.center_value} onChange={(v) => set("center_value", v)} /></FieldRow>
                    <FieldRow label="Center Label"><Input value={d.center_label} onChange={(v) => set("center_label", v)} /></FieldRow>
                    <FieldRow label="Fill %">
                        <div className="flex items-center gap-3">
                            <input type="range" min="0" max="100" value={d.fill_percent || 75}
                                onChange={(e) => set("fill_percent", parseInt(e.target.value))}
                                className="flex-1 accent-emerald-500" />
                            <span className="text-xs text-foreground w-8">{d.fill_percent || 75}%</span>
                        </div>
                    </FieldRow>
                    <FieldRow label="Description"><TextArea value={d.description} onChange={(v) => set("description", v)} /></FieldRow>
                </div>
            )

        case "text-block":
            return (
                <div className="space-y-3">
                    <FieldRow label="Heading"><Input value={d.heading} onChange={(v) => set("heading", v)} /></FieldRow>
                    <FieldRow label="Body"><TextArea value={d.body} onChange={(v) => set("body", v)} rows={6} /></FieldRow>
                    <FieldRow label="Accent Color">
                        <select value={d.accent_color || "emerald"} onChange={(e) => set("accent_color", e.target.value)}
                            className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none w-full">
                            <option value="emerald">Emerald</option><option value="blue">Blue</option><option value="orange">Orange</option><option value="red">Red</option><option value="indigo">Indigo</option>
                        </select>
                    </FieldRow>
                </div>
            )

        case "architecture-diagram":
            return (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Corner Nodes (4 max)</span>
                        {(d.nodes || []).length < 4 && (
                            <button type="button" onClick={() => set("nodes", [...(d.nodes || []), { title: "NODE", sub: "Service", color: "emerald", icon_type: "code", stats: [{ l: "Metric", v: "0", v_color: "emerald-500" }] }])}
                                className="text-primary text-[10px] hover:underline">+ Add Node</button>
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
                                    className="bg-background border border-border rounded px-2 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none">
                                    {["emerald", "indigo", "rose", "red", "blue", "orange"].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <select value={node.icon_type} onChange={(e) => { const nodes = [...d.nodes]; nodes[i] = { ...nodes[i], icon_type: e.target.value }; set("nodes", nodes) }}
                                    className="bg-background border border-border rounded px-2 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none">
                                    {["vercel", "database", "streaming", "upload", "code", "rocket", "server", "globe"].map(ic => <option key={ic} value={ic}>{ic}</option>)}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            )

        case "challenges-list":
        case "solutions-list":
            return (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Items</span>
                        <button type="button" onClick={() => set("items", [...(d.items || []), { title: "New Item", desc: "Description" }])}
                            className="text-primary text-[10px] hover:underline">+ Add Item</button>
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

        case "scalability-simulator":
            const levels = d.levels || []
            return (
                <div className="space-y-4">
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
                        <Activity className="size-5 text-primary shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-foreground">Scalability Simulator Configuration</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Customize the interactive scaling stages for this case study. Adding nodes and adjusting metrics will update the simulator preview in real-time.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {levels.map((level: any, i: number) => (
                            <div key={i} className="border border-border bg-surface-dark/30 rounded-lg overflow-hidden transition-colors hover:border-border/80">
                                {/* Level Header (Always visible) */}
                                <div className="p-3 bg-muted/20 border-b border-border flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: level.color || "gray" }} />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-foreground">Stage {i + 1}: {level.label}</span>
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{level.users?.toLocaleString()} users / {level.level}</span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const expanded = { ...d._ui_expanded };
                                            expanded[i] = !expanded[i];
                                            set("_ui_expanded", expanded);
                                        }}
                                        className="text-xs font-mono text-primary hover:text-primary/80 transition-colors uppercase py-1 px-3 border border-primary/30 rounded hover:bg-primary/5"
                                    >
                                        {d._ui_expanded?.[i] ? "Collapse" : "Edit Details"}
                                    </button>
                                </div>

                                {/* Expanded Content */}
                                {d._ui_expanded?.[i] && (
                                    <div className="p-4 space-y-6">
                                        {/* Basic Settings */}
                                        <div className="space-y-3">
                                            <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2"><Target className="size-3" /> Core Metrics</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                <FieldRow label="Target Users">
                                                    <Input type="number" value={level.users || 0} onChange={(v) => { const l = [...levels]; l[i].users = Number(v); set("levels", l); }} />
                                                </FieldRow>
                                                <FieldRow label="Label (e.g., 10K)">
                                                    <Input value={level.label || ""} onChange={(v) => { const l = [...levels]; l[i].label = v; set("levels", l); }} />
                                                </FieldRow>
                                                <FieldRow label="Stage Alias">
                                                    <Input className="capitalize" value={level.level || ""} onChange={(v) => { const l = [...levels]; l[i].level = v; set("levels", l); }} />
                                                </FieldRow>
                                                <FieldRow label="Theme Color">
                                                    <div className="flex items-center gap-2">
                                                        <input type="color" className="w-8 h-8 rounded border-none bg-transparent cursor-pointer" value={level.color || "#10B981"} onChange={(e) => { const l = [...levels]; l[i].color = e.target.value; set("levels", l); }} />
                                                        <Input className="flex-1 font-mono text-xs" value={level.color || ""} onChange={(v) => { const l = [...levels]; l[i].color = v; set("levels", l); }} />
                                                    </div>
                                                </FieldRow>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Cost Specs */}
                                            <div className="space-y-3">
                                                <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2"><DollarSign className="size-3" /> Monthly Costs</h4>
                                                <div className="space-y-2 p-3 bg-background/50 rounded border border-border/50">
                                                    {["hosting", "database", "cache", "cdn", "monitoring", "security"].map(k => (
                                                        <div key={k} className="flex items-center justify-between gap-3">
                                                            <span className="text-xs text-muted-foreground capitalize w-20">{k}</span>
                                                            <div className="relative flex-1">
                                                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-xs">$</span>
                                                                <input type="number" className="w-full bg-background border border-border rounded pl-6 pr-2 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:border-primary transition-colors"
                                                                    value={level.cost?.[k] || 0}
                                                                    onChange={(e) => {
                                                                        const l = [...levels];
                                                                        if (!l[i].cost) l[i].cost = {};
                                                                        l[i].cost[k] = Number(e.target.value);
                                                                        // Auto-update total
                                                                        l[i].cost.total = ["hosting", "database", "cache", "cdn", "monitoring", "security"]
                                                                            .reduce((sum, key) => sum + (Number(l[i].cost[key]) || 0), 0)
                                                                        set("levels", l);
                                                                    }} />
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div className="pt-2 mt-2 border-t border-border/50 flex justify-between items-center text-sm font-bold">
                                                        <span>Total</span>
                                                        <span className="font-mono text-emerald-400">${level.cost?.total?.toLocaleString() || 0}/mo</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Performance & Arch */}
                                            <div className="space-y-6">
                                                <div className="space-y-3">
                                                    <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2"><Gauge className="size-3" /> Performance Targets</h4>
                                                    <div className="space-y-2">
                                                        <div className="flex gap-2"><Input className="w-1/3 text-xs" placeholder="Response" value={level.performance?.responseTime || ""} onChange={(v) => { const l = [...levels]; if (!l[i].performance) l[i].performance = {}; l[i].performance.responseTime = v; set("levels", l); }} /><Input className="w-1/3 text-xs" placeholder="Uptime" value={level.performance?.uptime || ""} onChange={(v) => { const l = [...levels]; if (!l[i].performance) l[i].performance = {}; l[i].performance.uptime = v; set("levels", l); }} /><Input className="w-1/3 text-xs" placeholder="Throughput" value={level.performance?.throughput || ""} onChange={(v) => { const l = [...levels]; if (!l[i].performance) l[i].performance = {}; l[i].performance.throughput = v; set("levels", l); }} /></div>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2"><Layers className="size-3" /> Stack Details</h4>
                                                    <div className="space-y-2 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
                                                        {["app", "database", "cache", "cdn", "hosting", "monitoring", "security"].map(k => (
                                                            <div key={k} className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground uppercase">{k}</span><Input className="text-xs py-1.5 h-auto" value={level.architecture?.[k] || ""} onChange={(v) => { const l = [...levels]; if (!l[i].architecture) l[i].architecture = {}; l[i].architecture[k] = v; set("levels", l); }} /></div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status & Recommendations */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                                            <div className="space-y-2">
                                                <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2"><AlertTriangle className="size-3" /> Warning / Bottleneck</h4>
                                                <TextArea rows={2} className="text-xs font-mono bg-amber-500/5 border-amber-500/20 text-amber-200/80 focus:border-amber-500/50 placeholder:text-amber-500/30" placeholder="e.g. Database becomes bottleneck without optimization..." value={level.warning || ""} onChange={(v) => { const l = [...levels]; l[i].warning = v; set("levels", l); }} />
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2"><Zap className="size-3" /> Recommendations (One per line)</h4>
                                                <TextArea rows={3} className="text-xs leading-relaxed" placeholder="Add caching layer for frequent queries&#10;Use CDN for static assets..." value={(level.recommendations || []).join('\n')} onChange={(v: any) => { const l = [...levels]; l[i].recommendations = v.split('\n').filter(Boolean); set("levels", l); }} />
                                            </div>
                                        </div>

                                        {/* Architecture Graph Nodes */}
                                        <div className="space-y-3 pt-4 border-t border-border/50">
                                            <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center justify-between">
                                                <span className="flex items-center gap-2"><Cloud className="size-3" /> Visual Graph Nodes</span>
                                            </h4>
                                            <div className="bg-background/50 p-3 rounded border border-border/50 space-y-2">
                                                {(level.nodes || []).map((node: any, nIdx: number) => (
                                                    <div key={nIdx} className="flex items-center gap-2">
                                                        <Input className="w-24 text-xs font-mono placeholder:text-foreground/30" placeholder="ID (e.g. db)" value={node.id} onChange={(v) => { const l = [...levels]; l[i].nodes[nIdx].id = v; set("levels", l); }} />
                                                        <Input className="flex-1 text-xs" placeholder="Label (e.g. PostgreSQL Cluster)" value={node.label} onChange={(v) => { const l = [...levels]; l[i].nodes[nIdx].label = v; set("levels", l); }} />
                                                        <select className="bg-background border border-border rounded px-2 py-1.5 text-xs text-foreground focus:border-primary" value={node.icon} onChange={(e) => { const l = [...levels]; l[i].nodes[nIdx].icon = e.target.value; set("levels", l); }}>
                                                            {["server", "database", "globe", "shield", "gauge", "zap", "harddrive", "cpu", "layers", "monitor", "cloud", "activity"].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                        </select>
                                                        <select className="bg-background border border-border rounded px-2 py-1.5 text-xs text-foreground focus:border-primary" value={node.type} onChange={(e) => { const l = [...levels]; l[i].nodes[nIdx].type = e.target.value; set("levels", l); }}>
                                                            <option value="primary">Primary</option><option value="secondary">Secondary</option><option value="tertiary">Tertiary</option>
                                                        </select>
                                                        <button type="button" onClick={() => { const l = [...levels]; l[i].nodes.splice(nIdx, 1); set("levels", l); }} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors"><Trash2 className="size-3.5" /></button>
                                                    </div>
                                                ))}
                                                <button type="button" onClick={() => { const l = [...levels]; if (!l[i].nodes) l[i].nodes = []; l[i].nodes.push({ id: "new", label: "New Node", icon: "server", type: "secondary" }); set("levels", l); }} className="text-[10px] font-bold text-primary uppercase tracking-widest hover:text-primary/80 transition-colors pt-2 block w-full text-center">+ Add Diagram Node</button>
                                            </div>
                                        </div>

                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )

        // Add more block types here as needed, falling back to JSON for now to save space

        default:
            return (
                <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-mono">Generic JSON Editor</p>
                    <TextArea rows={5} value={JSON.stringify(d, null, 2)} onChange={(v) => {
                        try { onChange(JSON.parse(v)) } catch (e) { }
                    }} />
                </div>
            )
    }
}

// --- Main Page Component ---
export default function EditCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params using React.use()
    const { id } = use(params)

    const router = useRouter()
    const supabase = createClient()

    // State
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [showImportModal, setShowImportModal] = useState(false)
    const [showBlockModal, setShowBlockModal] = useState(false)
    const [activeTab, setActiveTab] = useState<"info" | "blocks" | "images">("info")
    const [expandedBlocks, setExpandedBlocks] = useState<Record<string, boolean>>({})

    // Data State
    const [formData, setFormData] = useState<any>({
        title: "",
        slug: "",
        subtitle: "",
        client: "",
        category: "Product Strategy",
        status: "draft",
        duration: "",
        team_size: "",
        hero_tag: "",
        date: "",
        website_url: "",
        video_url: "",
        thumbnail_url: "",
        cover_image_url: "",
        summary: "",
        footer_text: "",
        tech_stack: [],
        content_blocks: [],
        is_featured: false,
        is_visible: true,
        story_title: "",
        story_subtitle: "",
        story_content: "",
    })

    useEffect(() => {
        loadData()
    }, [id])

    async function loadData() {
        if (!id) return
        try {
            const { data, error } = await supabase.from("case_studies").select("*").eq("id", id).single()
            if (error) throw error
            if (data) setFormData(data)
        } catch (error) {
            console.error("Failed to load case study:", error)
        } finally {
            setIsLoading(false)
        }
    }

    // --- Actions ---

    const handleImport = (repo: ImportedRepo & { analysis: any }) => {
        // Map AI analysis to form fields
        setFormData((prev: any) => ({
            ...prev,
            title: repo.analysis?.title || prev.title,
            slug: (repo.analysis?.title || repo.name || prev.title)?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || prev.slug,
            subtitle: repo.description || repo.analysis?.subtitle || prev.subtitle,
            story_title: repo.analysis?.story_title || prev.story_title,
            story_subtitle: repo.analysis?.story_subtitle || prev.story_subtitle,
            story_content: repo.analysis?.story_content || prev.story_content,
            summary: repo.analysis?.summary || repo.description || prev.summary,
            tech_stack: repo.tech_stack || prev.tech_stack,
            date: repo.analysis?.duration || prev.date,
            metrics: repo.analysis?.metrics || prev.metrics,
            website_url: repo.url || prev.website_url,
            content_blocks: repo.analysis?.content_blocks?.map((b: any, i: number) => ({
                id: crypto.randomUUID(),
                type: b.type,
                width: b.width || "full",
                sort_order: i,
                data: b.content || b.data || {}
            })) || prev.content_blocks,
        }))
        setShowImportModal(false)
    }

    const handleSave = async () => {
        if (!formData.title) return alert("Title is required")
        setIsSaving(true)

        try {
            // Remove some fields we don't want to send back if they interfere (e.g. create_at)
            // But usually update ignores them or we can just send everything relevant
            const { id: _id, created_at, updated_at, ...updateData } = formData

            const { error } = await supabase
                .from("case_studies")
                .update({ ...updateData, updated_at: new Date().toISOString() })
                .eq("id", id)

            if (error) throw error

            alert("Saved successfully!")
        } catch (error: any) {
            console.error("Failed to save:", error)
            alert("Failed to save case study: " + (error.message || "Unknown error"))
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this mission? This cannot be undone.")) return
        setIsSaving(true)
        try {
            const { error } = await supabase.from("case_studies").delete().eq("id", id)
            if (error) throw error
            router.push("/admin/case-studies")
        } catch (error: any) {
            alert("Error deleting: " + error.message)
            setIsSaving(false)
        }
    }

    // --- Block Management ---
    const addBlock = (type: string) => {
        const def = BLOCK_REGISTRY.find(b => b.type === type)
        if (!def) return

        const newBlock: Block = {
            id: crypto.randomUUID(),
            type: def.type,
            width: def.defaultWidth,
            sort_order: (formData.content_blocks || []).length,
            data: JSON.parse(JSON.stringify(def.defaultData)),
        }

        setFormData((prev: any) => ({ ...prev, content_blocks: [...(prev.content_blocks || []), newBlock] }))
        setExpandedBlocks(prev => ({ ...prev, [newBlock.id]: true }))
        setShowBlockModal(false)
    }

    const updateBlock = (id: string, updates: Partial<Block>) => {
        const blocks = (formData.content_blocks || []).map((b: Block) => b.id === id ? { ...b, ...updates } : b)
        setFormData((prev: any) => ({ ...prev, content_blocks: blocks }))
    }

    const deleteBlock = (id: string) => {
        if (!confirm("Remove this block?")) return
        const blocks = (formData.content_blocks || []).filter((b: Block) => b.id !== id)
        setFormData((prev: any) => ({ ...prev, content_blocks: blocks.map((b: Block, i: number) => ({ ...b, sort_order: i })) }))
    }

    const moveBlock = (id: string, direction: "up" | "down") => {
        const blocks = [...(formData.content_blocks || [])]
        const idx = blocks.findIndex((b: Block) => b.id === id)
        if (idx === -1) return

        if (direction === "up" && idx > 0) {
            [blocks[idx - 1], blocks[idx]] = [blocks[idx], blocks[idx - 1]]
        } else if (direction === "down" && idx < blocks.length - 1) {
            [blocks[idx], blocks[idx + 1]] = [blocks[idx + 1], blocks[idx]]
        }

        setFormData((prev: any) => ({
            ...prev,
            content_blocks: blocks.map((b: Block, i: number) => ({ ...b, sort_order: i }))
        }))
    }

    const blocksByCategory = getBlocksByCategory()

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen"><Loader2 className="size-8 animate-spin text-primary" /></div>
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-5xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/case-studies" className="p-2 hover:bg-surface-dark rounded-full transition-colors text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="size-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground tracking-tight">Edit Mission</h1>
                        <p className="text-sm text-muted-foreground">Editing: <span className="text-foreground font-mono">{formData.title}</span></p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-colors text-sm font-medium"
                    >
                        <Trash2 className="size-4" />
                    </button>
                    <button
                        onClick={() => setShowImportModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg transition-colors text-sm font-medium"
                    >
                        <Sparkles className="size-4" />
                        AI Re-Analyze
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-background font-bold tracking-wide uppercase text-sm rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex gap-2 border-b border-border mb-6">
                {[
                    { id: "info" as const, label: "Basic Info" },
                    { id: "blocks" as const, label: `Content Blocks (${(formData.content_blocks || []).length})` },
                    { id: "images" as const, label: "Images" }
                ].map(tab => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* --- TAB CONTENT: BASIC INFO --- */}
            {activeTab === "info" && (
                <section className="p-6 rounded border border-border bg-surface-dark/30 space-y-6">
                    <h2 className="text-sm font-bold text-foreground tracking-widest flex items-center gap-2 border-b border-border pb-4">
                        <BookOpen className="size-4 text-primary" /> MISSION CONFIGURATION
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { key: "title", label: "Title" }, { key: "slug", label: "Slug" }, { key: "subtitle", label: "Subtitle" },
                            { key: "client", label: "Client" }, { key: "duration", label: "Duration" }, { key: "team_size", label: "Team Size" },
                            { key: "hero_tag", label: "Hero Tag" },
                            { key: "website_url", label: "Website URL" },
                        ].map(({ key, label }) => (
                            <FieldRow key={key} label={label}>
                                <Input value={formData[key] || ""} onChange={(v) => setFormData((prev: any) => ({ ...prev, [key]: v }))} />
                            </FieldRow>
                        ))}

                        <FieldRow label="Date">
                            <Input value={formData.date || ""} onChange={(v) => setFormData((prev: any) => ({ ...prev, date: v }))} />
                        </FieldRow>

                        <FieldRow label="Category">
                            <select className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                                value={formData.category || "Product Strategy"}
                                onChange={e => setFormData((prev: any) => ({ ...prev, category: e.target.value }))}>
                                <option value="Product Strategy">Product Strategy</option>
                                <option value="Technical Architecture">Technical Architecture</option>
                                <option value="Full Stack Development">Full Stack Development</option>
                                <option value="AI Engineering">AI Engineering</option>
                            </select>
                        </FieldRow>
                        <FieldRow label="Status">
                            <select className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                                value={formData.status} onChange={e => setFormData((prev: any) => ({ ...prev, status: e.target.value }))}>
                                <option value="draft">Draft</option><option value="active">Active</option><option value="completed">Completed</option>
                            </select>
                        </FieldRow>

                        <div className="col-span-1 md:col-span-2 space-y-4 pt-4 border-t border-border">
                            <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest">Story of Project</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FieldRow label="Story Title">
                                    <Input value={formData.story_title || ""} onChange={(v) => setFormData((prev: any) => ({ ...prev, story_title: v }))} placeholder="Title for the story popup" />
                                </FieldRow>
                                <FieldRow label="Story Subtitle">
                                    <Input value={formData.story_subtitle || ""} onChange={(v) => setFormData((prev: any) => ({ ...prev, story_subtitle: v }))} placeholder="Secondary title or tagline" />
                                </FieldRow>
                            </div>
                            <FieldRow label="Story Content">
                                <TextArea value={formData.story_content || ""} onChange={(v) => setFormData((prev: any) => ({ ...prev, story_content: v }))} rows={8} placeholder="The full story of the project. Formatting will be preserved." />
                            </FieldRow>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ImageUpload label="Video Asset" value={formData.video_url || ""} onChange={(url) => setFormData((prev: any) => ({ ...prev, video_url: url }))} />
                    </div>

                    <FieldRow label="Summary">
                        <TextArea value={formData.summary || ""} onChange={(v) => setFormData((prev: any) => ({ ...prev, summary: v }))} />
                    </FieldRow>

                    <FieldRow label="Footer Text">
                        <TextArea value={formData.footer_text || ""} onChange={(v) => setFormData((prev: any) => ({ ...prev, footer_text: v }))} rows={2} />
                    </FieldRow>

                    <FieldRow label="Tech Stack (comma-separated)">
                        <Input value={(formData.tech_stack || []).join(", ")} onChange={(v) => setFormData((prev: any) => ({ ...prev, tech_stack: v.split(",").map((s: string) => s.trim()).filter(Boolean) }))} />
                    </FieldRow>

                    <div className="space-y-3 pt-6 border-t border-border mt-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-foreground tracking-widest flex items-center gap-2">
                                <BarChart className="size-4 text-primary" /> KEY METRICS
                            </h3>
                            <button
                                type="button"
                                onClick={() => setFormData((prev: any) => ({ ...prev, metrics: [...(prev.metrics || []), { label: "", value: "" }] }))}
                                className="text-xs font-mono text-primary hover:text-primary/80 transition-colors uppercase py-1 px-3 border border-primary/30 rounded hover:bg-primary/5 flex items-center gap-2"
                            >
                                <Plus className="size-3" /> Add Metric
                            </button>
                        </div>
                        <p className="text-xs text-muted-foreground">These appear below the summary on the public case study page (e.g., "100%" "COST REDUCTION").</p>

                        {(formData.metrics || []).length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(formData.metrics || []).map((metric: any, i: number) => (
                                    <div key={i} className="flex items-start gap-3 p-3 bg-background/50 border border-border/50 rounded-lg">
                                        <div className="flex-1 space-y-3">
                                            <FieldRow label="Value (e.g. 100%, <1s)">
                                                <Input
                                                    value={metric.value}
                                                    onChange={(v) => {
                                                        const m = [...(formData.metrics || [])];
                                                        m[i].value = v;
                                                        setFormData((prev: any) => ({ ...prev, metrics: m }));
                                                    }}
                                                />
                                            </FieldRow>
                                            <FieldRow label="Label (e.g. COST REDUCTION)">
                                                <Input
                                                    className="uppercase"
                                                    value={metric.label}
                                                    onChange={(v) => {
                                                        const m = [...(formData.metrics || [])];
                                                        m[i].label = v;
                                                        setFormData((prev: any) => ({ ...prev, metrics: m }));
                                                    }}
                                                />
                                            </FieldRow>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const m = [...(formData.metrics || [])];
                                                m.splice(i, 1);
                                                setFormData((prev: any) => ({ ...prev, metrics: m }));
                                            }}
                                            className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors mt-6"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-6 border border-dashed border-border/50 rounded-lg text-muted-foreground text-sm">
                                No metrics added yet.
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-border mt-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={formData.is_featured || false} onChange={(e) => setFormData((prev: any) => ({ ...prev, is_featured: e.target.checked }))} className="accent-emerald-500" />
                            <span className="text-xs font-mono text-muted-foreground uppercase">Featured</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={formData.is_visible !== false} onChange={(e) => setFormData((prev: any) => ({ ...prev, is_visible: e.target.checked }))} className="accent-emerald-500" />
                            <span className="text-xs font-mono text-muted-foreground uppercase">Visible</span>
                        </label>
                    </div>
                </section>
            )}

            {/* --- TAB CONTENT: BLOCKS --- */}
            {activeTab === "blocks" && (
                <section className="p-6 rounded border border-border bg-surface-dark/30 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-foreground tracking-widest flex items-center gap-2">
                            <GripVertical className="size-4 text-primary" /> CONTENT BLOCKS
                        </h2>
                        <button type="button" onClick={() => setShowBlockModal(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-mono border border-primary/30 rounded transition-colors">
                            <Plus className="size-3" /> Add Block
                        </button>
                    </div>

                    <div className="space-y-3">
                        {(formData.content_blocks || []).map((block: Block, idx: number) => {
                            const def = BLOCK_REGISTRY.find(b => b.type === block.type)
                            const IconComp = BLOCK_ICONS[def?.icon || "Zap"] || Zap
                            const isExpanded = expandedBlocks[block.id]

                            return (
                                <div key={block.id} className={`border rounded overflow-hidden transition-colors ${isExpanded ? "border-primary/40 bg-primary/[0.02]" : "border-border"}`}>
                                    {/* Header */}
                                    <div className="flex items-center gap-3 px-4 py-3 bg-background hover:bg-foreground/[0.02] transition-colors">
                                        <div className="flex flex-col gap-0.5">
                                            <button type="button" onClick={() => moveBlock(block.id, "up")} disabled={idx === 0}
                                                className="text-muted-foreground hover:text-foreground disabled:opacity-20"><ArrowUp className="size-3" /></button>
                                            <button type="button" onClick={() => moveBlock(block.id, "down")} disabled={idx === (formData.content_blocks || []).length - 1}
                                                className="text-muted-foreground hover:text-foreground disabled:opacity-20"><ArrowDown className="size-3" /></button>
                                        </div>
                                        <div className="size-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                                            <IconComp className="size-4 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-bold text-foreground truncate">{def?.label || block.type}</div>
                                            <div className="text-[10px] text-muted-foreground">{def?.category}</div>
                                        </div>
                                        <div className="flex gap-1 shrink-0">
                                            {(def?.widths || WIDTH_OPTIONS.map(w => w.value)).map((w) => (
                                                <button key={w} type="button" onClick={() => updateBlock(block.id, { width: w as BlockWidth })}
                                                    className={`text-[9px] px-2 py-1 rounded border transition-colors ${block.width === w ? "bg-primary/20 border-primary/40 text-primary" : "border-border text-muted-foreground hover:border-foreground/20"}`}>
                                                    {w}
                                                </button>
                                            ))}
                                        </div>
                                        <button type="button" onClick={() => setExpandedBlocks(prev => ({ ...prev, [block.id]: !prev[block.id] }))}
                                            className="text-muted-foreground hover:text-primary transition-colors">
                                            {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                                        </button>
                                        <button type="button" onClick={() => deleteBlock(block.id)}
                                            className="text-red-400/50 hover:text-red-400 transition-colors"><Trash2 className="size-3.5" /></button>
                                    </div>

                                    {/* Editor */}
                                    {isExpanded && (
                                        <div className="px-4 py-4 border-t border-border bg-background">
                                            <BlockEditor block={block} onChange={(data) => updateBlock(block.id, { data })} />
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                        {(formData.content_blocks || []).length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                <GripVertical className="size-8 mx-auto mb-3 opacity-20" />
                                <p className="text-xs font-mono">No content blocks yet. Click "Add Block" to start building.</p>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* --- TAB CONTENT: IMAGES --- */}
            {activeTab === "images" && (
                <section className="p-6 rounded border border-border bg-surface-dark/30 space-y-6">
                    <h2 className="text-sm font-bold text-foreground tracking-widest flex items-center gap-2 border-b border-border pb-4">
                        <Eye className="size-4 text-primary" /> IMAGE ASSETS
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ImageUpload label="Thumbnail Image" value={formData.thumbnail_url || ""} onChange={(url) => setFormData((prev: any) => ({ ...prev, thumbnail_url: url }))} />
                        <ImageUpload label="Cover Image" value={formData.cover_image_url || ""} onChange={(url) => setFormData((prev: any) => ({ ...prev, cover_image_url: url }))} />
                    </div>
                </section>
            )}

            {/* --- MODALS --- */}
            {showImportModal && (
                <div className="fixed inset-0 z-[500] flex items-start justify-center bg-black/80 backdrop-blur-sm overflow-y-auto pt-24 pb-20" onClick={() => setShowImportModal(false)}>
                    <div className="bg-background border border-border rounded-xl w-full max-w-2xl shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <button type="button" onClick={() => setShowImportModal(false)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
                        <div className="p-8">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-foreground mb-2">Auto-Fill from GitHub</h2>
                                <p className="text-muted-foreground text-sm">Paste a repository URL to extract project details, tech stack, and generate a summary using AI.</p>
                            </div>
                            <GitHubImporter onImport={handleImport as any} isLoading={false} />
                        </div>
                    </div>
                </div>
            )}

            {showBlockModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowBlockModal(false)}>
                    <div className="bg-background border border-border rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-background z-10">
                            <h3 className="text-sm font-bold text-foreground tracking-widest">ADD CONTENT BLOCK</h3>
                            <button type="button" onClick={() => setShowBlockModal(false)} className="text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
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
