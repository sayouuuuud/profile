"use client"

import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"

interface CaseStudy {
  id: string
  slug: string
  title: string
  subtitle: string | null
  category: string | null
  tech_stack: string[] | null
  metrics: { label: string; value: string }[] | null
}

export function FeaturedCaseStudies({ studies }: { studies: CaseStudy[] }) {
  if (studies.length === 0) return null

  return (
    <section className="px-6 md:px-12 py-24 relative" id="work">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-12">
            <div className="h-px flex-1 max-w-[40px] bg-emerald/40" />
            <span className="text-xs text-emerald tracking-widest uppercase">Featured Work</span>
          </div>
        </ScrollReveal>

        <div className="grid gap-6">
          {studies.map((cs, idx) => {
            const primaryMetric = cs.metrics?.[0]

            return (
              <ScrollReveal key={cs.id} delay={(idx + 1) * 100}>
                <Link href={`/case-studies/${cs.slug}`} className="group block">
                  <div className="glass-panel rounded-xl p-6 md:p-8 card-glow flex flex-col md:flex-row md:items-center gap-6">
                    {/* Left: Content */}
                    <div className="flex-1 min-w-0">
                      {cs.category && (
                        <span className="text-xs text-emerald/70 tracking-wide uppercase mb-2 block">
                          {cs.category}
                        </span>
                      )}
                      <h3 className="text-lg md:text-xl font-semibold text-foreground group-hover:text-emerald transition-colors mb-2">
                        {cs.title}
                      </h3>
                      {cs.subtitle && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{cs.subtitle}</p>
                      )}

                      {/* Tech stack tags */}
                      {cs.tech_stack && cs.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {cs.tech_stack.slice(0, 5).map((tech: string) => (
                            <span
                              key={tech}
                              className="px-2.5 py-1 text-[11px] text-muted-foreground bg-secondary rounded-md border border-border"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right: Metric + Arrow */}
                    <div className="flex items-center gap-6 md:gap-8 shrink-0">
                      {primaryMetric && (
                        <div className="text-right">
                          <span className="text-2xl md:text-3xl font-bold text-emerald glow-text block">
                            {primaryMetric.value}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {primaryMetric.label}
                          </span>
                        </div>
                      )}
                      <div className="h-10 w-10 rounded-full border border-border flex items-center justify-center group-hover:border-emerald/30 group-hover:bg-emerald/5 transition-all">
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            )
          })}
        </div>

        {/* View All CTA */}
        <ScrollReveal delay={400}>
          <div className="flex justify-center mt-12">
            <Link
              href="/case-studies"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-emerald/30 transition-all"
            >
              View All Case Studies
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
