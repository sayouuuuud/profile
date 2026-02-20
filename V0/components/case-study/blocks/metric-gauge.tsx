"use client"
import { useEffect, useRef } from "react"

export function MetricGaugeBlock({ data }: { data: any }) {
  const ref = useRef<SVGPathElement>(null)
  const value = data.value || 0
  const max = data.max || 100
  const percent = Math.min((value / max) * 100, 100)

  const radius = 40
  const circumference = Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.style.strokeDashoffset = String(offset); obs.unobserve(el) }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [offset])

  return (
    <div className="glass-panel p-6 rounded-lg border border-border relative group overflow-hidden flex flex-col items-center justify-between min-h-[220px] h-full card-glow">
      <span className="text-[10px] text-primary uppercase tracking-widest self-start">{data.tag}</span>
      <div className="relative w-40 h-24 my-4">
        <svg className="w-full h-full" viewBox="0 0 100 55">
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="hsl(var(--border))" strokeWidth="6" strokeLinecap="round" />
          <path ref={ref} d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="hsl(var(--primary))" strokeWidth="6" strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-[1.5s] ease-out drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            style={{ strokeDasharray: circumference, strokeDashoffset: circumference }} />
        </svg>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
          <span className="text-3xl font-black text-foreground tracking-tighter">{data.value}{data.suffix}</span>
        </div>
      </div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{data.title}</div>
    </div>
  )
}
