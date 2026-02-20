"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Switch } from "@/components/ui/switch"
import { motion } from "framer-motion"
import { Save, Brain, Zap, Bell, Check, Loader2, Bot } from "lucide-react"

type SettingsState = {
    ai_features: {
        parser_enabled: boolean
        voice_enabled: boolean
        analysis_enabled: boolean
    }
    morning_brief: {
        enabled: boolean
        style: "concise" | "detailed" | "witty"
        frequency: "daily"
    }
    telegram: {
        notifications_enabled: boolean
    }
}

const DEFAULT_SETTINGS: SettingsState = {
    ai_features: { parser_enabled: true, voice_enabled: true, analysis_enabled: true },
    morning_brief: { enabled: true, style: "concise", frequency: "daily" },
    telegram: { notifications_enabled: true },
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState(false)

    const supabase = createClient()

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase.from("app_settings").select("*")
            if (error) throw error

            const newSettings = { ...DEFAULT_SETTINGS }
            data?.forEach((row) => {
                if (row.key in newSettings) {
                    (newSettings as any)[row.key] = row.value
                }
            })
            setSettings(newSettings)
        } catch (err) {
            console.error("Failed to load settings:", err)
        } finally {
            setLoading(false)
        }
    }

    const saveSettings = async () => {
        setSaving(true)
        try {
            const updates = Object.entries(settings).map(([key, value]) => ({
                key,
                value,
                updated_at: new Date().toISOString(),
            }))

            const { error } = await supabase.from("app_settings").upsert(updates, { onConflict: "key" })
            if (error) throw error

            setSuccess(true)
            setTimeout(() => setSuccess(false), 2000)
        } catch (err) {
            console.error("Failed to save settings:", err)
            alert("Failed to save settings")
        } finally {
            setSaving(false)
        }
    }

    const updateSection = (section: keyof SettingsState, key: string, value: any) => {
        setSettings((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value,
            },
        }))
    }

    if (loading) {
        return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
    }

    return (
        <div className="container mx-auto py-12 px-4 max-w-3xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Control Center</h1>
                    <p className="text-muted-foreground">Manage your Product Engine's behavior and intelligence.</p>
                </div>
                <button
                    onClick={saveSettings}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : success ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                    {success ? "Saved" : "Save Changes"}
                </button>
            </div>

            <div className="space-y-6">
                {/* AI Capabilities */}
                <section className="p-6 bg-surface-dark/40 border border-border rounded-xl backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                            <Brain className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Neural Functions</h2>
                            <p className="text-xs text-muted-foreground">Configure AI processing capabilities</p>
                        </div>
                    </div>

                    <div className="space-y-4 pl-12">
                        <SettingToggle
                            label="Project Parser"
                            description="Allow AI to extract project details from raw text."
                            checked={settings.ai_features.parser_enabled}
                            onChange={(v) => updateSection("ai_features", "parser_enabled", v)}
                        />
                        <SettingToggle
                            label="Voice Transcription (Simulated)"
                            description="Process voice notes for project drafts."
                            checked={settings.ai_features.voice_enabled}
                            onChange={(v) => updateSection("ai_features", "voice_enabled", v)}
                        />
                        <SettingToggle
                            label="Deep Analysis"
                            description="Automatically generate architectural insights from GitHub."
                            checked={settings.ai_features.analysis_enabled}
                            onChange={(v) => updateSection("ai_features", "analysis_enabled", v)}
                        />
                    </div>
                </section>

                {/* Morning Brief */}
                <section className="p-6 bg-surface-dark/40 border border-border rounded-xl backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                            <Zap className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Morning Brief</h2>
                            <p className="text-xs text-muted-foreground">Daily intelligence digest</p>
                        </div>
                    </div>

                    <div className="space-y-4 pl-12">
                        <SettingToggle
                            label="Accitve"
                            description="Send daily briefing at 9:00 AM."
                            checked={settings.morning_brief.enabled}
                            onChange={(v) => updateSection("morning_brief", "enabled", v)}
                        />

                        {settings.morning_brief.enabled && (
                            <div className="flex items-center justify-between py-3 border-b border-border/50">
                                <div>
                                    <span className="block text-sm font-medium">Briefing Style</span>
                                    <span className="text-xs text-muted-foreground">Voice and tone of the report</span>
                                </div>
                                <div className="flex gap-2 p-1 bg-muted/20 rounded-lg">
                                    {(["concise", "detailed", "witty"] as const).map((style) => (
                                        <button
                                            key={style}
                                            onClick={() => updateSection("morning_brief", "style", style)}
                                            className={`px-3 py-1 text-xs rounded-md transition-all ${settings.morning_brief.style === style
                                                    ? "bg-background shadow text-foreground"
                                                    : "text-muted-foreground hover:text-foreground"
                                                }`}
                                        >
                                            {style.charAt(0).toUpperCase() + style.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Telegram */}
                <section className="p-6 bg-surface-dark/40 border border-border rounded-xl backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                            <Bell className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Signals</h2>
                            <p className="text-xs text-muted-foreground">Telegram bot configuration</p>
                        </div>
                    </div>

                    <div className="space-y-4 pl-12">
                        <SettingToggle
                            label="Push Notifications"
                            description="Receive alerts for new drafts and system events."
                            checked={settings.telegram.notifications_enabled}
                            onChange={(v) => updateSection("telegram", "notifications_enabled", v)}
                        />
                    </div>
                </section>
            </div>
        </div>
    )
}

function SettingToggle({ label, description, checked, onChange }: { label: string, description: string, checked: boolean, onChange: (v: boolean) => void }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0 hover:bg-white/5 px-2 rounded-lg transition-colors">
            <div>
                <span className="block text-sm font-medium">{label}</span>
                <span className="text-xs text-muted-foreground">{description}</span>
            </div>
            <Switch checked={checked} onCheckedChange={onChange} />
        </div>
    )
}
