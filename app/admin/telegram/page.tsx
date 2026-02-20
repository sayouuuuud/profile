import { BotOverview } from "./components/BotOverview"
import { BroadcastPanel } from "./components/BroadcastPanel"
import { WebhookManager } from "./components/WebhookManager"
import { MessageLogs } from "./components/MessageLogs"
import { ReportConfig } from "./components/ReportConfig"

export default function TelegramPage() {
    return (
        <div className="relative min-h-full">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-black to-black pointer-events-none -z-10" />

            <div className="relative z-10 max-w-6xl mx-auto space-y-8 p-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Telegram Command Center</h1>
                    <p className="text-muted-foreground">Bot management, notifications, reports, and broadcasts.</p>
                </div>

                {/* Top Row: Overview + Webhook */}
                <div className="grid lg:grid-cols-2 gap-6">
                    <BotOverview />
                    <WebhookManager />
                </div>

                {/* Config Row: Notifications & Reports */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        ⚙️ Notifications & Reports
                    </h2>
                    <ReportConfig />
                </div>

                {/* Bottom Row: Broadcast + Logs */}
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <BroadcastPanel />
                    </div>
                    <div className="lg:col-span-1">
                        <MessageLogs />
                    </div>
                </div>
            </div>
        </div>
    )
}
