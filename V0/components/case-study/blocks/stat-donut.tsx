"use client"
import { useEffect, useRef } from "react"

function DonutChart({ fillPercent = 75 }: { fillPercent: number }) {
  const ref = useRef<SVGCircleElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const circumference = 2 * Math.PI * 45
    const offset = circumference - (fillPercent / 100) * circumference
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.style.strokeDashoffset = String(offset); obs.unobserve(el) }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [fillPercent])
  const circumference = 2 * Math.PI * 45
  return (
    <svg className="size-full transform -rotate-90" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
      <circle ref={ref} cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--primary))" strokeWidth="6" strokeLinecap="round"
        className="drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-[stroke-dashoffset] duration-[1.5s] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ strokeDasharray: circumference, strokeDashoffset: circumference }} />
    </svg>
  )
}

export function StatDonutBlock({ data }: { data: any }) {
  return (
    <div className="glass-panel p-6 rounded-lg border border-border relative group overflow-hidden flex flex-col justify-between min-h-[320px] h-full card-glow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="text-[10px] text-primary uppercase tracking-widest block mb-1">{data.tag}</span>
          <h3 className="text-2xl font-bold text-foreground">{data.title}</h3>
        </div>
      </div>
      <div className="flex items-center justify-center flex-1 relative my-4">
        <div className="relative size-40">
          <DonutChart fillPercent={data.fill_percent || 75} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black text-foreground tracking-tighter">{data.center_value}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{data.center_label}</span>
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center leading-relaxed px-2">{data.description}</p>
    </div>
  )
}
