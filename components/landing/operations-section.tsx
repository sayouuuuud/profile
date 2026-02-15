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
    <section className="px-6 md:px-12 py-24" id="experience">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 max-w-[40px] bg-emerald/40" />
            <span className="text-xs text-emerald tracking-widest uppercase">Career Path</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-14">
            Experience
          </h2>
        </ScrollReveal>

        <div className="relative pl-6 md:pl-10">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-[3px] top-2 bottom-2 w-px bg-border" />

          <div className="space-y-12">
            {operations.map((op, idx) => {
              const isActive = op.status === "ACTIVE"

              return (
                <ScrollReveal key={op.id} delay={(idx + 1) * 150}>
                  <div className="relative group">
                    {/* Timeline dot */}
                    <div
                      className={`absolute -left-6 md:-left-10 top-1 size-[7px] rounded-full ${
                        isActive
                          ? "bg-emerald shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                          : "bg-muted-foreground/30"
                      }`}
                    />

                    <div className="glass-panel rounded-xl p-6 md:p-8 card-glow">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-1">{op.title}</h3>
                          <p className="text-sm text-muted-foreground">{op.company}{op.location ? ` / ${op.location}` : ""}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs text-muted-foreground">
                            {op.start_date}
                            {op.end_date ? ` - ${op.end_date}` : ""}
                          </span>
                          {isActive && (
                            <span className="flex items-center gap-1.5 text-xs text-emerald bg-emerald/10 border border-emerald/20 px-2.5 py-1 rounded-md">
                              <span className="w-1.5 h-1.5 bg-emerald rounded-full" />
                              Current
                            </span>
                          )}
                        </div>
                      </div>

                      {op.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed mb-5">{op.description}</p>
                      )}

                      {op.tags && op.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                          {(op.tags as string[]).map((tag: string) => (
                            <span
                              key={tag}
                              className="px-2.5 py-1 text-[11px] text-muted-foreground bg-secondary rounded-md border border-border"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
