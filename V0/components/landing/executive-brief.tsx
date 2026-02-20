"use client"

import { ScrollReveal } from "@/components/scroll-reveal"

interface BriefProps {
  brief: {
    philosophy: string
    operating_model: string
    velocity_factor: string
    summary: string | null
    tags: string[] | null
    experience_highlights?: string[] | null
  } | null
}

export function ExecutiveBrief({ brief }: BriefProps) {
  const b = brief || {
    philosophy: "Ship to learn. Optimize to scale.",
    operating_model: "Outcome-Driven Execution",
    velocity_factor: "High-Impact Delivery",
    summary: "Senior Technical Product Manager with 10+ years of experience bridging product strategy and engineering execution. Proven track record at major telecom organizations and agile tech startups.",
    tags: ["TPM Leadership", "Full Stack", "Systems Design", "Cloud Native", "AI / ML", "Data-Driven"],
    experience_highlights: [
      "Led product strategy at WE Telecom, driving infrastructure modernization across enterprise platforms.",
      "Built and shipped AI-powered products at Infinite Tech from zero to production.",
      "Championed data-driven decision making for complex, mission-critical systems.",
    ],
  }

  // Handle both string array and object array formats
  const rawHighlights = b.experience_highlights || [
    "Led product strategy at WE Telecom, driving infrastructure modernization across enterprise platforms.",
    "Built and shipped AI-powered products at Infinite Tech from zero to production.",
    "Championed data-driven decision making for complex, mission-critical systems.",
  ]

  const highlights = Array.isArray(rawHighlights)
    ? rawHighlights.map((item: any) => {
        if (typeof item === 'string') return item
        if (typeof item === 'object' && item.label && item.value) {
          return `${item.label}: ${item.value}`
        }
        return String(item)
      })
    : []

  return (
    <section className="px-6 md:px-12 py-24" id="about">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-12">
            <div className="h-px flex-1 max-w-[40px] bg-emerald/40" />
            <span className="text-xs text-emerald tracking-widest uppercase">About Me</span>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-12 gap-12 lg:gap-20">
          {/* Left column */}
          <div className="md:col-span-5">
            <ScrollReveal delay={100}>
              <blockquote className="border-l-2 border-emerald/40 pl-6 py-1">
                <p className="text-xl md:text-2xl font-light text-foreground leading-relaxed italic">
                  {'"' + b.philosophy + '"'}
                </p>
              </blockquote>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="mt-10 space-y-6">
                <div>
                  <span className="text-xs text-muted-foreground tracking-wide uppercase block mb-2">Operating Model</span>
                  <span className="text-sm font-medium text-foreground">{b.operating_model}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground tracking-wide uppercase block mb-2">Delivery Style</span>
                  <span className="text-sm font-medium text-foreground">{b.velocity_factor}</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right column */}
          <div className="md:col-span-7">
            {b.summary && (
              <ScrollReveal delay={100}>
                <p className="text-lg md:text-xl font-light leading-relaxed text-foreground/80 mb-8">
                  {b.summary}
                </p>
              </ScrollReveal>
            )}

            <ScrollReveal delay={200}>
              <div className="space-y-4 mb-10">
                {highlights.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald shrink-0" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {b.tags && Array.isArray(b.tags) && (
              <ScrollReveal delay={300}>
                <div className="flex flex-wrap gap-2 pt-6 border-t border-border">
                  {b.tags.map((tag: any, idx: number) => {
                    const tagText = typeof tag === 'string' ? tag : String(tag)
                    return (
                      <span
                        key={idx}
                        className="bg-secondary border border-border px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:border-emerald/30 transition-all duration-300 cursor-default"
                      >
                        {tagText}
                      </span>
                    )
                  })}
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
