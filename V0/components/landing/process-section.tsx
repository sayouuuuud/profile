"use client"

import { useEffect, useRef, useState } from "react"
import { ScrollReveal } from "@/components/scroll-reveal"

interface ProcessStep {
  id: string
  label: string
  description: string
  direction: "up" | "down"
}

interface ProcessSectionProps {
  steps?: ProcessStep[]
}

const DEFAULT_STEPS: ProcessStep[] = [
  {
    id: "discover",
    label: "Discover",
    description: "Deep user research & pain-point analysis",
    direction: "up",
  },
  {
    id: "define",
    label: "Define",
    description: "Clear PRDs & strategic prioritization",
    direction: "down",
  },
  {
    id: "deliver",
    label: "Deliver",
    description: "Agile execution with engineering teams",
    direction: "up",
  },
  {
    id: "measure",
    label: "Measure",
    description: "Data-driven iteration & optimization",
    direction: "down",
  },
]

export function ProcessSection({ steps = DEFAULT_STEPS }: ProcessSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Animate the line then reveal branches one by one
          let step = 0
          const interval = setInterval(() => {
            step++
            setProgress(step)
            if (step >= steps.length + 1) clearInterval(interval)
          }, 400)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [steps.length])

  const lineReady = progress >= 1

  return (
    <section className="px-6 md:px-12 py-24 relative overflow-hidden" ref={ref} id="process">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 max-w-[40px] bg-emerald-500/40" />
            <span className="text-xs text-emerald-500 tracking-widest uppercase">Workflow</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-20">
            How I Work
          </h2>
        </ScrollReveal>

        {/* Desktop: Git branch timeline */}
        <div className="hidden md:block relative">
          {/* Vertical space for up-branches */}
          <div className="h-28" />

          {/* Main horizontal line container */}
          <div className="relative h-[2px]">
            {/* Main branch label */}
            <div
              className={`absolute -left-2 top-1/2 -translate-y-1/2 flex items-center gap-2 transition-all duration-700 ${lineReady ? "opacity-100" : "opacity-0"
                }`}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono text-emerald-500 border border-emerald-500/30 bg-emerald-500/5 rounded-full px-3 py-1">
                main
              </span>
            </div>

            {/* Animated line */}
            <div className="absolute inset-y-0 left-20 right-0">
              <div
                className="h-full bg-emerald-500/60 origin-left transition-transform duration-1000 ease-out"
                style={{ transform: `scaleX(${lineReady ? 1 : 0})` }}
              />
            </div>

            {/* Arrow tip */}
            <div
              className={`absolute right-0 top-1/2 -translate-y-1/2 transition-opacity duration-500 ${lineReady ? "opacity-100" : "opacity-0"
                }`}
              style={{ transitionDelay: "800ms" }}
            >
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                <path d="M1 1L9 6L1 11" stroke="hsl(160 84% 39%)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Commit nodes on the main line */}
            {steps.map((step, idx) => {
              const isActive = progress >= idx + 2
              const leftPercent = 15 + idx * (70 / (steps.length - 1))

              return (
                <div
                  key={step.id}
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{ left: `${leftPercent}%` }}
                >
                  {/* Commit dot on main line */}
                  <div
                    className={`relative h-3.5 w-3.5 rounded-full border-2 transition-all duration-500 ${isActive
                        ? "border-emerald-500 bg-background"
                        : "border-emerald-500/20 bg-background"
                      }`}
                    style={{ transitionDelay: `${idx * 150}ms` }}
                  >
                    <div
                      className={`absolute inset-[3px] rounded-full transition-all duration-500 ${isActive ? "bg-emerald-500" : "bg-transparent"
                        }`}
                      style={{ transitionDelay: `${idx * 150 + 200}ms` }}
                    />
                  </div>

                  {/* Branch line going up or down */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 w-[1.5px] bg-emerald-500/50 origin-${step.direction === "up" ? "bottom" : "top"
                      } transition-transform duration-500`}
                    style={{
                      ...(step.direction === "up"
                        ? { bottom: "100%", height: "90px", marginBottom: "4px", transformOrigin: "bottom" }
                        : { top: "100%", height: "90px", marginTop: "4px", transformOrigin: "top" }),
                      transform: `scaleY(${isActive ? 1 : 0})`,
                      transitionDelay: `${idx * 150 + 300}ms`,
                    }}
                  />

                  {/* Branch endpoint dot */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 transition-all duration-300 ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
                      }`}
                    style={{
                      ...(step.direction === "up"
                        ? { bottom: "calc(100% + 90px)" }
                        : { top: "calc(100% + 90px)" }),
                      transitionDelay: `${idx * 150 + 600}ms`,
                    }}
                  >
                    <span className="h-2 w-2 rounded-full bg-emerald-500 block" />
                  </div>

                  {/* Label card */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-500 ${isActive ? "opacity-100 translate-y-0" : "opacity-0"
                      }`}
                    style={{
                      ...(step.direction === "up"
                        ? { bottom: "calc(100% + 100px)", transform: `translate(-50%, ${isActive ? "0" : "10px"})` }
                        : { top: "calc(100% + 100px)", transform: `translate(-50%, ${isActive ? "0" : "-10px"})` }),
                      transitionDelay: `${idx * 150 + 700}ms`,
                    }}
                  >
                    {/* Badge */}
                    <div className="flex items-center gap-2 border border-emerald-500/25 bg-emerald-500/5 rounded-full px-4 py-1.5 mb-2 mx-auto w-fit">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="text-sm font-semibold text-foreground">{step.label}</span>
                    </div>
                    {/* Description */}
                    <p className="text-xs text-muted-foreground text-center font-mono tracking-tight">
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Vertical space for down-branches */}
          <div className="h-40" />
        </div>

        {/* Mobile: Simple vertical timeline */}
        <div className="md:hidden space-y-0">
          {steps.map((step, idx) => (
            <ScrollReveal key={step.id} delay={idx * 100}>
              <div className="flex gap-4 items-start relative pb-8">
                {/* Vertical line */}
                <div className="flex flex-col items-center">
                  <div className="h-3.5 w-3.5 rounded-full border-2 border-emerald-500 bg-background relative">
                    <div className="absolute inset-[3px] rounded-full bg-emerald-500" />
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="w-[1.5px] flex-1 bg-emerald-500/30 mt-1" />
                  )}
                </div>
                {/* Content */}
                <div className="pb-4 -mt-0.5">
                  <div className="flex items-center gap-2 border border-emerald-500/25 bg-emerald-500/5 rounded-full px-3 py-1 w-fit mb-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-sm font-semibold text-foreground">{step.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
