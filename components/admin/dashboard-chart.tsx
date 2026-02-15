
interface ChartDataPoint {
    label: string;
    value: number;
    color?: string;
}

interface DashboardChartProps {
    title: string;
    data: ChartDataPoint[];
    loading?: boolean;
    height?: number;
}

export function DashboardChart({ title, data, loading = false, height = 200 }: DashboardChartProps) {
    const maxValue = Math.max(...data.map((d) => d.value), 1); // Avoid division by zero

    if (loading) {
        return (
            <div className="rounded-xl border border-border bg-surface-dark/50 p-5 space-y-4">
                <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-24 h-3 bg-white/5 rounded animate-pulse" />
                            <div className="flex-1 h-6 bg-white/5 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border bg-surface-dark/50 p-5">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6">{title}</h3>

            <div className="space-y-4">
                {data.map((item, index) => {
                    const widthRef = (item.value / maxValue) * 100;
                    return (
                        <div key={index} className="group relative">
                            <div className="flex items-center justify-between text-xs mb-1.5 z-10 relative">
                                <span className="text-foreground font-medium flex items-center gap-2">
                                    <div className="size-2 rounded-full" style={{ backgroundColor: item.color || "var(--primary)" }} />
                                    {item.label}
                                </span>
                                <span className="text-muted-foreground font-mono">{item.value}</span>
                            </div>

                            <div className="h-2 w-full bg-surface-dark rounded-full overflow-hidden relative">
                                <div
                                    className="h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-125 relative"
                                    style={{
                                        width: `${widthRef}%`,
                                        backgroundColor: item.color || "var(--primary)",
                                        // Subtle glowing effect
                                        boxShadow: `0 0 10px ${item.color || "var(--primary)"}40`
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}

                {data.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-32 text-muted-foreground text-xs text-center border border-dashed border-border rounded-lg bg-surface/30">
                        No data available
                    </div>
                )}
            </div>
        </div>
    );
}
