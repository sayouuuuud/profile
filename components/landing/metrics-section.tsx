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

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
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
  }, [target])

  return (
    <div ref={ref} className="flex items-baseline gap-1">
      <span className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
        {display}
      </span>
      <span className="text-xl md:text-2xl font-light text-emerald">{suffix}</span>
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
    <section className="px-6 md:px-12 py-16" id="metrics">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayMetrics.map((metric, i) => (
            <ScrollReveal key={i} delay={(i + 1) * 100}>
              <div className="glass-panel p-6 md:p-8 rounded-xl card-glow flex flex-col gap-4">
                <AnimatedNumber
                  target={metric.value}
                  suffix={metric.suffix}
                />
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-1">
                    {metric.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
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
