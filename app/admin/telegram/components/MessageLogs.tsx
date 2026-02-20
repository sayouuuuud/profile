"use client"

import { useEffect, useState } from "react"
import { ScrollText, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function MessageLogs() {
    const [logs, setLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/admin/control/logs?category=telegram")
            .then(res => res.json())
            .then(data => {
                setLogs(data.logs ? data.logs.slice(0, 50) : [])
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ScrollText className="size-5 text-indigo-500" />
                    Live Activity
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto pr-2 space-y-3">
                    {loading ? (
                        <div className="flex items-center justify-center h-20 text-muted-foreground">
                            <Loader2 className="size-4 animate-spin mr-2" />
                            Loading logs...
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="text-center text-muted-foreground text-sm py-8">No recent activity</div>
                    ) : (
                        logs.map((log) => (
                            <div key={log.id} className="p-3 bg-muted rounded-md border text-xs">
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`font-mono font-bold ${log.level === 'error' ? 'text-destructive' : 'text-primary'}`}>
                                        {log.action}
                                    </span>
                                    <span className="text-muted-foreground text-[10px]">
                                        {new Date(log.created_at).toLocaleTimeString()}
                                    </span>
                                </div>
                                <div className="text-foreground/80 break-words">
                                    {log.message}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
