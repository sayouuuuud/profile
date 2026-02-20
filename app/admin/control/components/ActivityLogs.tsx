"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"

export function ActivityLogs() {
    const [logs, setLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState("all")

    useEffect(() => {
        fetchLogs()
    }, [filter])

    const fetchLogs = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/admin/control/logs?level=${filter}`)
            const data = await res.json()
            setLogs(data.logs || [])
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const getIcon = (level: string) => {
        switch (level) {
            case "error": return <AlertCircle className="size-4 text-red-500" />
            case "warning": return <AlertTriangle className="size-4 text-amber-500" />
            case "success": return <CheckCircle className="size-4 text-emerald-500" />
            default: return <Info className="size-4 text-blue-500" />
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">System Activity</h3>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-background border border-border rounded-md px-3 py-1.5 text-sm"
                >
                    <option value="all">All Levels</option>
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                </select>
            </div>

            <div className="border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/30 border-b border-border text-muted-foreground">
                        <tr>
                            <th className="px-4 py-3 font-medium">Timestamp</th>
                            <th className="px-4 py-3 font-medium">Level</th>
                            <th className="px-4 py-3 font-medium">Category</th>
                            <th className="px-4 py-3 font-medium">Message</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                                    {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td className="px-4 py-3 uppercase text-xs font-semibold">
                                    <div className="flex items-center gap-2">
                                        {getIcon(log.level)}
                                        <span>{log.level}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-0.5 rounded-full bg-muted/50 text-[10px] uppercase tracking-wide">
                                        {log.category}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-foreground/90 font-medium">
                                    {log.message}
                                </td>
                            </tr>
                        ))}
                        {logs.length === 0 && !loading && (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No logs found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
