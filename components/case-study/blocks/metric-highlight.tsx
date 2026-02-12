"use client"
import { useEffect, useRef } from "react"

function AnimBar({ percent, color }: { percent: number; color: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.style.width = percent + "%"; obs.unobserve(el) }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [percent])
  return <div ref={ref} className={`h-full ${color} transition-[width] duration-[1.5s] ease-[cubic-bezier(0.4,0,0.2,1)] rounded-full`} style={{ width: "0%" }} />
}

export function MetricHighlightBlock({ data }: { data: any }) {
  const comp = data.comparison
  return (
    <div className="glass-panel p-6 rounded-lg border border-[#1f2937] relative group overflow-hidden flex flex-col justify-between min-h-[280px] h-full">
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#10b981]/50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#10b981]/50" />
      <span className="text-[10px] font-mono text-[#10b981] uppercase tracking-widest">{data.tag}</span>
      <div className="my-4">
        <div className="text-5xl font-black text-white tracking-tighter leading-none" style={{ textShadow: "0 0 20px rgba(16,185,129,0.3)" }}>{data.value}</div>
        <div className="text-sm text-[#6b7280] font-mono mt-2 uppercase">{data.label}</div>
      </div>
      {comp && (
        <div className="bg-[#0a0a0a]/50 border border-white/5 rounded p-4 space-y-3">
          <div>
            <div className="flex justify-between text-[10px] font-mono text-[#6b7280] mb-1 uppercase">
              <span>BEFORE</span><span className="text-red-400">{comp.before}</span>
            </div>
            <div className="w-full bg-[#1f2937] h-2 rounded-full overflow-hidden">
              <AnimBar percent={3} color="bg-slate-600" />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] font-mono text-[#6b7280] mb-1 uppercase">
              <span>AFTER</span><span className="text-orange-500 font-bold">{comp.after}</span>
            </div>
            <div className="w-full bg-[#1f2937] h-2 rounded-full overflow-hidden">
              <AnimBar percent={100} color="bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.6)]" />
            </div>
          </div>
        </div>
      )}
      <p className="text-xs text-[#6b7280] mt-3 leading-relaxed font-mono">{data.description}</p>
    </div>
  )
}
