"use client"

import { MapPin, Clock, ArrowRight } from "lucide-react"
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
    <section className="px-6 md:px-12 pt-20 md:pt-32 pb-24 w-full relative">
      <div className="max-w-7xl mx-auto"

      <div className="max-w-7xl mx-auto">
        {/* 12-column asymmetric grid: 7 cols text + 5 cols image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* LEFT: 7-column text (cols 1-7) */}
          <div className="lg:col-span-7 space-y-12">
            {/* Status label */}
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-emerald/20 rounded-none text-xs tracking-[0.2em] uppercase font-space-grotesk">
                <span className="w-1.5 h-1.5 bg-emerald rounded-full" />
                {s.hero_status}
              </div>
            </ScrollReveal>

            {/* Headline: large, tight, mono-number + serif name */}
            <ScrollReveal delay={80}>
              <div className="space-y-4">
                <div className="flex items-baseline gap-4 font-cinzel">
                  <span className="text-emerald/40 text-xs tracking-[0.15em] leading-none font-space-grotesk">01 / EXECUTIVE</span>
                </div>
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight">
                  {s.hero_name}
                </h1>
                <p className="text-lg md:text-xl text-emerald/80 font-space-grotesk tracking-wide">
                  {s.hero_subtitle}
                </p>
              </div>
            </ScrollReveal>

            {/* Subheading: editorial, max width */}
            {s.hero_description && (
              <ScrollReveal delay={160}>
                <p className="text-base md:text-lg text-foreground/70 max-w-lg leading-relaxed font-light">
                  {s.hero_description}
                </p>
              </ScrollReveal>
            )}

            {/* Meta: location + timezone in mono */}
            <ScrollReveal delay={240}>
              <div className="flex flex-col sm:flex-row gap-6 text-sm font-space-grotesk font-mono text-foreground/50 uppercase tracking-[0.1em]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald/40 flex-shrink-0" />
                  <span>{s.hero_location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald/40 flex-shrink-0" />
                  <span>{s.hero_timezone}</span>
                </div>
              </div>
            </ScrollReveal>

            {/* CTA: asymmetric placement */}
            <ScrollReveal delay={320}>
              <div className="pt-8 border-t border-emerald/10">
                <a
                  href="#work"
                  className="inline-flex items-center gap-3 text-sm font-space-grotesk tracking-wide uppercase hover:text-emerald transition-colors duration-300 group"
                >
                  Explore my work
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </ScrollReveal>
          </div>

          {/* RIGHT: 5-column image (cols 8-12) */}
          <div className="lg:col-span-5 relative">
            <ScrollReveal delay={100}>
              <div className="aspect-[3/4] relative overflow-hidden">
                {s.hero_image_url ? (
                  <Image
                    alt={s.hero_name}
                    src={s.hero_image_url}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald/5 to-emerald/10 flex items-center justify-center">
                    <span className="text-emerald/10 text-9xl font-bold font-cinzel">{s.hero_name.charAt(0)}</span>
                  </div>
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-40" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
