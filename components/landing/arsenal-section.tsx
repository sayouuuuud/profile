"use client"

import React from "react"
import { Code2, Database, Palette, Globe, Terminal, FileCode, Server, Layers, Cpu, GitBranch } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"

interface ArsenalItem {
  id: string
  name: string
  category: string | null
}

const iconMap: Record<string, React.ReactNode> = {
  "React": <Code2 className="h-7 w-7 text-blue-400" />,
  "Next.js": <FileCode className="h-7 w-7 text-foreground" />,
  "TypeScript": <Terminal className="h-7 w-7 text-blue-300" />,
  "Node.js": <Server className="h-7 w-7 text-green-400" />,
  "Python": <Cpu className="h-7 w-7 text-yellow-400" />,
  "PostgreSQL": <Database className="h-7 w-7 text-emerald-light" />,
  "AWS": <Globe className="h-7 w-7 text-orange-400" />,
  "Docker": <Layers className="h-7 w-7 text-blue-500" />,
  "Figma": <Palette className="h-7 w-7 text-rose-400" />,
  "Git": <GitBranch className="h-7 w-7 text-red-500" />,
}

export function ArsenalSection({ arsenal }: { arsenal: ArsenalItem[] }) {
  return (
    <section className="px-6 md:px-12 py-16" id="arsenal">
      <div className="border-y border-border py-20 bg-surface-dark/30">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
            <h3 className="text-sm font-mono text-text-dim uppercase tracking-[0.3em]">Core Arsenal</h3>
            <div className="h-px flex-1 bg-border hidden md:block mx-8" />
            <span className="text-xs text-emerald font-mono tracking-[0.1em]">HIGH_FIDELITY_TOOLS</span>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
          {arsenal.map((item, i) => (
            <ScrollReveal key={item.id} delay={Math.min((i + 1) * 100, 600)}>
              <div className="group flex flex-col items-center gap-4 p-4 rounded hover:bg-foreground/5 transition-all duration-300">
                <div className="size-16 flex items-center justify-center bg-black rounded-xl border border-foreground/10 group-hover:border-foreground/30 group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-emerald/20">
                  {iconMap[item.name] || <Code2 className="h-7 w-7 text-foreground" />}
                </div>
                <div className="text-center">
                  <div className="text-foreground font-bold text-sm mb-1 tracking-widest">{item.name.toUpperCase()}</div>
                  <div className="text-[10px] text-text-dim font-mono uppercase">{item.category || "Tool"}</div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
