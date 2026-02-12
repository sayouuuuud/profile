"use client"
import { useEffect, useRef } from "react"

const colors: Record<string, string> = {
  emerald: "#10b981", red: "#ef4444", orange: "#f97316", blue: "#3b82f6", indigo: "#6366f1",
}

export function MetricGaugeBlock({ data }: { data: any }) {
  const ref = useRef<SVGPathElement>(null)
  const value = data.value || 0
  const max = data.max || 100
  const percent = Math.min((value / max) * 100, 100)
  const color = colors[data.color] || "#10b981"

  // Semi-circle arc
  const radius = 40
  const circumference = Math.PI * radius // half circle
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
    <div className="glass-panel p-6 rounded-lg border border-[#1f2937] relative group overflow-hidden flex flex-col items-center justify-between min-h-[220px] h-full">
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#10b981]/50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#10b981]/50" />
      <span className="text-[10px] font-mono text-[#10b981] uppercase tracking-widest self-start">{data.tag}</span>
      <div className="relative w-40 h-24 my-4">
        <svg className="w-full h-full" viewBox="0 0 100 55">
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1f2937" strokeWidth="6" strokeLinecap="round" />
          <path ref={ref} d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-[1.5s] ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{ strokeDasharray: circumference, strokeDashoffset: circumference, filter: `drop-shadow(0 0 8px ${color}80)` }} />
        </svg>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
          <span className="text-3xl font-black text-white tracking-tighter">{data.value}{data.suffix}</span>
        </div>
      </div>
      <div className="text-xs font-mono text-[#6b7280] uppercase tracking-wider">{data.title}</div>
    </div>
  )
}
