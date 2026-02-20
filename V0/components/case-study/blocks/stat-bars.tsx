"use client"
import { useEffect, useRef } from "react"

function BarChart({ heights }: { heights: number[] }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.querySelectorAll<HTMLDivElement>("[data-bar]").forEach(bar => { bar.style.height = bar.dataset.bar + "%" })
        obs.unobserve(el)
      }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className="h-24 flex items-end justify-center gap-1.5 mb-4 px-4">
      {heights.map((h, i) => (
        <div key={i} data-bar={h}
          className={`w-1.5 rounded-sm transition-[height] duration-1000 ease-out ${h === 100 ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : ""}`}
          style={{ height: "0%", transitionDelay: `${i * 80}ms`, backgroundColor: h === 100 ? undefined : `rgba(16,185,129,${0.2 + h / 200})` }} />
      ))}
    </div>
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

export function StatBarsBlock({ data }: { data: any }) {
  return (
    <div className="glass-panel p-6 rounded-lg border border-border relative group overflow-hidden flex flex-col justify-between min-h-[320px] h-full">
      <CornerAccents />
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-[10px] font-mono text-[#10b981] uppercase tracking-widest block mb-1">{data.tag}</span>
          <h3 className="text-xl font-bold text-white">{data.title}</h3>
        </div>
      </div>
      <BarChart heights={data.bar_heights || [30, 50, 40, 70, 100, 60, 45, 25]} />
      <div className="bg-[#0a0a0a]/50 border border-white/5 rounded p-3 flex justify-between items-center">
        <span className="text-[10px] font-mono text-[#6b7280] uppercase">LOAD TIME</span>
        <div className="flex items-center gap-2 font-mono text-sm">
          <span className="text-red-500 line-through opacity-60 text-xs">{data.load_before}</span>
          <span className="text-[#6b7280] text-[10px]">{"\u2192"}</span>
          <span className="text-white font-bold text-base">{data.load_after}</span>
        </div>
      </div>
    </div>
  )
}
