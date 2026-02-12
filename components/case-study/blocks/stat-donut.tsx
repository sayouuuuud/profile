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
      <circle cx="50" cy="50" r="45" fill="none" stroke="#1f2937" strokeWidth="6" />
      <circle ref={ref} cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="6" strokeLinecap="round"
        className="drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-[stroke-dashoffset] duration-[1.5s] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ strokeDasharray: circumference, strokeDashoffset: circumference }} />
    </svg>
  )
}

function CornerAccents() {
  return (
    <>
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#10b981]/50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#10b981]/50" />
    </>
  )
}

export function StatDonutBlock({ data }: { data: any }) {
  return (
    <div className="glass-panel p-6 rounded-lg border border-[#1f2937] relative group overflow-hidden flex flex-col justify-between min-h-[320px] h-full">
      <CornerAccents />
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="text-[10px] font-mono text-[#10b981] uppercase tracking-widest block mb-1">{data.tag}</span>
          <h3 className="text-2xl font-bold text-white">{data.title}</h3>
        </div>
      </div>
      <div className="flex items-center justify-center flex-1 relative my-4">
        <div className="relative size-40">
          <DonutChart fillPercent={data.fill_percent || 75} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black text-white tracking-tighter">{data.center_value}</span>
            <span className="text-[10px] font-mono text-[#6b7280] uppercase tracking-widest mt-1">{data.center_label}</span>
          </div>
        </div>
      </div>
      <p className="text-xs text-[#6b7280] text-center leading-relaxed font-mono px-2">{data.description}</p>
    </div>
  )
}
