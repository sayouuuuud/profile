"use client"

import { useState, useEffect } from "react"
import { Save, Loader2, RotateCcw, Send, Bell, Clock, FileText, Settings2 } from "lucide-react"

const DEFAULT_CONFIG = {
    telegram: {
        notifications_enabled: true,
        quiet_hours_enabled: false,
        quiet_hours_start: "22:00",
        quiet_hours_end: "08:00"
    },
    reports: {
        weekly_enabled: true,
        weekly_day: "Sunday",
        brief_style: "professional",
        daily_timezone: "Cairo"
    }
}

export function ReportConfig() {
    const [config, setConfig] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [testing, setTesting] = useState(false)
    const [testResult, setTestResult] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => { fetchConfig() }, [])

    const fetchConfig = async () => {
        try {
            const res = await fetch("/api/admin/control/config")
            if (!res.ok) throw new Error("Failed to fetch")
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            setConfig({
                telegram: { ...DEFAULT_CONFIG.telegram, ...data.telegram },
                reports: { ...DEFAULT_CONFIG.reports, ...data.reports }
            })
            setError(null)
        } catch (e: any) {
            setError(e.message)
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
        } catch (e: any) {
            setError(e.message)
        } finally {
            setSaving(false)
        }
    }

    const handleChange = (category: string, key: string, value: any) => {
        setConfig((prev: any) => ({
            ...prev,
            [category]: { ...(prev?.[category] || {}), [key]: value }
        }))
    }

    const sendTestReport = async () => {
        setTesting(true)
        setTestResult(null)
        try {
            const res = await fetch("/api/cron/morning-brief", { method: "POST" })
            const data = await res.json()
            setTestResult(data)
        } catch (e: any) {
            setTestResult({ success: false, error: e.message })
        } finally {
            setTesting(false)
        }
    }

    if (loading) return <div className="p-6 text-center text-muted-foreground">Loading...</div>

    return (
        <div className="space-y-6">
            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    ⚠️ {error}
                </div>
            )}

            {/* Notification Settings */}
            <div className="p-5 bg-card border border-border rounded-xl space-y-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <Bell className="size-4" />
                    Notification Settings
                </div>

                <ToggleRow
                    label="Notifications Enabled"
                    desc="Master switch for all Telegram notifications"
                    checked={config?.telegram?.notifications_enabled ?? true}
                    onChange={(v: boolean) => handleChange("telegram", "notifications_enabled", v)}
                />

                <ToggleRow
                    label="Quiet Hours"
                    desc="Silence notifications during specific hours"
                    checked={config?.telegram?.quiet_hours_enabled ?? false}
                    onChange={(v: boolean) => handleChange("telegram", "quiet_hours_enabled", v)}
                />

                {config?.telegram?.quiet_hours_enabled && (
                    <div className="grid grid-cols-2 gap-3 pl-6 border-l-2 border-border">
                        <InputRow label="Start" value={config?.telegram?.quiet_hours_start || "22:00"} onChange={(v: string) => handleChange("telegram", "quiet_hours_start", v)} />
                        <InputRow label="End" value={config?.telegram?.quiet_hours_end || "08:00"} onChange={(v: string) => handleChange("telegram", "quiet_hours_end", v)} />
                    </div>
                )}
            </div>

            {/* Report Settings */}
            <div className="p-5 bg-card border border-border rounded-xl space-y-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <FileText className="size-4" />
                    Weekly Report
                </div>

                <ToggleRow
                    label="Weekly Report"
                    desc="Comprehensive analytics report every week"
                    checked={config?.reports?.weekly_enabled ?? true}
                    onChange={(v: boolean) => handleChange("reports", "weekly_enabled", v)}
                />

                {config?.reports?.weekly_enabled && (
                    <div className="space-y-3 pl-6 border-l-2 border-border">
                        <SelectRow label="Report Day" value={config?.reports?.weekly_day || "Sunday"} options={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]} onChange={(v: string) => handleChange("reports", "weekly_day", v)} />
                        <SelectRow label="Style" value={config?.reports?.brief_style || "professional"} options={["professional", "casual", "wartime", "executive"]} onChange={(v: string) => handleChange("reports", "brief_style", v)} />
                        <InputRow label="Timezone" value={config?.reports?.daily_timezone || "Cairo"} onChange={(v: string) => handleChange("reports", "daily_timezone", v)} />
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3">
                <button
                    onClick={sendTestReport}
                    disabled={testing}
                    className="flex items-center gap-2 px-4 py-2.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-lg text-sm font-medium hover:bg-sky-500/20 transition-colors disabled:opacity-50"
                >
                    {testing ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                    {testing ? "Sending..." : "Send Test Report Now"}
                </button>

                <div className="flex gap-2">
                    <button onClick={fetchConfig} className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5">
                        <RotateCcw className="size-3.5" /> Reset
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50"
                    >
                        {saving && <Loader2 className="size-4 animate-spin" />}
                        Save
                    </button>
                </div>
            </div>

            {/* Test Result */}
            {testResult && (
                <div className={`p-4 rounded-lg border text-sm font-mono ${testResult.success ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                    <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(testResult, null, 2)}</pre>
                </div>
            )}
        </div>
    )
}

// Helper components
function ToggleRow({ label, desc, checked, onChange }: any) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div>
                <div className="text-sm font-medium">{label}</div>
                <div className="text-xs text-muted-foreground">{desc}</div>
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${checked ? "bg-primary" : "bg-muted"}`}
            >
                <div className={`absolute top-1 left-1 bg-white size-4 rounded-full transition-transform ${checked ? "translate-x-5" : ""}`} />
            </button>
        </div>
    )
}

function InputRow({ label, value, onChange }: any) {
    return (
        <div>
            <label className="block text-xs text-muted-foreground mb-1">{label}</label>
            <input
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm"
            />
        </div>
    )
}

function SelectRow({ label, value, options, onChange }: any) {
    return (
        <div>
            <label className="block text-xs text-muted-foreground mb-1">{label}</label>
            <select
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm"
            >
                {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
            </select>
        </div>
    )
}
