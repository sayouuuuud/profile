"use client"

const statusMap: Record<string, { dot: string; text: string; bg: string }> = {
  operational: { dot: "bg-[#10b981] shadow-[0_0_6px_#10b981]", text: "text-[#10b981]", bg: "bg-[#10b981]/10" },
  degraded: { dot: "bg-amber-400 shadow-[0_0_6px_#fbbf24] animate-pulse", text: "text-amber-400", bg: "bg-amber-400/10" },
  down: { dot: "bg-red-500 shadow-[0_0_6px_#ef4444] animate-pulse", text: "text-red-500", bg: "bg-red-500/10" },
}

export function StatusPanelBlock({ data }: { data: any }) {
  const indicators = data.indicators || []
  return (
    <div className="glass-panel rounded-lg border border-[#1f2937] relative overflow-hidden h-full">
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#10b981]/50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#10b981]/50" />
      <div className="px-6 py-4 border-b border-[#1f2937] bg-white/[0.02] flex items-center justify-between">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <span className="size-2 bg-[#10b981] rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
          {data.title || "SYSTEM STATUS"}
        </h3>
        <span className="text-[10px] font-mono text-[#10b981]/50">LIVE</span>
      </div>
      <div className="divide-y divide-[#1f2937]/50">
        {indicators.map((ind: any, i: number) => {
          const style = statusMap[ind.status] || statusMap.operational
          return (
            <div key={i} className="px-6 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-3">
                <div className={`size-2 rounded-full ${style.dot}`} />
                <span className="text-xs font-mono text-white uppercase tracking-wider">{ind.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#6b7280]">{ind.value}</span>
                <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${style.text} ${style.bg}`}>{ind.status}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
