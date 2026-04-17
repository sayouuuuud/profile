"use client"

import { useEffect, useRef, useState } from "react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { TrendingUp } from "lucide-react"

interface Metric {
  id: string
  title: string
  value: string
  suffix: string | null
  icon: string | null
}

function AnimatedNumber({ target, suffix }: { target: string; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [display, setDisplay] = useState("0")
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          const numericVal = parseFloat(target.replace(/[^0-9.]/g, ""))
          if (isNaN(numericVal)) { setDisplay(target); obs.unobserve(el); return }
          const duration = 1800
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
  }, [target, hasAnimated])

  return (
    <div ref={ref} className="flex items-baseline gap-2">
      <span className="text-4xl md:text-5xl font-bold text-foreground tracking-tight font-cinzel">
        {display}
      </span>
      <span className="text-xl md:text-2xl font-light text-emerald font-space-grotesk">{suffix}</span>
    </div>
  )
}

export function MetricsSection({ metrics }: { metrics: Metric[] }) {
  const defaultMetrics = [
    { title: "Projects Delivered", value: "12", suffix: "+", description: "End-to-end product launches" },
    { title: "Cost Reduction", value: "100", suffix: "%", description: "Infrastructure optimization" },
    { title: "Load Time", value: "5", suffix: "x", description: "Performance improvement" },
    { title: "Training Hours", value: "114", suffix: "+", description: "Team capability building" },
  ]

  const displayMetrics = metrics.length > 0
    ? metrics.map((m, i) => ({
        title: m.title,
        value: m.value,
        suffix: m.suffix || defaultMetrics[i]?.suffix || "+",
        description: defaultMetrics[i]?.description || "",
      }))
    : defaultMetrics

  return (
    <section className="px-6 md:px-12 py-20" id="metrics">
      <div className="max-w-7xl mx-auto">
        {/* Section header with accent line */}
        <div className="mb-16 flex items-center gap-4">
          <div className="h-1 w-12 bg-gradient-to-r from-emerald to-emerald/0" />
          <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-space-grotesk font-medium">Impact by the Numbers</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayMetrics.map((metric, i) => (
            <ScrollReveal key={i} delay={(i + 1) * 100}>
              <div className="group relative glass-panel p-6 md:p-8 rounded-xl card-glow flex flex-col gap-4 overflow-hidden hover:scale-105 transition-transform duration-300">
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald/5 to-emerald/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <AnimatedNumber
                      target={metric.value}
                      suffix={metric.suffix}
                    />
                    <TrendingUp className="h-5 w-5 text-emerald/50 group-hover:text-emerald transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-2 font-space-grotesk">
                      {metric.title}
                    </h3>
                    <p className="text-xs text-muted-foreground font-light leading-relaxed">
                      {metric.description}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
