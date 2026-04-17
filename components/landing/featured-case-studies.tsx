"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
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
    <section className="px-6 md:px-12 py-24 bg-background" id="work">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <ScrollReveal>
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-cinzel text-foreground mb-4">Featured Work</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-emerald to-emerald/0" />
          </div>
        </ScrollReveal>

        {/* BOLD CARD GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {studies.slice(0, 4).map((cs, idx) => {
            const primaryMetric = cs.metrics?.[0]

            return (
              <ScrollReveal key={cs.id} delay={(idx + 1) * 80}>
                <Link href={`/case-studies/${cs.slug}`} className="group block h-full">
                  {/* BOLD CARD WITH BORDERS */}
                  <div className="relative overflow-hidden transition-all duration-300 hover:scale-105 h-full border-2 border-emerald/20 hover:border-emerald/60 bg-gradient-to-br from-emerald/5 to-background">
                    {/* Corner accent */}
                    <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-b-2 border-emerald/30 group-hover:border-emerald transition-colors" />
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-t-2 border-emerald/30 group-hover:border-emerald transition-colors" />

                    {/* Content */}
                    <div className="p-8 md:p-10 h-full flex flex-col justify-between relative z-10">
                      {/* Top */}
                      <div>
                        {cs.category && (
                          <span className="inline-block text-xs uppercase tracking-widest font-space-grotesk text-emerald font-bold mb-4">
                            {cs.category}
                          </span>
                        )}
                        <h3 className="text-2xl md:text-3xl font-bold font-cinzel text-foreground group-hover:text-emerald transition-colors mb-3">
                          {cs.title}
                        </h3>
                        {cs.subtitle && (
                          <p className="text-base text-foreground/70 leading-relaxed font-light">
                            {cs.subtitle}
                          </p>
                        )}

                        {/* Tech tags */}
                        {cs.tech_stack && cs.tech_stack.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-6">
                            {cs.tech_stack.slice(0, 3).map((tech: string) => (
                              <span
                                key={tech}
                                className="px-3 py-1 text-xs uppercase font-space-grotesk bg-emerald/10 text-emerald border border-emerald/30 group-hover:border-emerald/60 transition-colors"
                              >
                                {tech}
                              </span>
                            ))}
                            {cs.tech_stack.length > 3 && (
                              <span className="px-3 py-1 text-xs uppercase font-space-grotesk text-foreground/50">
                                +{cs.tech_stack.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Bottom: Metric + Arrow */}
                      <div className="flex items-end justify-between mt-8 pt-6 border-t border-emerald/10">
                        {primaryMetric && (
                          <div>
                            <div className="text-3xl md:text-4xl font-bold text-emerald font-mono">
                              {primaryMetric.value}
                            </div>
                            <div className="text-xs uppercase tracking-widest font-space-grotesk text-foreground/60 mt-2">
                              {primaryMetric.label}
                            </div>
                          </div>
                        )}
                        <div className="h-12 w-12 rounded-full border-2 border-emerald/20 group-hover:border-emerald/60 flex items-center justify-center group-hover:bg-emerald/10 transition-all">
                          <ArrowUpRight className="h-5 w-5 text-foreground/40 group-hover:text-emerald transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            )
          })}
        </div>

        {/* View All CTA */}
        <ScrollReveal delay={500}>
          <div className="flex justify-center mt-16">
            <Link
              href="/case-studies"
              className="group inline-flex items-center gap-3 px-8 py-4 border-2 border-emerald/30 hover:border-emerald text-foreground hover:text-emerald uppercase font-space-grotesk font-bold tracking-wider text-sm transition-all duration-300 hover:bg-emerald/5"
            >
              View All Case Studies
              <ArrowUpRight className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
