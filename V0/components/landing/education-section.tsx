"use client"

import { GraduationCap } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"

interface Education {
  id: string
  institution: string
  degree: string | null
  field_of_study: string | null
  start_year: string | null
  end_year: string | null
  grade: string | null
  description: string | null
}

export function EducationSection({ education }: { education: Education[] }) {
  return (
    <section className="px-6 md:px-12 py-24 border-t border-border" id="education">
      <ScrollReveal>
        <div className="flex flex-col mb-16">
          <div className="flex items-center gap-6 mb-2">
            <h2 className="text-4xl font-black text-foreground tracking-[0.05em] uppercase">ACADEMIC_FOUNDATION</h2>
            <div className="h-px bg-border flex-1" />
            <div className="hidden md:flex items-center gap-3">
              <span className="text-xs font-mono text-text-dim tracking-widest">ACADEMIC_CREDENTIALS_V.2.0</span>
              <div className="flex items-center gap-2 text-[10px] text-emerald-light font-mono">
                <span className="w-1 h-1 bg-emerald-light rounded-full" />
                VERIFIED
              </div>
            </div>
          </div>
          <div className="text-emerald font-mono text-xs tracking-[0.2em] uppercase font-bold">{"// KNOWLEDGE_BASE_SYNCED"}</div>
        </div>
      </ScrollReveal>

      <div className="flex flex-col gap-12 w-full">
        {education.map((edu, idx) => (
          <ScrollReveal key={edu.id} delay={(idx + 1) * 200}>
            <div className="w-full border border-foreground/10 rounded-2xl overflow-hidden shadow-2xl hover:border-emerald/50 transition-all duration-500" style={{ background: "linear-gradient(145deg, rgba(6, 11, 20, 0.95) 0%, rgba(2, 4, 10, 1) 100%)" }}>
              <div className="grid grid-cols-1 md:grid-cols-2 min-h-[400px]">
                <div className="p-8 md:p-12 flex flex-col justify-between relative bg-surface-dark">
                  <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                  <div className="relative z-10">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${idx === 0 ? "bg-emerald-900/30 border-emerald-500/20" : "bg-blue-900/30 border-blue-500/20"} border mb-8`}>
                      <GraduationCap className={`h-3.5 w-3.5 ${idx === 0 ? "text-emerald" : "text-blue-400"}`} />
                      <span className={`text-xs font-mono ${idx === 0 ? "text-emerald" : "text-blue-400"} font-medium`}>{edu.degree || "Degree"}</span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-none mb-4">{edu.degree || "Degree"}</h3>
                    <p className="text-xl text-gray-400 font-light mt-4">{edu.institution}</p>
                    <div className="flex items-center gap-4 mt-8 flex-wrap">
                      <div className="px-4 py-2 bg-foreground/5 rounded text-xs font-mono text-text-dim uppercase tracking-wider">{edu.field_of_study || "Technology"}</div>
                    </div>
                  </div>
                  <div className="relative z-10 mt-12 flex items-end justify-between">
                    <div className="hidden md:block">
                      <div className="size-20 rounded-full bg-foreground/5 flex items-center justify-center border border-foreground/10">
                        <GraduationCap className="h-8 w-8 text-foreground/20" />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-mono text-foreground font-light">{edu.start_year}{edu.end_year ? ` - ${edu.end_year}` : ""}</div>
                      <div className="text-[10px] text-text-dim uppercase tracking-widest font-mono mt-1">Timeline</div>
                    </div>
                  </div>
                </div>

                <div className="p-8 md:p-12 flex flex-col border-t md:border-t-0 md:border-l border-foreground/5 relative" style={{ background: "linear-gradient(180deg, rgba(16, 185, 129, 0.03) 0%, rgba(0, 0, 0, 0.2) 100%)" }}>
                  <h4 className="text-xs font-mono text-text-dim uppercase tracking-[0.2em] mb-12">Performance Metrics</h4>
                  <div className="flex items-center justify-between mb-16">
                    <div>
                      <div className="text-6xl font-bold text-foreground tracking-tighter">{edu.grade || "N/A"}</div>
                      <div className="text-sm text-text-dim font-mono mt-2">Overall Score</div>
                    </div>
                    <div className="relative size-24">
                      <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                        <path className="text-foreground/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" />
                        <path className="text-emerald drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="90, 100" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-8 mt-auto">
                    <div>
                      <div className="flex justify-between text-xs font-mono text-gray-300 mb-2">
                        <span>{edu.field_of_study || "Major"}</span>
                        <span className="text-emerald font-bold">A+</span>
                      </div>
                      <div className="h-1.5 w-full bg-foreground/10 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald shadow-[0_0_8px_rgba(16,185,129,0.5)] w-[95%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
