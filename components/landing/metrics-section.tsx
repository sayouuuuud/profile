"use client"

import { useEffect, useRef, useState } from "react"
import { ScrollReveal } from "@/components/scroll-reveal"

interface Metric {
  id: string
  title: string
  value: string
  suffix: string | null
  icon: string | null
}

function AnimatedNumber({ target, suffix, suffixColor = "#10b981" }: { target: string; suffix: string; suffixColor?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [display, setDisplay] = useState("0")

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          const numericVal = parseFloat(target.replace(/[^0-9.]/g, ""))
          if (isNaN(numericVal)) { setDisplay(target); obs.unobserve(el); return }
          const duration = 1500
          const start = performance.now()
          const animate = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            const current = numericVal * eased
            setDisplay(numericVal % 1 !== 0 ? current.toFixed(1) : Math.floor(current).toString())
            if (progress < 1) requestAnimationFrame(animate)
            else setDisplay(target.replace(/[^0-9.kK+]/g, ""))
          }
          requestAnimationFrame(animate)
          obs.unobserve(el)
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])

  return (
    <div ref={ref} className="text-5xl font-light text-white tracking-tighter">
      {display}<span className="text-2xl" style={{ color: suffixColor }}>{suffix}</span>
    </div>
  )
}

export function MetricsSection({ metrics }: { metrics: Metric[] }) {
  const defaultMetrics = [
    { title: "Infra Savings", value: "0", suffix: "$", label: "Target: Zero Cost Baseline" },
    { title: "Capacity", value: "1k", suffix: "+", label: "Enterprise Assets Managed" },
    { title: "Latency (TTFB)", value: "0.1", suffix: "s", label: "Global Response Time" },
  ]

  return (
    <section className="px-6 md:px-12 py-12" id="metrics">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-stretch">
        {[0, 1, 2].map((i) => (
          <ScrollReveal key={i} delay={(i + 1) * 100} className="h-full">
            <div className="glass-panel p-8 rounded-sm border border-[#1f2937] relative group overflow-hidden flex flex-col justify-between h-full min-h-[220px] hover:border-[#10b981]/30 transition-all duration-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-sm font-mono text-[#6b7280] uppercase tracking-[0.2em] mb-2">
                    {metrics[i]?.title || defaultMetrics[i].title}
                  </h3>
                  <AnimatedNumber
                    target={metrics[i]?.value || defaultMetrics[i].value}
                    suffix={i === 1 ? "+" : (metrics[i]?.suffix || defaultMetrics[i].suffix)}
                    suffixColor={i === 1 ? "#f97316" : "#10b981"}
                  />
                </div>
              </div>
              <div className="mt-auto">
                {i === 0 && (
                  <div className="h-16 flex items-end gap-1 w-full opacity-50">
                    {[20, 40, 30, 60, 50, 80, 10].map((h, j) => (
                      <div key={j} className={`w-full transition-all duration-700 ${j === 6 ? "bg-[#10b981]" : "bg-[#10b981]/10"}`} style={{ height: `${h}%`, transitionDelay: `${j * 100}ms` }} />
                    ))}
                  </div>
                )}
                {i === 1 && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-1 w-full bg-[#1f2937] rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 w-[85%] transition-all duration-1000" />
                    </div>
                    <span className="text-xs font-mono text-orange-500">85%</span>
                  </div>
                )}
                {i === 2 && (
                  <div className="relative h-16 w-full">
                    <svg className="absolute bottom-0 left-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                      <defs>
                        <linearGradient id="latency-gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                      </defs>
                      <path d="M0 35 L10 32 L20 34 L30 25 L40 28 L50 20 L60 22 L70 15 L80 18 L90 5 L100 8" fill="none" stroke="#10b981" strokeWidth="1.5" />
                      <path d="M0 35 L10 32 L20 34 L30 25 L40 28 L50 20 L60 22 L70 15 L80 18 L90 5 L100 8 V 40 H 0 Z" fill="url(#latency-gradient)" opacity="0.2" />
                    </svg>
                  </div>
                )}
                <p className="text-[10px] text-[#6b7280] font-mono mt-3 uppercase tracking-wider">{defaultMetrics[i].label}</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
