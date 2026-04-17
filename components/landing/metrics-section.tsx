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
    <section className="px-6 md:px-12 py-24" id="metrics">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <ScrollReveal>
          <div className="mb-20 flex items-baseline gap-4">
            <span className="text-xs tracking-[0.2em] uppercase font-space-grotesk text-emerald/50">02 / METRICS</span>
            <div className="flex-1 h-px bg-emerald/10" />
          </div>
        </ScrollReveal>

        {/* 4-column grid, data-forward */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {displayMetrics.map((metric, i) => (
            <ScrollReveal key={i} delay={(i + 1) * 60}>
              <div className="flex flex-col gap-6 group">
                {/* Data visualization bar */}
                <div className="h-1 bg-emerald/10 group-hover:bg-emerald/30 transition-colors duration-300" style={{ width: `${(i + 1) * 20}%` }} />

                {/* Number: mono font, large */}
                <AnimatedNumber target={metric.value} suffix={metric.suffix} />

                {/* Label: uppercase mono */}
                <div className="space-y-1">
                  <h3 className="text-xs md:text-sm uppercase tracking-[0.15em] font-space-grotesk font-medium text-foreground">
                    {metric.title}
                  </h3>
                  <p className="text-[11px] tracking-[0.1em] uppercase font-mono text-foreground/40">
                    {metric.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
