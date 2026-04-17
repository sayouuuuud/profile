"use client"

import Link from "next/link"
import { ArrowRight, ArrowUpRight, Zap } from "lucide-react"
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
        {/* Section header with premium styling */}
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-16">
            <div className="h-1 w-12 bg-gradient-to-r from-emerald to-emerald/0 rounded-full" />
            <span className="text-xs text-emerald tracking-widest uppercase font-space-grotesk font-medium flex items-center gap-2">
              <Zap className="h-3 w-3" />
              Featured Work
            </span>
          </div>
        </ScrollReveal>

        <div className="grid gap-6">
          {studies.map((cs, idx) => {
            const primaryMetric = cs.metrics?.[0]

            return (
              <ScrollReveal key={cs.id} delay={(idx + 1) * 100}>
                <Link href={`/case-studies/${cs.slug}`} className="group block">
                  <div className="glass-panel rounded-xl p-6 md:p-8 card-glow flex flex-col md:flex-row md:items-center gap-6 relative overflow-hidden hover:scale-[1.01] transition-transform duration-300">
                    {/* Premium border glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald/5 via-emerald/0 to-emerald/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Left: Content */}
                    <div className="flex-1 min-w-0 relative z-10">
                      {cs.category && (
                        <span className="text-xs text-emerald/70 tracking-widest uppercase mb-3 block font-space-grotesk font-medium">
                          {cs.category}
                        </span>
                      )}
                      <h3 className="text-lg md:text-2xl font-semibold text-foreground group-hover:text-emerald transition-colors mb-3 font-cinzel">
                        {cs.title}
                      </h3>
                      {cs.subtitle && (
                        <p className="text-sm text-muted-foreground line-clamp-2 font-light leading-relaxed">{cs.subtitle}</p>
                      )}

                      {/* Tech stack tags with premium styling */}
                      {cs.tech_stack && cs.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-5">
                          {cs.tech_stack.slice(0, 5).map((tech: string) => (
                            <span
                              key={tech}
                              className="px-3 py-1.5 text-[11px] text-muted-foreground bg-emerald/5 rounded-md border border-emerald/20 hover:border-emerald/40 font-space-grotesk font-medium transition-colors duration-300"
                            >
                              {tech}
                            </span>
                          ))}
                          {cs.tech_stack && cs.tech_stack.length > 5 && (
                            <span className="px-3 py-1.5 text-[11px] text-muted-foreground font-light">
                              +{cs.tech_stack.length - 5} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right: Metric + Arrow */}
                    <div className="flex items-center gap-6 md:gap-8 shrink-0 relative z-10">
                      {primaryMetric && (
                        <div className="text-right">
                          <span className="text-2xl md:text-3xl font-bold text-emerald glow-text block font-cinzel">
                            {primaryMetric.value}
                          </span>
                          <span className="text-xs text-muted-foreground font-light">
                            {primaryMetric.label}
                          </span>
                        </div>
                      )}
                      <div className="h-11 w-11 rounded-full border border-emerald/20 flex items-center justify-center group-hover:border-emerald/60 group-hover:bg-emerald/10 transition-all duration-300 flex-shrink-0">
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald transition-colors group-hover:scale-125 duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            )
          })}
        </div>

        {/* View All CTA with premium styling */}
        <ScrollReveal delay={400}>
          <div className="flex justify-center mt-14">
            <Link
              href="/case-studies"
              className="button-premium group inline-flex items-center gap-3 px-8 py-3 rounded-lg border border-emerald/30 text-sm text-emerald hover:text-foreground hover:border-emerald/60 hover:bg-emerald/5 transition-all duration-300 font-space-grotesk font-medium"
            >
              View All Case Studies
              <ArrowRight className="h-4 w-4 transition-all duration-300 group-hover:translate-x-1 group-hover:translate-y-0" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
