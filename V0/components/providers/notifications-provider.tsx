"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Bell } from "lucide-react";

type NotificationType = "info" | "success" | "warning" | "error";

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    read: boolean;
    created_at: string;
}

interface NotificationsContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    loading: boolean;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        // Initial fetch
        async function fetchNotifications() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setLoading(false);
                return;
            }

            const { data } = await supabase
                .from("notifications")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(50);

            if (data) setNotifications(data);
            setLoading(false);
        }

        fetchNotifications();

        // Realtime subscription
        const channel = supabase
            .channel("notifications")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "notifications",
                },
                (payload) => {
                    const newNotification = payload.new as Notification;
                    setNotifications((prev) => [newNotification, ...prev]);

                    // Show toast
                    toast(newNotification.title, {
                        description: newNotification.message,
                        icon: <Bell className="size-4" />,
                        // style based on type? Sonner supports styles?
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const markAsRead = async (id: string) => {
        // Optimistic update
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );

        await supabase.from("notifications").update({ read: true }).eq("id", id);
    };

    const markAllAsRead = async () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        await supabase.from("notifications").update({ read: true }).eq("read", false);
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <NotificationsContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, loading }}>
            {children}
        </NotificationsContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationsContext);
    if (context === undefined) {
        throw new Error("useNotifications must be used within a NotificationsProvider");
    }
    return context;
}
