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
  return <div ref={ref} className={`h-full ${color} transition-[width] duration-[1.5s] ease-out rounded-full`} style={{ width: "0%" }} />
}

export function MetricHighlightBlock({ data }: { data: any }) {
  const comp = data.comparison
  return (
    <div className="glass-panel p-6 rounded-lg border border-border relative group overflow-hidden flex flex-col justify-between min-h-[280px] h-full card-glow">
      <span className="text-[10px] text-primary uppercase tracking-widest">{data.tag}</span>
      <div className="my-4">
        <div className="text-5xl font-black text-foreground tracking-tighter leading-none">{data.value}</div>
        <div className="text-sm text-muted-foreground mt-2 uppercase">{data.label}</div>
      </div>
      {comp && (
        <div className="bg-card border border-border rounded p-4 space-y-3">
          <div>
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1 uppercase">
              <span>Before</span><span className="text-red-400">{comp.before}</span>
            </div>
            <div className="w-full bg-border h-2 rounded-full overflow-hidden">
              <AnimBar percent={30} color="bg-muted-foreground" />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1 uppercase">
              <span>After</span><span className="text-primary font-bold">{comp.after}</span>
            </div>
            <div className="w-full bg-border h-2 rounded-full overflow-hidden">
              <AnimBar percent={100} color="bg-primary shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
            </div>
          </div>
        </div>
      )}
      <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{data.description}</p>
    </div>
  )
}
