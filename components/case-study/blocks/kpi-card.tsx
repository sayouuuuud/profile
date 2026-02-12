"use client"

export function KpiCardBlock({ data }: { data: any }) {
  const sparkline = data.sparkline || [20, 35, 28, 45, 60, 55, 70, 85]
  const max = Math.max(...sparkline, 1)
  const points = sparkline.map((v: number, i: number) => `${(i / (sparkline.length - 1)) * 100},${100 - (v / max) * 80}`).join(" ")
  const fillPoints = `0,100 ${points} 100,100`
  const isUp = data.delta_direction === "up"

  return (
    <div className="glass-panel p-6 rounded-lg border border-[#1f2937] relative group overflow-hidden flex flex-col justify-between min-h-[220px] h-full hover:border-[#10b981]/30 transition-all duration-500">
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#10b981]/50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#10b981]/50" />
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-mono text-[#10b981] uppercase tracking-widest">{data.tag}</span>
        {data.delta && (
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${isUp ? "text-[#10b981] border-[#10b981]/30 bg-[#10b981]/10" : "text-red-400 border-red-400/30 bg-red-400/10"}`}>
            {data.delta}
          </span>
        )}
      </div>
      <div className="my-4">
        <div className="text-4xl font-black text-white tracking-tighter leading-none" style={{ textShadow: "0 0 20px rgba(16,185,129,0.3)" }}>{data.title}</div>
        <div className="text-xs text-[#6b7280] font-mono mt-1 uppercase">{data.subtitle}</div>
      </div>
      <div className="h-16 w-full relative">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`kpi-fill-${data.tag}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={isUp ? "#10b981" : "#ef4444"} stopOpacity="0.3" />
              <stop offset="100%" stopColor={isUp ? "#10b981" : "#ef4444"} stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={fillPoints} fill={`url(#kpi-fill-${data.tag})`} />
          <polyline points={points} fill="none" stroke={isUp ? "#10b981" : "#ef4444"} strokeWidth="2" vectorEffect="non-scaling-stroke" className="drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
        </svg>
      </div>
    </div>
  )
}
