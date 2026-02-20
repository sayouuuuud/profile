"use client"

import { useEffect, useState } from "react"
import { Bot, MessageSquare, Shield, AlertCircle, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function BotOverview() {
    const [status, setStatus] = useState<any>(null)

    useEffect(() => {
        fetch("/api/admin/telegram/status")
            .then(res => res.json())
            .then(data => setStatus(data))
    }, [])

    if (!status) {
        return (
            <Card>
                <CardContent className="p-8 flex flex-col items-center justify-center text-muted-foreground gap-2">
                    <RefreshCw className="size-6 animate-spin" />
                    <span>Scanning bot status...</span>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="h-full">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Bot className="size-5 text-primary" />
                        <span>Bot Status</span>
                    </div>
                    <Badge variant={status.online ? "default" : "destructive"}>
                        {status.online ? 'ONLINE' : 'OFFLINE'}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Bot Identity */}
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${status.online ? 'bg-emerald-500/10 text-emerald-600' : 'bg-destructive/10 text-destructive'}`}>
                        <Bot className="size-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">@{status.bot?.username || 'Unknown'}</h3>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                            ID: <code className="font-mono bg-muted px-1 py-0.5 rounded">{status.bot?.id || 'N/A'}</code>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MessageSquare className="size-3" />
                            <span>Messages Today</span>
                        </div>
                        <div className="text-2xl font-bold">{status.stats?.messages_today || 0}</div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <AlertCircle className="size-3" />
                            <span>Pending</span>
                        </div>
                        <div className="text-2xl font-bold">{status.stats?.pending_updates || 0}</div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Shield className="size-3" />
                            <span>Webhook</span>
                        </div>
                        <div className="text-sm font-medium truncate" title={status.webhook?.url}>
                            {status.webhook?.url ? (
                                <span className="text-emerald-600 text-xs font-bold border border-emerald-200 bg-emerald-50 px-2 py-1 rounded-full dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">Active</span>
                            ) : (
                                <span className="text-amber-600 text-xs font-bold border border-amber-200 bg-amber-50 px-2 py-1 rounded-full dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">Polling</span>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
