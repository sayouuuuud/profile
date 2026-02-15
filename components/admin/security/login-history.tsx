"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Shield, AlertTriangle, CheckCircle, Smartphone, Monitor } from "lucide-react";

interface LoginEvent {
    id: string;
    email: string;
    status: string;
    ip_address: string;
    user_agent: string;
    created_at: string;
}

export function LoginHistory() {
    const [events, setEvents] = useState<LoginEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchHistory() {
            const { data, error } = await supabase
                .from("login_events")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(10);

            if (data) setEvents(data);
            setLoading(false);
        }
        fetchHistory();
    }, []);

    const getDeviceIcon = (ua: string) => {
        if (/mobile/i.test(ua)) return <Smartphone className="size-3" />;
        return <Monitor className="size-3" />;
    };

    const cleanUA = (ua: string) => {
        if (ua.includes("Windows")) return "Windows";
        if (ua.includes("Mac")) return "macOS";
        if (ua.includes("Android")) return "Android";
        if (ua.includes("iPhone")) return "iOS";
        return "Unknown Device";
    };

    if (loading) return <div className="h-40 animate-pulse bg-surface-dark/50 rounded-lg border border-border" />;

    return (
        <section className="p-6 rounded border border-border bg-surface-dark/50 space-y-4">
            <h2 className="text-sm font-bold text-foreground tracking-widest flex items-center gap-2">
                <Shield className="size-4 text-emerald-500" /> ACCESS LOGS
            </h2>
            <div className="overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="text-left py-2 px-3 text-muted-foreground uppercase tracking-widest">Status</th>
                            <th className="text-left py-2 px-3 text-muted-foreground uppercase tracking-widest">User</th>
                            <th className="text-left py-2 px-3 text-muted-foreground uppercase tracking-widest">Device</th>
                            <th className="text-left py-2 px-3 text-muted-foreground uppercase tracking-widest">IP</th>
                            <th className="text-right py-2 px-3 text-muted-foreground uppercase tracking-widest">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-4 text-center text-muted-foreground">No login events recorded.</td>
                            </tr>
                        ) : (
                            events.map((event) => (
                                <tr key={event.id} className="border-b border-border/50 hover:bg-foreground/[0.02]">
                                    <td className="py-2 px-3">
                                        {event.status === "success" ? (
                                            <span className="inline-flex items-center gap-1 text-emerald-500">
                                                <CheckCircle className="size-3" /> Success
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-red-500">
                                                <AlertTriangle className="size-3" /> Failed
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-2 px-3 text-foreground">{event.email}</td>
                                    <td className="py-2 px-3 text-muted-foreground flex items-center gap-1">
                                        {getDeviceIcon(event.user_agent)} {cleanUA(event.user_agent)}
                                    </td>
                                    <td className="py-2 px-3 text-muted-foreground font-mono">{event.ip_address}</td>
                                    <td className="py-2 px-3 text-right text-muted-foreground">
                                        {new Date(event.created_at).toLocaleString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
