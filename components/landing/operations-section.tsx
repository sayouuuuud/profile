"use client"

import { ScrollReveal } from "@/components/scroll-reveal"

interface Operation {
  id: string
  title: string
  company: string | null
  location: string | null
  start_date: string | null
  end_date: string | null
  description: string | null
  status: string
  tags: string[] | null
}

export function OperationsSection({ operations }: { operations: Operation[] }) {
  return (
    <section className="px-6 md:px-12 py-24" id="operations">
      <ScrollReveal>
        <div className="flex items-center gap-6 mb-24">
          <h2 className="text-3xl font-bold text-foreground tracking-[0.1em]">CAREER OPERATIONS</h2>
          <div className="h-px bg-border flex-1" />
          <span className="text-xs font-mono text-text-dim tracking-widest">LOG_V.2.0</span>
        </div>
      </ScrollReveal>

      <div className="relative pl-8 md:pl-16 space-y-48">
        <div className="absolute left-8 md:left-[61px] top-4 bottom-4 w-px bg-border" />

        {operations.map((op, idx) => {
          const isActive = op.status === "ACTIVE"
          const borderColor = isActive ? "border-l-emerald" : idx === 1 ? "border-l-blue-500/50" : "border-l-purple-500/50"
          const dotColor = isActive ? "border-emerald shadow-[0_0_15px_rgba(16,185,129,0.5)]" : idx === 1 ? "border-blue-500" : "border-purple-500"
          const badgeColor = isActive
            ? "bg-emerald/10 text-emerald border-emerald/20"
            : idx === 1
              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
              : "bg-purple-500/10 text-purple-400 border-purple-500/20"

          return (
            <ScrollReveal key={op.id} delay={(idx + 1) * 200}>
              <div className="relative group">
                <div className={`absolute -left-[45px] md:-left-[45px] top-14 size-5 bg-[#050505] border-2 ${dotColor} rounded-full z-10`} />
                <div className="grid md:grid-cols-12 gap-8 items-start">
                  <div className="md:col-span-2 pt-12">
                    <div className={`${isActive ? "text-2xl text-foreground" : "text-xl text-text-dim"} font-mono mb-1`}>
                      {op.start_date}
                      {op.end_date ? ` - ${op.end_date === "Present" ? "Pres." : op.end_date}` : ""}
                    </div>
                    <div className={`text-xs ${isActive ? "text-emerald" : "text-text-dim/60"} font-mono uppercase tracking-[0.2em]`}>
                      {isActive ? "Ongoing Mission" : "Completed"}
                    </div>
                  </div>
                  <div className={`md:col-span-10 glass-panel p-10 md:p-12 rounded-sm border-l-4 ${borderColor} hover:bg-foreground/[0.02] transition-all duration-500`}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground mb-2 tracking-[0.05em]">{op.title}</h3>
                        <p className="text-text-dim font-mono text-sm tracking-widest uppercase">{op.company}</p>
                      </div>
                      <span className={`text-xs ${badgeColor} px-4 py-2 rounded-sm border uppercase tracking-[0.2em]`}>
                        {isActive ? "Case Study" : op.status}
                      </span>
                    </div>
                    {op.description && (
                      <p className="text-gray-300 font-light leading-relaxed mb-8 text-lg">{op.description}</p>
                    )}
                    {op.tags && (
                      <div className="flex gap-6 border-t border-foreground/5 pt-6 flex-wrap">
                        <span className="text-xs text-text-dim font-mono tracking-widest">STACK:</span>
                        {(op.tags as string[]).map((tag: string) => (
                          <span key={tag} className="text-xs text-foreground font-mono tracking-widest">{tag.toUpperCase()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          )
        })}
      </div>
    </section>
  )
}
