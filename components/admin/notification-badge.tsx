"use client";

import { useNotifications } from "@/components/providers/notifications-provider";
import { Bell, CheckSquare, Mail, AlertCircle, Info, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

export function NotificationBadge() {
    const { notifications = [], unreadCount = 0, markAsRead, markAllAsRead } = useNotifications() as any;

    const displayNotifications = notifications.slice(0, 5);

    const getIcon = (type: string) => {
        switch (type) {
            case "info": return <Info className="size-4 text-blue-500" />;
            case "success": return <CheckCircle2 className="size-4 text-emerald-500" />;
            case "warning": return <AlertCircle className="size-4 text-amber-500" />;
            case "error": return <AlertCircle className="size-4 text-red-500" />;
            default: return <Mail className="size-4 text-primary" />;
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="relative group block p-2 hover:bg-muted/50 rounded-md transition-colors outline-none cursor-pointer">
                    <Bell className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-background">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0 overflow-hidden shadow-lg border-border" sideOffset={8}>
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                    <span className="text-sm font-semibold text-foreground">Notifications</span>
                    {unreadCount > 0 && (
                        <button 
                            onClick={() => markAllAsRead()}
                            className="text-xs text-primary hover:text-primary/80 hover:underline flex items-center gap-1 transition-colors"
                        >
                            <CheckSquare className="size-3" />
                            Mark all read
                        </button>
                    )}
                </div>

                <ScrollArea className="max-h-[320px]">
                    {displayNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                            <Bell className="size-8 text-muted-foreground/30 mb-3" />
                            <p className="text-sm font-medium text-foreground">All caught up!</p>
                            <p className="text-xs text-muted-foreground mt-1">Check back later for new notifications.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {displayNotifications.map((notification: any) => (
                                <Link
                                    key={notification.id}
                                    href="/admin/notifications"
                                    onClick={() => !notification.read && markAsRead(notification.id)}
                                    className={`flex gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0 ${!notification.read ? 'bg-primary/5' : ''}`}
                                >
                                    <div className="mt-0.5 shrink-0">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex flex-col gap-1 w-full min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <span className={`text-sm truncate ${!notification.read ? 'font-semibold text-foreground' : 'font-medium text-foreground/80'}`}>
                                                {notification.title}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0 mt-0.5">
                                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className={`text-xs line-clamp-2 ${!notification.read ? 'text-foreground/80' : 'text-muted-foreground'}`}>
                                            {notification.message}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                <div className="p-2 border-t border-border bg-muted/10">
                    <Link
                        href="/admin/notifications"
                        className="block w-full py-1.5 text-center text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                    >
                        View all notifications
                    </Link>
                </div>
            </PopoverContent>
        </Popover>
    );
}
