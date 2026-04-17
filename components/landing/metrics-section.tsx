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
    <div ref={ref} className="flex items-baseline gap-1">
      <span className="text-5xl md:text-6xl font-mono font-bold text-accent tracking-tight">
        {display}
      </span>
      <span className="text-lg md:text-xl font-sans font-light text-muted">{suffix}</span>
    </div>
  )
}

export function MetricsSection({ metrics }: { metrics: Metric[] }) {
  const defaultMetrics = [
    { title: "Products Shipped", value: "12", suffix: "+" },
    { title: "Cost Reduction", value: "100", suffix: "%" },
    { title: "Performance Gain", value: "5", suffix: "x" },
    { title: "Teams Trained", value: "114", suffix: "+" },
  ]

  const displayMetrics = metrics.length > 0
    ? metrics.map((m, i) => ({
        title: m.title,
        value: m.value,
        suffix: m.suffix || defaultMetrics[i]?.suffix || "+",
      }))
    : defaultMetrics

  return (
    <section className="px-6 md:px-12 py-32 bg-background border-t border-border" id="metrics">
      <div className="max-w-7xl mx-auto">
        {/* Section header: editorial */}
        <ScrollReveal>
          <div className="mb-20">
            <div className="label mb-4">Measurable Impact</div>
            <h2 className="font-serif italic text-5xl md:text-6xl leading-tight tracking-title text-balance">
              Data that speaks
            </h2>
          </div>
        </ScrollReveal>

        {/* 4-column metric grid: minimal, restrained */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {displayMetrics.map((metric, i) => (
            <ScrollReveal key={i} delay={(i + 1) * 60}>
              <div className="space-y-8 group">
                {/* Number: mono, accent color */}
                <AnimatedNumber target={metric.value} suffix={metric.suffix} />

                {/* Label: uppercase, tracked, muted */}
                <h3 className="label group-hover:text-accent transition-colors">
                  {metric.title}
                </h3>

                {/* Subtle underline on hover */}
                <div className="h-px bg-border group-hover:bg-accent transition-colors" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
