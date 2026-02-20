"use client"

import { useState, useEffect } from "react"
import { DollarSign, TrendingUp, AlertCircle, Database, Server, MessageCircle, Cpu } from "lucide-react"

export function CostAnalysis() {
    const [costs, setCosts] = useState<any>(null)

    useEffect(() => {
        fetchCosts()
    }, [])

    const fetchCosts = async () => {
        try {
            const res = await fetch("/api/admin/control/costs")
            const data = await res.json()
            setCosts(data)
        } catch (e) {
            console.error(e)
        }
    }

    if (!costs) return <div className="p-8 text-center text-muted-foreground">Calculating costs...</div>

    return (
        <div className="space-y-6">
            {/* Hero Total Card */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <DollarSign className="size-32" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-blue-100 font-medium mb-1">Total Estimated Cost (30d)</h3>
                    <div className="text-5xl font-bold mb-4">${costs.total.toFixed(4)}</div>
                    <div className="flex items-center gap-2 text-sm text-blue-100/80 bg-blue-900/30 w-fit px-3 py-1 rounded-full border border-blue-500/30">
                        <TrendingUp className="size-4" />
                        <span>Projected Monthly: ${costs.projections.monthly.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Breakdown Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <CostCard
                    title="Gemini AI"
                    cost={costs.breakdown.gemini.cost}
                    detail={`${costs.breakdown.gemini.tokens.toLocaleString()} tokens`}
                    icon={Cpu}
                />
                <CostCard
                    title="Telegram"
                    cost={0}
                    detail="Free"
                    icon={MessageCircle}
                />
                <CostCard
                    title="Supabase"
                    cost={0}
                    detail="Free Tier"
                    icon={Database}
                />
                <CostCard
                    title="Vercel"
                    cost={0}
                    detail="Hobby Plan"
                    icon={Server}
                />
            </div>

            {/* Optimization Tips */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex gap-3">
                <AlertCircle className="size-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-medium text-amber-500 mb-1">Optimization Tips</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Switch to <strong>Gemini 1.5 Flash</strong> for 95% cheaper inference.</li>
                        <li>Reduce Context Window if parsing smaller files.</li>
                        <li>Monitor cache hit rates (when available).</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

function CostCard({ title, cost, detail, icon: Icon }: any) {
    return (
        <div className="p-4 bg-surface-dark/40 border border-border rounded-xl flex items-center justify-between">
            <div>
                <span className="text-xs text-muted-foreground block mb-1">{title}</span>
                <div className="text-xl font-bold mb-1">${cost.toFixed(4)}</div>
                <div className="text-xs text-emerald-500">{detail}</div>
            </div>
            <div className="p-2 bg-muted/20 rounded-lg text-muted-foreground">
                <Icon className="size-5" />
            </div>
        </div>
    )
}
