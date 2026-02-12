"use client"

const statusStyles: Record<string, { dot: string; badge: string; text: string }> = {
  completed: { dot: "bg-[#10b981] shadow-[0_0_8px_#10b981]", badge: "text-[#10b981] border-[#10b981]/30 bg-[#10b981]/10", text: "DONE" },
  "in-progress": { dot: "bg-amber-400 shadow-[0_0_8px_#fbbf24] animate-pulse", badge: "text-amber-400 border-amber-400/30 bg-amber-400/10", text: "ACTIVE" },
  pending: { dot: "bg-[#6b7280]", badge: "text-[#6b7280] border-[#6b7280]/30 bg-[#6b7280]/10", text: "PENDING" },
}

export function TimelineBlock({ data }: { data: any }) {
  const milestones = data.milestones || []
  return (
    <div className="glass-panel p-8 rounded-lg border border-[#1f2937] relative h-full">
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#10b981]/50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#10b981]/50" />
      <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-8 flex items-center gap-3">
        <span className="size-1.5 bg-[#10b981] rounded-full" />
        {data.title || "ROADMAP"}
      </h3>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[11px] top-0 bottom-0 w-px bg-gradient-to-b from-[#10b981]/50 via-[#1f2937] to-transparent" />
        <div className="space-y-8">
          {milestones.map((m: any, i: number) => {
            const style = statusStyles[m.status] || statusStyles.pending
            return (
              <div key={i} className="relative flex items-start gap-6 pl-8">
                <div className={`absolute left-[7px] top-1.5 size-2.5 rounded-full ${style.dot} z-10`} />
                <div className="flex-1 bg-[#0a0a0a]/50 border border-[#1f2937] rounded p-4 hover:border-[#10b981]/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-white">{m.title}</h4>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${style.badge}`}>{style.text}</span>
                  </div>
                  <div className="text-[10px] font-mono text-[#10b981]/60 mb-1">{m.date}</div>
                  <p className="text-xs text-[#6b7280] leading-relaxed">{m.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
