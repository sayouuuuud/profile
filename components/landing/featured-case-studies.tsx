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
    <section className="px-6 md:px-12 py-24 relative" id="work">
      <div className="max-w-7xl mx-auto">
        {/* Section header: mono label + divider */}
        <ScrollReveal>
          <div className="mb-20 flex items-baseline gap-4">
            <span className="text-xs tracking-[0.2em] uppercase font-space-grotesk text-emerald/50">03 / WORK</span>
            <div className="flex-1 h-px bg-emerald/10" />
          </div>
        </ScrollReveal>

        {/* Featured case studies: tall cards with asymmetric layout */}
        <div className="space-y-8">
          {studies.map((cs, idx) => {
            const primaryMetric = cs.metrics?.[0]

            return (
              <ScrollReveal key={cs.id} delay={(idx + 1) * 80}>
                <Link href={`/case-studies/${cs.slug}`} className="group block">
                  {/* Asymmetric grid: 7 cols text + 5 cols metric */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start border-b border-emerald/10 pb-8 hover:border-emerald/30 transition-colors duration-300">
                    {/* Left: 7 columns */}
                    <div className="lg:col-span-7 space-y-4">
                      {cs.category && (
                        <span className="text-xs tracking-[0.15em] uppercase text-emerald/60 font-space-grotesk font-medium block">
                          {cs.category}
                        </span>
                      )}
                      <h3 className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-emerald transition-colors font-cinzel">
                        {cs.title}
                      </h3>
                      {cs.subtitle && (
                        <p className="text-base text-foreground/60 leading-relaxed max-w-lg font-light">
                          {cs.subtitle}
                        </p>
                      )}

                      {/* Tech stack: inline mono labels */}
                      {cs.tech_stack && cs.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {cs.tech_stack.slice(0, 4).map((tech: string) => (
                            <span
                              key={tech}
                              className="text-[11px] tracking-[0.1em] uppercase font-mono text-foreground/40 border-b border-emerald/20 hover:border-emerald/40 pb-1 transition-colors"
                            >
                              {tech}
                            </span>
                          ))}
                          {cs.tech_stack && cs.tech_stack.length > 4 && (
                            <span className="text-[11px] tracking-[0.1em] uppercase font-mono text-foreground/30">
                              +{cs.tech_stack.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right: 5 columns - metric + arrow */}
                    <div className="lg:col-span-5 flex items-start justify-between lg:justify-end gap-8">
                      {primaryMetric && (
                        <div className="text-right">
                          <div className="text-4xl md:text-5xl font-mono font-bold text-emerald">
                            {primaryMetric.value}
                          </div>
                          <div className="text-xs uppercase tracking-[0.15em] font-space-grotesk text-foreground/50 mt-2">
                            {primaryMetric.label}
                          </div>
                        </div>
                      )}
                      <div className="h-12 w-12 rounded-full border border-emerald/20 flex items-center justify-center group-hover:border-emerald/60 group-hover:bg-emerald/5 transition-all duration-300 flex-shrink-0 mt-0.5">
                        <ArrowUpRight className="h-5 w-5 text-foreground/40 group-hover:text-emerald transition-colors" />
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
          <div className="flex justify-center mt-16">
            <Link
              href="/case-studies"
              className="text-sm uppercase tracking-[0.15em] font-space-grotesk text-foreground/60 hover:text-emerald transition-colors inline-flex items-center gap-3 group"
            >
              View all case studies
              <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
