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



export function StatProgressBlock({ data }: { data: any }) {
  return (
    <div className="glass-panel p-6 rounded-lg border border-border relative group overflow-hidden flex flex-col justify-between min-h-[320px] h-full card-glow">

      <div className="flex justify-between items-start mb-6">
        <div>
          <span className={`text-[10px] font-mono uppercase tracking-widest block mb-1 ${data.tag_color === "orange" ? "text-orange-500" : "text-primary"}`}>{data.tag}</span>
          <h3 className="text-xl font-bold text-foreground">{data.title}</h3>
        </div>
        {data.badge && (
          <span className={`text-[10px] font-mono border px-2 py-1 rounded ${data.tag_color === "orange" ? "text-orange-500 border-orange-500/30 bg-orange-500/10" : "text-primary border-[#10b981]/30 bg-[#10b981]/10"}`}>{data.badge}</span>
        )}
      </div>
      <div className="bg-background/50 border border-white/5 rounded p-4 flex-1 flex flex-col justify-center">
        {(data.bars || []).map((bar: any, bi: number) => (
          <div key={bi} className={bi > 0 ? "mt-4" : ""}>
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-1 uppercase">
              <span>{bar.label}</span>
              <span className={bar.color === "orange" ? "text-orange-500 font-bold" : bar.color === "red" ? "text-red-500 font-bold" : "text-foreground"}>{bar.value}</span>
            </div>
            <div className="w-full bg-[#1f2937] h-2 rounded-full overflow-hidden relative">
              <ProgressBar percent={bar.percent} color={bar.color} />
              {bar.color === "orange" && <div className="absolute inset-0 bg-orange-500/20 blur-sm" style={{ width: `${bar.percent}%` }} />}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-4 px-1 leading-relaxed font-mono">{data.description}</p>
    </div>
  )
}
