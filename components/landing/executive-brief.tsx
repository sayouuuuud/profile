"use client"

import { Fingerprint } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"

interface BriefProps {
  brief: {
    philosophy: string
    operating_model: string
    velocity_factor: string
    summary: string | null
    tags: string[] | null
  } | null
}

export function ExecutiveBrief({ brief }: BriefProps) {
  const b = brief || {
    philosophy: "Ship to learn. Optimize to scale.",
    operating_model: "ZERO-SUM EXECUTION",
    velocity_factor: "HIGH-FREQUENCY",
    summary: "Senior Technical Product Manager with 10+ years of experience in full-stack architecture and product leadership.",
    tags: ["TPM Leadership", "Full Stack", "Systems Design", "Cloud Native"],
  }

  return (
    <section className="px-6 md:px-12 py-24" id="brief">
      <ScrollReveal>
        <div className="glass-panel p-10 md:p-14 rounded-sm border border-border relative overflow-hidden tech-border">
          <div className="grid md:grid-cols-12 gap-16 items-start">
            <div className="md:col-span-4 pr-0 md:pr-4">
              <h3 className="text-2xl font-bold mb-12 text-foreground flex items-center gap-3 tracking-[0.1em]">
                <Fingerprint className="h-7 w-7 text-emerald" />
                EXECUTIVE BRIEF
              </h3>
              <div className="space-y-10">
                <div>
                  <span className="text-xs font-mono text-emerald uppercase tracking-[0.2em] block mb-3">Core Philosophy</span>
                  <p className="text-xl font-light text-foreground leading-tight">{'"' + b.philosophy + '"'}</p>
                </div>
                <div>
                  <span className="text-xs font-mono text-text-dim uppercase tracking-[0.2em] block mb-3">Operating Model</span>
                  <div className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 bg-emerald rounded-full shadow-[0_0_8px_#10b981]" />
                    <span className="text-sm font-bold text-foreground tracking-widest">{b.operating_model}</span>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-mono text-text-dim uppercase tracking-[0.2em] block mb-3">Velocity Factor</span>
                  <div className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 bg-emerald rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                    <span className="text-sm font-bold text-foreground tracking-widest">{b.velocity_factor}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-8">
              <div className="max-w-none">
                {b.summary && (
                  <p className="text-xl md:text-2xl font-light leading-relaxed text-gray-300 mb-10">{b.summary}</p>
                )}
                <div className="space-y-8 text-sm text-text-dim font-mono leading-relaxed border-t border-foreground/5 pt-10">
                  <div>
                    <p className="mb-4 flex items-start gap-2">
                      <span className="text-emerald mt-0.5">{">"}</span>
                      <span>Proven track record at major telecom giants (WE Telecom) and agile tech startups (Infinite Tech).</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-emerald mt-0.5">{">"}</span>
                      <span>Driving data-driven decision making for complex infrastructures.</span>
                    </p>
                  </div>
                  {b.tags && (
                    <div className="flex flex-wrap content-start gap-3">
                      {(b.tags as string[]).map((tag: string) => (
                        <span key={tag} className="bg-foreground/5 border border-foreground/10 px-4 py-2 rounded-sm text-xs text-foreground uppercase tracking-widest hover:border-emerald/40 hover:bg-emerald/5 transition-all duration-300 cursor-default">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}
