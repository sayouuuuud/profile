"use client"
import { useEffect, useRef } from "react"
import { Shield, Network, Lock } from "lucide-react"

function CircleFull() {
  const ref = useRef<SVGCircleElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.style.strokeDashoffset = "0"; obs.unobserve(el) }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  const circ = 2 * Math.PI * 42
  return (
    <svg className="size-full -rotate-90" viewBox="0 0 100 100">
      <circle cx="50" cy="50" fill="none" r="42" stroke="#1f2937" strokeWidth="8" />
      <circle ref={ref} cx="50" cy="50" fill="none" r="42" stroke="#10b981" strokeLinecap="round" strokeWidth="8"
        className="drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-[stroke-dashoffset] duration-[1.5s] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ strokeDasharray: circ, strokeDashoffset: circ }} />
    </svg>
  )
}

export function SystemReportBlock({ data }: { data: any }) {
  if (!data.version) return null
  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]/40 backdrop-blur-xl border border-[#1f2937] rounded-xl overflow-hidden relative group hover:border-[#10b981]/30 transition-all duration-500">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(31,41,55,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(31,41,55,0.3)_1px,transparent_1px)] bg-[size:40px_40px] opacity-50" />
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-[#10b981]/50 to-transparent" />
      <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="size-2 bg-[#10b981] rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
          <h3 className="text-xs font-mono font-bold tracking-[0.2em] text-white">SYSTEM_INTEGRITY_REPORT</h3>
        </div>
        <span className="text-[10px] font-mono text-[#10b981]/50">{data.version}</span>
      </div>
      <div className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5">
        {data.left_panel && (
          <div className="p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-20"><Shield className="size-10 text-[#10b981]" /></div>
            <div>
              <span className="text-[10px] font-mono text-[#6b7280] uppercase tracking-wider block mb-1">{data.left_panel.label}</span>
              <div className={`inline-flex items-center gap-2 px-2 py-1 rounded ${data.left_panel.badge_color === "primary" ? "bg-[#10b981]/10 border border-[#10b981]/20" : "bg-indigo-500/10 border border-indigo-500/20"}`}>
                <span className={`size-1.5 rounded-full animate-pulse ${data.left_panel.badge_color === "primary" ? "bg-[#10b981]" : "bg-indigo-400"}`} />
                <span className={`text-[10px] font-bold tracking-wide ${data.left_panel.badge_color === "primary" ? "text-[#10b981]" : "text-indigo-400"}`}>{data.left_panel.badge}</span>
              </div>
            </div>
            <div className="flex items-end gap-4 mt-6">
              <div className="relative size-20"><CircleFull /><div className="absolute inset-0 flex items-center justify-center"><Lock className="size-5 text-[#10b981]" /></div></div>
              <div className="mb-1">
                <span className="text-5xl font-black text-white tracking-tighter block leading-[0.8]" style={{ textShadow: "0 0 20px rgba(16,185,129,0.4)" }}>{data.left_panel.value}</span>
                <span className="text-[9px] text-[#6b7280] font-mono uppercase">{data.left_panel.value_label}</span>
              </div>
            </div>
          </div>
        )}
        {data.right_panel && (
          <div className="p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-20"><Network className="size-10 text-indigo-400" /></div>
            <div>
              <span className="text-[10px] font-mono text-[#6b7280] uppercase tracking-wider block mb-1">{data.right_panel.label}</span>
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/20">
                <span className="size-1.5 bg-indigo-400 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-indigo-400 tracking-wide">{data.right_panel.badge}</span>
              </div>
            </div>
            <div className="mt-4 relative h-20 w-full">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs><linearGradient id="glowG" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity="0.2" /><stop offset="100%" stopColor="#10b981" stopOpacity="0" /></linearGradient></defs>
                <path className="drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" d="M0,50 Q20,45 40,55 T80,30 T120,45 T160,20 T200,40" fill="none" stroke="#10b981" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                <path d="M0,50 Q20,45 40,55 T80,30 T120,45 T160,20 T200,40 V80 H0 Z" fill="url(#glowG)" stroke="none" />
                <circle className="animate-ping" cx="200" cy="40" fill="#10b981" r="3" /><circle cx="200" cy="40" fill="#10b981" r="3" />
              </svg>
              <div className="absolute bottom-0 right-0 text-right bg-[#0a0a0a]/80 px-2 py-1 backdrop-blur-sm rounded border border-white/5">
                <span className="text-3xl font-black text-white tracking-tighter leading-none" style={{ textShadow: "0 0 20px rgba(16,185,129,0.4)" }}>{data.right_panel.value}</span>
                <span className="text-[9px] text-[#6b7280] font-mono uppercase block">{data.right_panel.value_label}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="h-1 w-full bg-black flex gap-px opacity-30">
        <div className="h-full w-1/4 bg-[#10b981]/20" /><div className="h-full w-1/4 bg-transparent" /><div className="h-full w-1/4 bg-[#10b981]/20" /><div className="h-full w-1/4 bg-transparent" />
      </div>
    </div>
  )
}
