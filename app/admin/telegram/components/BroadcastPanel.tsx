"use client"

import { useState } from "react"
import { Send, Users, User, AlertTriangle, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export function BroadcastPanel() {
    const [target, setTarget] = useState("me") // me, all, specific
    const [chatId, setChatId] = useState("")
    const [message, setMessage] = useState("")
    const [sending, setSending] = useState(false)
    const [status, setStatus] = useState<any>(null)

    const handleSend = async () => {
        if (!message) return
        setSending(true)
        setStatus(null)

        try {
            const res = await fetch("/api/admin/telegram/broadcast", {
                method: "POST",
                body: JSON.stringify({ target, chatId, message, parseMode: "HTML" })
            })
            const data = await res.json()
            setStatus(data)
            if (data.success) {
                setMessage("")
                // Auto-clear status after 3 seconds
                setTimeout(() => setStatus(null), 3000)
            }
        } catch (e) {
            console.error(e)
            setStatus({ error: "Failed to send" })
        } finally {
            setSending(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Send className="size-5 text-primary" />
                    Broadcast Message
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Target Selection */}
                <div className="grid grid-cols-3 gap-3">
                    <Button
                        variant={target === "me" ? "default" : "outline"}
                        className="h-auto py-4 flex flex-col gap-2"
                        onClick={() => setTarget("me")}
                    >
                        <User className="size-4" />
                        <span>Test (@sayouuud)</span>
                    </Button>
                    <Button
                        variant={target === "all" ? "default" : "outline"}
                        className="h-auto py-4 flex flex-col gap-2"
                        onClick={() => setTarget("all")}
                    >
                        <Users className="size-4" />
                        <span>All Users</span>
                    </Button>
                    <Button
                        variant={target === "specific" ? "default" : "outline"}
                        className="h-auto py-4 flex flex-col gap-2"
                        onClick={() => setTarget("specific")}
                    >
                        <Send className="size-4" />
                        <span>Specific ID</span>
                    </Button>
                </div>

                {target === "specific" && (
                    <Input
                        placeholder="Enter Chat ID"
                        value={chatId}
                        onChange={(e) => setChatId(e.target.value)}
                    />
                )}

                {target === "all" && (
                    <div className="flex items-center gap-2 p-3 text-sm text-amber-500 bg-amber-500/10 rounded-md">
                        <AlertTriangle className="size-4" />
                        <span>Warning: This will message ALL known users in the database.</span>
                    </div>
                )}

                {/* Message Input */}
                <div className="space-y-2">
                    <Textarea
                        placeholder="Type your message here... (HTML supported: <b>bold</b>, <i>italic</i>)"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[120px] font-mono text-sm"
                    />
                    <div className="text-xs text-muted-foreground text-right">
                        Supports HTML Tags
                    </div>
                </div>

                {/* Send Button */}
                <Button
                    onClick={handleSend}
                    disabled={sending || !message || (target === "specific" && !chatId)}
                    className="w-full"
                >
                    {sending ? (
                        <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send className="mr-2 size-4" />
                            Send Broadcast
                        </>
                    )}
                </Button>

                {/* Status Feedback */}
                {status && (
                    <div className={`p-3 rounded-md text-sm font-medium ${status.success ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-destructive/10 text-destructive"}`}>
                        {status.success
                            ? `✅ Successfully sent to ${status.sent} user(s)`
                            : `❌ Error: ${status.error || 'Unknown error'}`}

                        {/* Specific Help for "Forbidden" Error */}
                        {status.error?.includes("Forbidden") && (
                            <div className="mt-2 text-xs bg-black/10 dark:bg-white/10 p-2 rounded">
                                💡 <strong>حل المشكلة:</strong> البوت لا يستطيع مراسلتك.
                                <br />
                                1. افتح البوت في تيليجرام.
                                <br />
                                2. اضغط على <strong>Start</strong> أو أرسل <code>/start</code>.
                                <br />
                                3. حاول الإرسال مرة أخرى.
                            </div>
                        )}

                        {status.debug_admin_id && (
                            <div className="mt-2 text-xs opacity-75 border-t border-black/10 dark:border-white/10 pt-2">
                                🕵️ Debug: Admin ID identified as: <span className="font-mono bg-black/10 dark:bg-white/10 px-1 rounded">{status.debug_admin_id}</span>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
