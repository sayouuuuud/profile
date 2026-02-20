"use client"

import { useState, useEffect } from "react"
import { Save, Loader2, RotateCcw } from "lucide-react"

const DEFAULT_CONFIG = {
    ai: { model: "gemini-1.5-flash", temperature: 0.7, max_tokens: 2048 },
    telegram: {
        notifications_enabled: true,
        quiet_hours_enabled: false,
        quiet_hours_start: "22:00",
        quiet_hours_end: "08:00"
    },
    reports: {
        daily_enabled: true,
        daily_time: "09:00",
        daily_timezone: "Cairo",
        weekly_enabled: false,
        weekly_day: "Monday",
        brief_style: "professional"
    }
}

export function ConfigurationPanel() {
    const [config, setConfig] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState("ai")

    useEffect(() => {
        fetchConfig()
    }, [])

    const fetchConfig = async () => {
        try {
            const res = await fetch("/api/admin/control/config")
            if (!res.ok) throw new Error("Failed to fetch config")
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            // Merge with defaults to prevent null crashes
            setConfig({
                ai: { ...DEFAULT_CONFIG.ai, ...data.ai },
                telegram: { ...DEFAULT_CONFIG.telegram, ...data.telegram },
                reports: { ...DEFAULT_CONFIG.reports, ...data.reports }
            })
            setError(null)
        } catch (e: any) {
            console.error(e)
            setError(e.message)
            // Use defaults if fetch fails
            setConfig(DEFAULT_CONFIG)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await fetch("/api/admin/control/config", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(config)
            })
            if (!res.ok) throw new Error("Failed to save")
            setError(null)
            alert("Configuration saved!")
        } catch (e: any) {
            setError(e.message)
            alert("Failed to save: " + e.message)
        } finally {
            setSaving(false)
        }
    }

    const handleChange = (category: string, key: string, value: any) => {
        setConfig((prev: any) => ({
            ...prev,
            [category]: {
                ...(prev?.[category] || {}),
                [key]: value
            }
        }))
    }

    if (loading) return <div className="p-8 text-center text-muted-foreground">Loading configs...</div>

    return (
        <div className="space-y-6">
            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    ⚠️ {error} — showing defaults
                </div>
            )}

            {/* Tabs Header */}
            <div className="flex border-b border-border">
                {["ai", "telegram", "reports"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${activeTab === tab
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {tab} Config
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="p-6 bg-surface-dark/40 border border-border rounded-xl">
                {activeTab === "ai" && (
                    <div className="space-y-6 max-w-lg">
                        <ConfigInput
                            label="Model"
                            value={config?.ai?.model || "gemini-1.5-flash"}
                            onChange={(v: string) => handleChange("ai", "model", v)}
                            options={["gemini-1.5-flash", "gemini-1.5-pro"]}
                        />
                        <ConfigRange
                            label="Temperature"
                            value={config?.ai?.temperature ?? 0.7}
                            onChange={(v: number) => handleChange("ai", "temperature", v)}
                            min={0} max={1} step={0.1}
                        />
                        <ConfigInput
                            label="Max Tokens"
                            type="number"
                            value={config?.ai?.max_tokens ?? 2048}
                            onChange={(v: string) => handleChange("ai", "max_tokens", parseInt(v))}
                        />
                    </div>
                )}

                {activeTab === "telegram" && (
                    <div className="space-y-6 max-w-lg">
                        <ConfigSwitch
                            label="Notifications Enabled"
                            checked={config?.telegram?.notifications_enabled ?? true}
                            onChange={(v: boolean) => handleChange("telegram", "notifications_enabled", v)}
                        />
                        <ConfigSwitch
                            label="Quiet Hours"
                            checked={config?.telegram?.quiet_hours_enabled ?? false}
                            onChange={(v: boolean) => handleChange("telegram", "quiet_hours_enabled", v)}
                        />
                        {config?.telegram?.quiet_hours_enabled && (
                            <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-border">
                                <ConfigInput
                                    label="Start Time"
                                    value={config?.telegram?.quiet_hours_start || "22:00"}
                                    onChange={(v: string) => handleChange("telegram", "quiet_hours_start", v)}
                                />
                                <ConfigInput
                                    label="End Time"
                                    value={config?.telegram?.quiet_hours_end || "08:00"}
                                    onChange={(v: string) => handleChange("telegram", "quiet_hours_end", v)}
                                />
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "reports" && (
                    <div className="space-y-6 max-w-lg">
                        <ConfigSwitch
                            label="Daily Reports"
                            checked={config?.reports?.daily_enabled ?? true}
                            onChange={(v: boolean) => handleChange("reports", "daily_enabled", v)}
                        />
                        {config?.reports?.daily_enabled && (
                            <div className="pl-4 border-l-2 border-border space-y-4">
                                <ConfigInput
                                    label="Report Time"
                                    value={config?.reports?.daily_time || "09:00"}
                                    onChange={(v: string) => handleChange("reports", "daily_time", v)}
                                />
                                <ConfigInput
                                    label="Timezone"
                                    value={config?.reports?.daily_timezone || "Cairo"}
                                    onChange={(v: string) => handleChange("reports", "daily_timezone", v)}
                                />
                                <ConfigInput
                                    label="Brief Style"
                                    value={config?.reports?.brief_style || "professional"}
                                    onChange={(v: string) => handleChange("reports", "brief_style", v)}
                                    options={["professional", "casual", "wartime", "executive"]}
                                />
                            </div>
                        )}
                        <ConfigSwitch
                            label="Weekly Summary"
                            checked={config?.reports?.weekly_enabled ?? false}
                            onChange={(v: boolean) => handleChange("reports", "weekly_enabled", v)}
                        />
                        {config?.reports?.weekly_enabled && (
                            <div className="pl-4 border-l-2 border-border">
                                <ConfigInput
                                    label="Weekly Report Day"
                                    value={config?.reports?.weekly_day || "Monday"}
                                    onChange={(v: string) => handleChange("reports", "weekly_day", v)}
                                    options={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
                <button
                    onClick={fetchConfig}
                    className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
                >
                    <RotateCcw className="size-4" /> Reset
                </button>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    {saving && <Loader2 className="size-4 animate-spin" />}
                    Save Changes
                </button>
            </div>
        </div>
    )
}

// Helpers
function ConfigInput({ label, value, onChange, type = "text", options }: any) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1.5">{label}</label>
            {options ? (
                <select
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
                >
                    {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
                </select>
            ) : (
                <input
                    type={type}
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
                />
            )}
        </div>
    )
}

function ConfigSwitch({ label, checked, onChange }: any) {
    return (
        <div className="flex items-center justify-between">
            <label className="text-sm font-medium">{label}</label>
            <button
                onClick={() => onChange(!checked)}
                className={`w-11 h-6 rounded-full transition-colors relative ${checked ? "bg-primary" : "bg-muted"}`}
            >
                <div className={`absolute top-1 left-1 bg-white size-4 rounded-full transition-transform ${checked ? "translate-x-5" : ""}`} />
            </button>
        </div>
    )
}

function ConfigRange({ label, value, onChange, min, max, step }: any) {
    return (
        <div>
            <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium">{label}</label>
                <span className="text-xs text-muted-foreground">{value}</span>
            </div>
            <input
                type="range"
                min={min} max={max} step={step}
                value={value ?? 0}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full"
            />
        </div>
    )
}
