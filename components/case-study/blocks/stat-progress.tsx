"use client"
import { useEffect, useRef } from "react"

function ProgressBar({ percent, color }: { percent: number; color: string }) {
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
  const bgColor = color === "orange" ? "bg-orange-500" : color === "red" ? "bg-red-500" : color === "emerald" ? "bg-emerald-500" : "bg-slate-600"
  const shadowColor = color === "orange" ? "shadow-[0_0_10px_rgba(249,115,22,0.6)]" : color === "red" ? "shadow-[0_0_10px_rgba(239,68,68,0.6)]" : ""
  return <div ref={ref} className={`h-full ${bgColor} ${shadowColor} relative z-10 transition-[width] duration-[1.5s] ease-[cubic-bezier(0.4,0,0.2,1)]`} style={{ width: "0%" }} />
}

function CornerAccents() {
  return (
    <>
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#10b981]/50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#10b981]/50" />
    </>
  )
}

export function StatProgressBlock({ data }: { data: any }) {
  return (
    <div className="glass-panel p-6 rounded-lg border border-[#1f2937] relative group overflow-hidden flex flex-col justify-between min-h-[320px] h-full">
      <CornerAccents />
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className={`text-[10px] font-mono uppercase tracking-widest block mb-1 ${data.tag_color === "orange" ? "text-orange-500" : "text-[#10b981]"}`}>{data.tag}</span>
          <h3 className="text-xl font-bold text-white">{data.title}</h3>
        </div>
        {data.badge && (
          <span className={`text-[10px] font-mono border px-2 py-1 rounded ${data.tag_color === "orange" ? "text-orange-500 border-orange-500/30 bg-orange-500/10" : "text-[#10b981] border-[#10b981]/30 bg-[#10b981]/10"}`}>{data.badge}</span>
        )}
      </div>
      <div className="bg-[#0a0a0a]/50 border border-white/5 rounded p-4 flex-1 flex flex-col justify-center">
        {(data.bars || []).map((bar: any, bi: number) => (
          <div key={bi} className={bi > 0 ? "mt-4" : ""}>
            <div className="flex justify-between text-[10px] font-mono text-[#6b7280] mb-1 uppercase">
              <span>{bar.label}</span>
              <span className={bar.color === "orange" ? "text-orange-500 font-bold" : bar.color === "red" ? "text-red-500 font-bold" : "text-white"}>{bar.value}</span>
            </div>
            <div className="w-full bg-[#1f2937] h-2 rounded-full overflow-hidden relative">
              <ProgressBar percent={bar.percent} color={bar.color} />
              {bar.color === "orange" && <div className="absolute inset-0 bg-orange-500/20 blur-sm" style={{ width: `${bar.percent}%` }} />}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-[#6b7280] mt-4 px-1 leading-relaxed font-mono">{data.description}</p>
    </div>
  )
}
