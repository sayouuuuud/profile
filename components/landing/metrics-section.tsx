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
      <span className="text-5xl md:text-6xl font-mono font-bold text-emerald tracking-tight">
        {display}
      </span>
      <span className="text-lg md:text-xl font-space-grotesk font-light text-foreground/60">{suffix}</span>
    </div>
  )
}

export function MetricsSection({ metrics }: { metrics: Metric[] }) {
  const defaultMetrics = [
    { title: "Products Shipped", value: "12", suffix: "+", description: "End-to-end launches" },
    { title: "Cost Reduction", value: "100", suffix: "%", description: "Infrastructure impact" },
    { title: "Performance Gain", value: "5", suffix: "x", description: "Load time improvement" },
    { title: "Teams Trained", value: "114", suffix: "+", description: "Capability building" },
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
    <section className="px-6 md:px-12 py-24 bg-gradient-to-b from-emerald/5 to-background" id="metrics">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <ScrollReveal>
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-cinzel text-foreground mb-4">Impact by Numbers</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-emerald to-emerald/0" />
          </div>
        </ScrollReveal>

        {/* 4-column bold metric cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {displayMetrics.map((metric, i) => (
            <ScrollReveal key={i} delay={(i + 1) * 80}>
              <div className="group">
                {/* BOLD BORDER CARD */}
                <div className="border-2 border-emerald/20 group-hover:border-emerald/60 p-6 md:p-8 transition-colors relative overflow-hidden bg-gradient-to-br from-emerald/5 to-background">
                  {/* Corner accent */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-l border-t border-emerald/20 group-hover:border-emerald/40 transition-colors" />

                  {/* Content */}
                  <div className="space-y-6 relative z-10">
                    <AnimatedNumber target={metric.value} suffix={metric.suffix} />

                    <div>
                      <h3 className="text-sm md:text-base font-bold font-cinzel text-foreground group-hover:text-emerald transition-colors uppercase mb-2">
                        {metric.title}
                      </h3>
                      <p className="text-xs text-foreground/60 font-light">
                        {metric.description}
                      </p>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1 bg-emerald/10 group-hover:bg-emerald/30 transition-colors" style={{ width: `${(i + 1) * 25}%` }} />
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
