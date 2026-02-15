"use client";

import { useNotifications } from "@/components/providers/notifications-provider";
import { Bell } from "lucide-react";
import Link from "next/link";

export function NotificationBadge() {
    const { unreadCount } = useNotifications();

    return (
        <Link href="/admin/notifications" className="relative group block">
            <Bell className="size-5 text-muted-foreground hover:text-foreground transition-colors" />
            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                </span>
            )}
        </Link>
    );
}
