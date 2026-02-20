"use client";

import { useNotifications } from "@/components/providers/notifications-provider";
import {
    Bell,
    CheckCircle,
    Info,
    AlertTriangle,
    XCircle,
    Check,
    CheckCheck,
    Loader2,
} from "lucide-react";
// ui components
// We can use simple tailwind for now

export default function NotificationsPage() {
    const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();

    const getIcon = (type: string) => {
        switch (type) {
            case "success": return <CheckCircle className="size-4 text-emerald-500" />;
            case "warning": return <AlertTriangle className="size-4 text-amber-500" />;
            case "error": return <XCircle className="size-4 text-red-500" />;
            default: return <Info className="size-4 text-sky-500" />;
        }
    };

    if (loading) {
        return (
            <div className="flex-1 p-6 flex items-center justify-center">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-6 pb-20">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-foreground tracking-widest flex items-center gap-3">
                        <Bell className="size-6 text-primary" /> NOTIFICATIONS
                        {unreadCount > 0 && (
                            <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">{unreadCount} New</span>
                        )}
                    </h1>
                    <button
                        onClick={() => markAllAsRead()}
                        className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded border border-border hover:bg-surface-light text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <CheckCheck className="size-3.5" /> Mark All Read
                    </button>
                </div>

                <div className="bg-surface-dark/50 border border-border rounded-xl divide-y divide-border/50">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground text-sm flex flex-col items-center gap-2">
                            <Bell className="size-8 opacity-20" />
                            No notifications found.
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                className={`p-4 flex items-start gap-4 hover:bg-white/[0.02] transition-colors ${!n.read ? "bg-primary/[0.02]" : ""
                                    }`}
                            >
                                <div className="mt-0.5 flex-shrink-0">{getIcon(n.type)}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4">
                                        <h3 className={`text-sm font-medium ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>
                                            {n.title}
                                        </h3>
                                        <span className="text-[10px] text-muted-foreground/60 whitespace-nowrap">
                                            {new Date(n.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 break-words">
                                        {n.message}
                                    </p>
                                </div>
                                {!n.read && (
                                    <button
                                        onClick={() => markAsRead(n.id)}
                                        className="p-1 hover:bg-primary/10 rounded-full text-muted-foreground hover:text-primary transition-colors"
                                        title="Mark as read"
                                    >
                                        <Check className="size-3.5" />
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
