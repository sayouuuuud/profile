"use client"

const statusColors: Record<string, string> = {
  improved: "text-[#10b981]",
  degraded: "text-red-400",
  unchanged: "text-[#6b7280]",
}

export function ComparisonTableBlock({ data }: { data: any }) {
  const rows = data.rows || []
  return (
    <div className="glass-panel rounded-lg border border-[#1f2937] relative overflow-hidden h-full">
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#10b981]/50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#10b981]/50" />
      <div className="px-6 py-4 border-b border-[#1f2937] bg-white/[0.02]">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <span className="size-1.5 bg-[#10b981] rounded-full" />
          {data.title || "COMPARISON"}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-[#1f2937]">
              <th className="text-left text-[#6b7280] uppercase tracking-wider px-6 py-3 font-normal">Metric</th>
              <th className="text-center text-red-400/60 uppercase tracking-wider px-4 py-3 font-normal">Before</th>
              <th className="text-center text-[#10b981]/60 uppercase tracking-wider px-4 py-3 font-normal">After</th>
              <th className="text-right text-[#6b7280] uppercase tracking-wider px-6 py-3 font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row: any, i: number) => (
              <tr key={i} className="border-b border-[#1f2937]/50 hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 text-white font-bold">{row.label}</td>
                <td className="px-4 py-3 text-center text-red-400/60 line-through">{row.before}</td>
                <td className="px-4 py-3 text-center text-white font-bold">{row.after}</td>
                <td className="px-6 py-3 text-right">
                  <span className={`uppercase text-[10px] font-bold ${statusColors[row.status] || "text-[#6b7280]"}`}>
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
