"use client"

const statusColors: Record<string, string> = {
  improved: "text-primary",
  degraded: "text-red-400",
  unchanged: "text-muted-foreground",
}

export function ComparisonTableBlock({ data }: { data: any }) {
  const rows = data.rows || []
  return (
    <div className="glass-panel rounded-lg border border-border relative overflow-hidden h-full card-glow">
      <div className="px-6 py-4 border-b border-border bg-card/50">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <span className="size-1.5 bg-primary rounded-full" />
          {data.title || "Comparison"}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-muted-foreground uppercase tracking-wider px-6 py-3 font-normal">Metric</th>
              <th className="text-center text-red-400/60 uppercase tracking-wider px-4 py-3 font-normal">Before</th>
              <th className="text-center text-primary/60 uppercase tracking-wider px-4 py-3 font-normal">After</th>
              <th className="text-right text-muted-foreground uppercase tracking-wider px-6 py-3 font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row: any, i: number) => (
              <tr key={i} className="border-b border-border/50 hover:bg-card/30 transition-colors">
                <td className="px-6 py-3 text-foreground font-bold">{row.label}</td>
                <td className="px-4 py-3 text-center text-red-400/60 line-through">{row.before}</td>
                <td className="px-4 py-3 text-center text-foreground font-bold">{row.after}</td>
                <td className="px-6 py-3 text-right">
                  <span className={`uppercase text-[10px] font-bold ${statusColors[row.status] || "text-muted-foreground"}`}>
                    {row.status === "improved" ? "IMPROVED" : row.status === "degraded" ? "DEGRADED" : "SAME"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
