"use client"

import { useState, useEffect } from "react"
import { BarChart, Activity, MessageSquare, FileText, AlertCircle } from "lucide-react"

const EMPTY_STATS = {
    summary: { ai_tokens: 0, ai_requests: 0, telegram_messages: 0, reports_generated: 0 },
    charts: { ai: [], telegram: [] },
    combined: []
}

export function UsageStats() {
    const [stats, setStats] = useState<any>(null)
    const [range, setRange] = useState("7d")
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchStats()
    }, [range])

    const fetchStats = async () => {
        try {
            const res = await fetch(`/api/admin/control/stats?range=${range}`)
            if (!res.ok) throw new Error("Failed to fetch stats")
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            setStats({
                summary: { ...EMPTY_STATS.summary, ...data.summary },
                charts: {
                    ai: data.charts?.ai || [],
                    telegram: data.charts?.telegram || []
                },
                combined: data.combined || []
            })
            setError(null)
        } catch (e: any) {
            console.error(e)
            setError(e.message)
            setStats(EMPTY_STATS)
        }
    }

    if (!stats) return <div className="p-8 text-center text-muted-foreground">Loading stats...</div>

    return (
        <div className="space-y-8">
            {error && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-sm flex items-center gap-2">
                    <AlertCircle className="size-4 shrink-0" />
                    {error} — showing empty data
                </div>
            )}

            {/* Header Controls */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">System Usage</h3>
                <select
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    className="bg-background border border-border rounded-md px-3 py-1.5 text-sm"
                >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                </select>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={Activity}
                    label="Total AI Tokens"
                    value={(stats.summary?.ai_tokens ?? 0).toLocaleString()}
                    sub="Input + Output"
                    color="text-emerald-500 bg-emerald-500/10"
                />
                <StatCard
                    icon={BarChart}
                    label="AI Requests"
                    value={(stats.summary?.ai_requests ?? 0).toLocaleString()}
                    sub="Total calls"
                    color="text-blue-500 bg-blue-500/10"
                />
                <StatCard
                    icon={MessageSquare}
                    label="Telegram Msgs"
                    value={(stats.summary?.telegram_messages ?? 0).toLocaleString()}
                    sub="Sent + Received"
                    color="text-sky-500 bg-sky-500/10"
                />
                <StatCard
                    icon={FileText}
                    label="Reports"
                    value={(stats.summary?.reports_generated ?? 0).toLocaleString()}
                    sub="Generated"
                    color="text-amber-500 bg-amber-500/10"
                />
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="p-6 bg-surface-dark/40 border border-border rounded-xl">
                    <h4 className="text-sm font-medium mb-6">AI Token Usage (Daily)</h4>
                    {stats.charts.ai.length > 0 ? (
                        <div className="h-48 flex items-end gap-2">
                            {stats.charts.ai.map((day: any) => {
                                const max = Math.max(...stats.charts.ai.map((d: any) => (d.input || 0) + (d.output || 0))) || 1
                                const height = (((day.input || 0) + (day.output || 0)) / max) * 100
                                return (
                                    <div key={day.date} className="flex-1 flex flex-col items-center gap-1 group">
                                        <div className="w-full relative flex-1 flex items-end bg-white/5 rounded-sm overflow-hidden">
                                            <div style={{ height: `${height}%` }} className="w-full bg-emerald-500 opacity-80 group-hover:opacity-100 transition-all" />
                                        </div>
                                        <span className="text-[10px] text-muted-foreground truncate w-full text-center">{day.date?.slice(5)}</span>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                            No AI usage data for this period
                        </div>
                    )}
                </div>

                <div className="p-6 bg-surface-dark/40 border border-border rounded-xl">
                    <h4 className="text-sm font-medium mb-6">Telegram Activity</h4>
                    {stats.charts.telegram.length > 0 ? (
                        <div className="h-48 flex items-end gap-2">
                            {stats.charts.telegram.map((day: any) => {
                                const max = Math.max(...stats.charts.telegram.map((d: any) => (d.sent || 0) + (d.received || 0))) || 1
                                const height = (((day.sent || 0) + (day.received || 0)) / max) * 100
                                return (
                                    <div key={day.date} className="flex-1 flex flex-col items-center gap-1 group">
                                        <div className="w-full relative flex-1 flex items-end bg-white/5 rounded-sm overflow-hidden">
                                            <div style={{ height: `${height}%` }} className="w-full bg-sky-500 opacity-80 group-hover:opacity-100 transition-all" />
                                        </div>
                                        <span className="text-[10px] text-muted-foreground truncate w-full text-center">{day.date?.slice(5)}</span>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                            No Telegram activity for this period
                        </div>
                    )}
                </div>
            </div>

            {/* Detailed Table */}
            <div className="bg-surface-dark/40 border border-border rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                    <h4 className="text-sm font-medium">Detailed Usage Log</h4>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-white/5">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">AI Tokens</th>
                                <th className="px-6 py-3">AI Requests</th>
                                <th className="px-6 py-3">Telegram</th>
                                <th className="px-6 py-3">Reports</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {stats.combined?.length > 0 ? (
                                stats.combined.map((row: any) => (
                                    <tr key={row.date} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-3 font-medium">{row.date}</td>
                                        <td className="px-6 py-3 font-mono text-emerald-500">{(row.ai_tokens ?? 0).toLocaleString()}</td>
                                        <td className="px-6 py-3">{row.ai_requests ?? 0}</td>
                                        <td className="px-6 py-3">{row.telegram_messages ?? 0}</td>
                                        <td className="px-6 py-3">{row.reports ?? 0}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                        No data available for this range
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function StatCard({ icon: Icon, label, value, sub, color }: any) {
    return (
        <div className="p-4 bg-surface-dark/40 border border-border rounded-xl">
            <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${color}`}>
                    <Icon className="size-4" />
                </div>
                <span className="text-sm text-muted-foreground">{label}</span>
            </div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-xs text-muted-foreground mt-1">{sub}</div>
        </div>
    )
}
