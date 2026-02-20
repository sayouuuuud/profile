import { ArrowDown, ArrowUp, LucideIcon } from "lucide-react";

interface DashboardStatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
    description?: string;
    loading?: boolean;
}

export function DashboardStatCard({
    label,
    value,
    icon: Icon,
    trend,
    trendUp,
    description,
    loading = false,
}: DashboardStatCardProps) {
    return (
        <div className="relative group overflow-hidden rounded-xl border border-border bg-surface-dark/50 p-5 hover:border-primary/50 transition-colors duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
                    <div className="p-2 rounded-lg bg-surface border border-white/5 text-primary">
                        <Icon className="size-4" />
                    </div>
                </div>

                <div className="mt-2 flex items-baseline gap-2">
                    {loading ? (
                        <div className="h-8 w-24 animate-pulse bg-white/5 rounded" />
                    ) : (
                        <span className="text-2xl font-bold tracking-tight text-foreground">{value}</span>
                    )}
                    {trend && !loading && (
                        <div className={`flex items-center text-xs font-medium ${trendUp ? "text-emerald-500" : "text-red-500"}`}>
                            {trendUp ? <ArrowUp className="mr-0.5 size-3" /> : <ArrowDown className="mr-0.5 size-3" />}
                            {trend}
                        </div>
                    )}
                </div>

                {description && (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{description}</p>
                )}
            </div>
        </div>
    );
}
