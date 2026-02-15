"use client";

import { useEffect, useState } from "react";
import { Database, Zap, Activity, Cloud, Loader2, AlertTriangle } from "lucide-react";

interface CloudStats {
    plan: string;
    bandwidth: {
        usage: number;
        limit: number;
        used_percent: number;
    };
    storage: {
        usage: number;
        limit: number;
        used_percent: number;
    };
    credits?: {
        usage: number;
        limit: number;
    };
}

export function CloudDiagnosticWidget() {
    const [stats, setStats] = useState<CloudStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch("/api/cloudinary/stats");
                if (!res.ok) throw new Error("Failed to fetch cloud stats");
                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load cloud metrics");
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    const formatBytes = (bytes: number) => {
        if (!bytes || isNaN(bytes)) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const getUsageColor = (percent: number) => {
        if (percent > 90) return "bg-red-500";
        if (percent > 70) return "bg-yellow-500";
        return "bg-emerald-500";
    };

    return (
        <div className="rounded-xl border border-border bg-surface-dark/50 p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">System Diagnostic</h3>
                <div className="flex items-center gap-2">
                    <span className={`size-2 rounded-full ${error ? "bg-red-500" : "bg-emerald-500"} animate-pulse`} />
                    <span className={`text-[10px] uppercase tracking-widest ${error ? "text-red-500" : "text-emerald-500"}`}>
                        {error ? "Error" : "Optimal"}
                    </span>
                </div>
            </div>

            <div className="space-y-5 mt-2">
                {/* Storage / Bandwidth Section */}
                {loading ? (
                    <div className="flex items-center justify-center py-4 text-muted-foreground">
                        <Loader2 className="size-5 animate-spin mr-2" /> Loading Telemetry...
                    </div>
                ) : error ? (
                    <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20">
                        <AlertTriangle className="size-3" /> system_monitor_fail
                    </div>
                ) : stats ? (
                    <>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground flex items-center gap-2">
                                    <Cloud className="size-3 text-emerald-400" /> Bandwidth
                                </span>
                                <span className="text-foreground font-mono">
                                    {formatBytes(stats.bandwidth.usage)} / {formatBytes(stats.bandwidth.limit)}
                                </span>
                            </div>
                            <div className="w-full h-1.5 bg-surface-light rounded-full overflow-hidden border border-white/5">
                                <div
                                    className={`h-full ${getUsageColor(stats.bandwidth.used_percent)} transition-all duration-500`}
                                    style={{ width: `${Math.min(stats.bandwidth.used_percent, 100)}%` }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground flex items-center gap-2">
                                    <Database className="size-3 text-blue-400" /> Storage
                                </span>
                                <span className="text-foreground font-mono">
                                    {formatBytes(stats.storage.usage)} / {formatBytes(stats.storage.limit)}
                                </span>
                            </div>
                            <div className="w-full h-1.5 bg-surface-light rounded-full overflow-hidden border border-white/5">
                                <div
                                    className={`h-full ${getUsageColor(stats.storage.used_percent)} transition-all duration-500`}
                                    style={{ width: `${Math.min(stats.storage.used_percent, 100)}%` }}
                                />
                            </div>
                        </div>
                    </>
                ) : null}


                {/* Mock Metrics (Latency / Error Rate) - Could be hooked up to real monitoring later */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-2">
                            <Zap className="size-3 text-amber-400" /> API Latency
                        </span>
                        <span className="text-foreground font-mono">24ms</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-light rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-emerald-500 w-[15%]" />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-2">
                            <Activity className="size-3 text-red-400" /> Error Rate
                        </span>
                        <span className="text-foreground font-mono">0.02%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-light rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-emerald-500 w-[1%]" />
                    </div>
                </div>
            </div>
        </div>
    );
}
