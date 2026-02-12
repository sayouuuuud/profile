"use client"

import React, { useEffect, useRef, useState } from "react"
import { BarChart3, Server, Wrench } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"

interface SkillCategory {
  id: string
  name: string
  icon: string | null
  proficiency: number
  skills: { id: string; name: string; level: number }[]
}

const iconMap: Record<string, React.ReactNode> = {
  strategy: <BarChart3 className="h-5 w-5 text-emerald" />,
  architecture: <Server className="h-5 w-5 text-emerald" />,
  terminal: <Wrench className="h-5 w-5 text-emerald" />,
}

const radarLabels: Record<string, string[]> = {
  "PRODUCT & STRATEGY": ["AGILE", "ROADMAP", "MGMT", "SCRUM"],
  "ENG & ARCHITECTURE": ["ARCH", "SCALE", "API", "HLS"],
  "TOOLS & ORCHESTRATION": ["JIRA", "POSTMAN", "AI", "FIGMA"],
}

const defaultCategories = [
  { name: "PRODUCT & STRATEGY", focusLabel: "STRAT", centerLabel: "STRAT_OPS", icon: "strategy", skills: [{ name: "AGILE METHODOLOGY", level: 95 }, { name: "SCRUM FRAMEWORK", level: 90 }], points: "50,15 85,50 50,85 15,50" },
  { name: "ENG & ARCHITECTURE", focusLabel: "ARCH", centerLabel: "SYSTEM_CORE", icon: "architecture", skills: [{ name: "SYSTEM DESIGN", level: 92 }, { name: "SCALABILITY", level: 96 }], points: "50,12 88,50 50,88 12,50" },
  { name: "TOOLS & ORCHESTRATION", focusLabel: "TOOL", centerLabel: "TOOL_CHAIN", icon: "terminal", skills: [{ name: "JIRA", level: 98 }, { name: "AI AGENTS", level: 95 }], points: "50,18 80,50 50,75 25,50" },
]

function AnimatedSkillBar({ level, name }: { level: number; name: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setWidth(level); obs.unobserve(el) } },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [level])

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between text-[10px] font-mono text-gray-400">
        <span>{name}</span>
        <span className="text-emerald">{level + "%"}</span>
      </div>
      <div className="h-1 bg-foreground/5 w-full overflow-hidden">
        <div
          className="h-full bg-emerald shadow-[0_0_8px_rgba(16,185,129,0.8)] transition-all duration-1000 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

export function SkillsSection({ categories }: { categories: SkillCategory[] }) {
  const display = categories.length > 0 ? categories : null

  return (
    <section className="px-6 md:px-12 py-24 border-t border-b border-border bg-surface-dark/20" id="capabilities">
      <ScrollReveal>
        <div className="flex flex-col mb-16">
          <div className="flex items-center gap-6 mb-2">
            <h2 className="text-4xl font-black text-foreground tracking-[0.05em] uppercase">CORE CAPABILITIES</h2>
            <div className="h-px bg-border flex-1" />
            <div className="hidden md:flex items-center gap-3">
              <span className="text-xs font-mono text-text-dim tracking-widest">SKILL_MATRIX_V.3.0</span>
              <div className="flex items-center gap-2 text-[10px] text-emerald-light font-mono">
                <span className="w-1 h-1 bg-emerald-light rounded-full" />
                OPTIMIZED
              </div>
            </div>
          </div>
          <div className="text-emerald font-mono text-xs tracking-[0.2em] font-bold">{"// SYSTEM_DIAGNOSTICS_MODULE"}</div>
        </div>
      </ScrollReveal>

      <div className="grid md:grid-cols-3 gap-8 w-full">
        {defaultCategories.map((cat, idx) => {
          const labels = radarLabels[cat.name] || ["N", "E", "S", "W"]
          const pts = cat.points.split(" ").map((p) => p.split(",").map(Number))

          return (
            <ScrollReveal key={idx} delay={(idx + 1) * 100}>
              <div className="rounded-sm border border-foreground/10 hover:border-emerald/50 transition-all duration-500 group relative flex flex-col glass-panel" style={{ background: "linear-gradient(135deg, rgba(10,10,10,0.8) 0%, rgba(5,5,5,0.9) 100%)" }}>
                <div className="p-8 border-b border-foreground/5 flex-1">
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                      {iconMap[cat.icon] || <BarChart3 className="h-5 w-5 text-emerald" />}
                      <h3 className="text-xs font-mono text-emerald uppercase tracking-[0.25em] font-bold">{cat.name}</h3>
                    </div>
                    <span className="text-[10px] font-mono text-text-dim tracking-tighter">{"FOCUS: " + cat.focusLabel}</span>
                  </div>
                  <div className="relative w-full aspect-square flex items-center justify-center rounded-full mb-4" style={{ backgroundImage: "radial-gradient(circle, rgba(16, 185, 129, 0.05) 1px, transparent 1px), linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)", backgroundSize: "20px 20px, 40px 40px, 40px 40px" }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {[80, 60, 40, 20].map((size) => (
                        <div key={size} className={`${size === 80 ? "" : "absolute"} rounded-full border border-foreground/5`} style={{ width: `${size}%`, height: `${size}%` }} />
                      ))}
                    </div>
                    <svg className="w-56 h-56 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)] relative z-10" viewBox="0 0 100 100">
                      <line className="stroke-foreground/10" strokeWidth="0.5" x1="50" x2="50" y1="10" y2="90" />
                      <line className="stroke-foreground/10" strokeWidth="0.5" x1="10" x2="90" y1="50" y2="50" />
                      <polygon className="fill-emerald/20 stroke-emerald" points={cat.points} strokeWidth="1.5" />
                      {pts.map((p, i) => (<circle key={i} className="fill-emerald" cx={p[0]} cy={p[1]} r="1.5" />))}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-[8px] font-mono text-emerald/40 font-bold bg-black/40 px-2 py-1 rounded-sm border border-emerald/20">{cat.centerLabel}</div>
                    </div>
                    <span className="absolute top-4 text-[9px] font-mono text-text-dim tracking-widest">{labels[0]}</span>
                    <span className="absolute bottom-4 text-[9px] font-mono text-text-dim tracking-widest">{labels[1]}</span>
                    <span className="absolute left-4 text-[9px] font-mono text-text-dim tracking-widest">{labels[2]}</span>
                    <span className="absolute right-4 text-[9px] font-mono text-text-dim tracking-widest">{labels[3]}</span>
                  </div>
                </div>
                <div className="p-8 space-y-6 bg-black/20">
                  {cat.skills.map((skill, si) => {
                    const dbSkill = display?.[idx]?.skills?.[si]
                    return <AnimatedSkillBar key={si} level={dbSkill?.level || skill.level} name={dbSkill?.name || skill.name} />
                  })}
                </div>
              </div>
            </ScrollReveal>
          )
        })}
      </div>
    </section>
  )
}
