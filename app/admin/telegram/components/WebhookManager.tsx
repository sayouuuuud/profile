"use client"

import { useState } from "react"
import { Globe, RefreshCw, Trash2, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function WebhookManager() {
    const [url, setUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)

    const handleSetWebhook = async () => {
        if (!url) return
        setLoading(true)
        try {
            const res = await fetch("/api/admin/telegram/webhook", {
                method: "POST",
                body: JSON.stringify({ url })
            })
            const data = await res.json()
            setResult({ success: data.ok, message: data.description || (data.ok ? "Webhook set successfully" : data.error) })
        } catch (e: any) {
            setResult({ success: false, message: e.message })
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteWebhook = async () => {
        if (!confirm("Are you sure? This will switch the bot to Long Polling mode.")) return
        setLoading(true)
        try {
            const res = await fetch("/api/admin/telegram/webhook", { method: "DELETE" })
            const data = await res.json()
            setResult({ success: data.ok, message: data.description || (data.ok ? "Webhook deleted" : data.error) })
        } catch (e: any) {
            setResult({ success: false, message: e.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Globe className="size-5 text-sky-500" />
                    Webhook Settings
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Webhook URL</Label>
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://your-domain.com/api/telegram/webhook"
                            className="font-mono text-sm"
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setUrl(window.location.origin + "/api/telegram/webhook")}
                            title="Auto-fill"
                        >
                            <RefreshCw className="size-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Must be HTTPS. Use the button to auto-fill current domain.
                    </p>
                </div>

                <div className="flex gap-3">
                    <Button
                        onClick={handleSetWebhook}
                        disabled={loading || !url}
                        className="flex-1"
                    >
                        {loading ? "Setting..." : "Set Webhook"}
                    </Button>
                    <Button
                        variant="destructive"
                        size="icon"
                        onClick={handleDeleteWebhook}
                        disabled={loading}
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>

                {result && (
                    <div className={`p-3 rounded-md text-xs flex items-center gap-2 ${result.success ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-destructive/10 text-destructive"}`}>
                        {result.success ? <CheckCircle className="size-3" /> : <AlertCircle className="size-3" />}
                        {result.message}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
