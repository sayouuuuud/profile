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
    <section className="px-6 md:px-12 py-32 bg-background border-t border-border" id="work">
      <div className="max-w-7xl mx-auto">
        {/* Section header: editorial style */}
        <ScrollReveal>
          <div className="mb-20 border-b border-border pb-12">
            <div className="label mb-4">Featured Work</div>
            <h2 className="font-serif italic text-5xl md:text-6xl leading-tight tracking-title text-balance">
              Selected Projects
            </h2>
          </div>
        </ScrollReveal>

        {/* Asymmetric editorial list (tall cards break expectations) */}
        <div className="space-y-20">
          {studies.slice(0, 4).map((cs, idx) => {
            const primaryMetric = cs.metrics?.[0]
            const isFeatured = idx === 0

            return (
              <ScrollReveal key={cs.id} delay={(idx + 1) * 80}>
                <Link href={`/case-studies/${cs.slug}`} className="group block">
                  {/* Asymmetric grid: 7 cols text + 5 cols image/metric */}
                  <div className={`grid-editorial items-start gap-8 pb-12 ${idx < studies.length - 1 ? 'border-b border-border' : ''}`}>
                    {/* LEFT: 7 columns */}
                    <div className="col-content space-y-6">
                      {cs.category && (
                        <div className="label">{cs.category}</div>
                      )}
                      <h3 className="font-serif italic text-3xl md:text-4xl leading-tight tracking-title text-balance group-hover:text-accent transition-colors">
                        {cs.title}
                      </h3>
                      {cs.subtitle && (
                        <p className="font-sans text-base leading-relaxed warmgray max-w-md">
                          {cs.subtitle}
                        </p>
                      )}

                      {/* Tech stack: inline mono labels */}
                      {cs.tech_stack && cs.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-3 pt-4">
                          {cs.tech_stack.slice(0, 4).map((tech: string) => (
                            <span
                              key={tech}
                              className="text-xs font-mono uppercase tracking-label text-muted border-b border-border group-hover:border-accent pb-1 transition-colors"
                            >
                              {tech}
                            </span>
                          ))}
                          {cs.tech_stack.length > 4 && (
                            <span className="text-xs font-mono uppercase tracking-label text-muted/60">
                              +{cs.tech_stack.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* RIGHT: 5 columns — metric only, no icon */}
                    {primaryMetric && (
                      <div className="col-image md:col-start-8">
                        <div className="space-y-2">
                          <div className="text-5xl md:text-6xl font-mono font-bold text-accent tracking-tight">
                            {primaryMetric.value}
                          </div>
                          <div className="label">{primaryMetric.label}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hover indicator: arrow slides in from right */}
                  <div className="flex justify-end pt-4 group-hover:translate-x-2 transition-transform">
                    <ArrowUpRight className="w-5 h-5 text-muted group-hover:text-accent transition-colors" />
                  </div>
                </Link>
              </ScrollReveal>
            )
          })}
        </div>

        {/* View All CTA: editorial button */}
        <ScrollReveal delay={500}>
          <div className="flex justify-center mt-20 pt-12 border-t border-border">
            <Link href="/case-studies" className="btn-secondary">
              All Case Studies
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
