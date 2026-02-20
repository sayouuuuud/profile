"use client"

import { useState } from "react"
import { Play, Loader2 } from "lucide-react"

export function TestingTools() {
    const [result, setResult] = useState<any>(null)
    const [loading, setLoading] = useState<string | null>(null)

    const runTest = async (type: string, data: any = {}) => {
        setLoading(type)
        setResult(null)
        try {
            const res = await fetch("/api/admin/control/test", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type, data })
            })
            const json = await res.json()
            setResult(json)
        } catch (e) {
            setResult({ error: "Failed to run test" })
        } finally {
            setLoading(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
                <TestCard
                    title="AI Entity Parser"
                    desc="Test extracting project data from raw text."
                    action={() => runTest("ai_parser", { text: "Built a React Native app for food delivery using Supabase and Node.js. It handled 10k users." })}
                    loading={loading === "ai_parser"}
                />

                <TestCard
                    title="Health Check"
                    desc="Ping all subsystems (DB, AI, Telegram)."
                    action={() => runTest("health_check")}
                    loading={loading === "health_check"}
                />

                <TestCard
                    title="Send Test Telegram"
                    desc="Send a real test message to your Telegram."
                    action={() => runTest("telegram_bot", { message: "🧪 Test message from Mission Control" })}
                    loading={loading === "telegram_bot"}
                />

                <TestCard
                    title="Trigger Morning Brief"
                    desc="Generate and send today's morning brief now."
                    action={() => runTest("report_generation", { type: "morning_brief" })}
                    loading={loading === "report_generation"}
                />
            </div>

            {/* Results Area */}
            <div className="p-6 bg-black/40 border border-border rounded-xl font-mono text-xs">
                <h4 className="text-muted-foreground mb-2 uppercase tracking-widest">Test Output</h4>
                {result ? (
                    <pre className="overflow-x-auto text-emerald-400 whitespace-pre-wrap">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                ) : (
                    <span className="text-muted-foreground/50 italic">Run a test to see results...</span>
                )}
            </div>
        </div>
    )
}

function TestCard({ title, desc, action, loading }: any) {
    return (
        <div className="p-5 bg-surface-dark/40 border border-border rounded-xl flex items-center justify-between gap-4">
            <div>
                <h4 className="font-semibold">{title}</h4>
                <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
            <button
                onClick={action}
                disabled={loading}
                className="size-10 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors disabled:opacity-50"
            >
                {loading ? <Loader2 className="size-5 animate-spin" /> : <Play className="size-5" />}
            </button>
        </div>
    )
}
