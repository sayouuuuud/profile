"use client"

import { ArrowUpRight } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import Image from "next/image"

interface HeroProps {
  settings: {
    hero_name: string
    hero_subtitle: string
    hero_description: string | null
    hero_image_url: string | null
    hero_role: string
    hero_class: string
    hero_status: string
    hero_location: string
    hero_timezone: string
  } | null
}

export function HeroSection({ settings }: HeroProps) {
  const s = settings || {
    hero_name: "SAYED ELSHAZLY",
    hero_subtitle: "Technical Product Manager",
    hero_description: "I bridge product strategy and engineering execution. Building AI-powered products with measurable impact.",
    hero_image_url: null,
    hero_role: "TPM",
    hero_class: "Strategic Executive",
    hero_status: "Available",
    hero_location: "Cairo, EG / Remote",
    hero_timezone: "UTC+3",
  }

  return (
    <section className="w-full bg-background pt-32 md:pt-48 pb-32">
      <div className="px-6 md:px-12 max-w-7xl mx-auto">
        {/* 12-col asymmetric grid: content 7 cols, image 6 cols (overlap 1) */}
        <div className="grid-editorial">
          {/* LEFT: 7 columns of pure content + breathing */}
          <div className="col-content space-y-12">
            {/* Label: mono, uppercase, tracked */}
            <ScrollReveal>
              <div className="label">{s.hero_role} / {s.hero_status}</div>
            </ScrollReveal>

            {/* Hero: massive, italic serif, tight */}
            <ScrollReveal delay={60}>
              <h1 className="font-serif italic text-6xl md:text-7xl lg:text-8xl leading-tight tracking-title text-balance">
                {s.hero_name}
              </h1>
            </ScrollReveal>

            {/* Subtitle: serif, warm rust accent */}
            <ScrollReveal delay={120}>
              <p className="font-serif italic text-2xl md:text-3xl text-accent leading-tight tracking-title">
                {s.hero_subtitle}
              </p>
            </ScrollReveal>

            {/* Description: geist body, warm gray, generous line-height */}
            {s.hero_description && (
              <ScrollReveal delay={180}>
                <p className="font-sans text-lg leading-relaxed max-w-lg warmgray">
                  {s.hero_description}
                </p>
              </ScrollReveal>
            )}

            {/* Meta grid: location + timezone */}
            <ScrollReveal delay={240}>
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border">
                <div>
                  <div className="label mb-2">Location</div>
                  <p className="font-sans text-base text-foreground">{s.hero_location}</p>
                </div>
                <div>
                  <div className="label mb-2">Timezone</div>
                  <p className="font-sans text-base text-foreground">{s.hero_timezone}</p>
                </div>
              </div>
            </ScrollReveal>

            {/* CTA: editorial button with italic serif */}
            <ScrollReveal delay={300}>
              <a href="#work" className="btn-primary inline-flex items-center gap-2">
                View Work
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </ScrollReveal>
          </div>

          {/* RIGHT: 6 columns (overlap left 1) — image only */}
          <ScrollReveal delay={150}>
            <div className="col-image aspect-[3/4] relative overflow-hidden border border-border">
              {s.hero_image_url ? (
                <Image
                  alt={s.hero_name}
                  src={s.hero_image_url}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-card flex items-center justify-center border-r border-b border-border">
                  <span className="font-serif italic text-9xl text-border/20">
                    {s.hero_name.charAt(0)}
                  </span>
                </div>
              )}
              {/* Subtle top highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-20" />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
