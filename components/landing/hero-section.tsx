"use client"

import { MapPin, Clock, ArrowRight, Sparkles } from "lucide-react"
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
    <section className="w-full relative overflow-hidden">
      {/* BOLD SPLIT SCREEN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* LEFT: Dark background with content - BOLD TYPOGRAPHY */}
        <div className="bg-background px-6 md:px-12 py-16 md:py-24 flex flex-col justify-between relative">
          {/* Accent line decoration */}
          <div className="absolute top-0 left-0 h-1 w-32 bg-gradient-to-r from-emerald via-emerald to-emerald/0" />

          <div className="space-y-16">
            {/* Label with badge */}
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 border border-emerald/30 rounded-full text-xs font-space-grotesk tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
                {s.hero_status}
              </div>
            </ScrollReveal>

            {/* BOLD MAIN HEADLINE - MASSIVE */}
            <ScrollReveal delay={80}>
              <div>
                <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold font-cinzel leading-[0.9] mb-6">
                  {s.hero_name.split(" ").map((word, i) => (
                    <div key={i} className="relative inline-block mr-4">
                      <span className="text-foreground">{word}</span>
                      {i === 0 && <div className="absolute -bottom-3 left-0 h-1 w-full bg-emerald" />}
                    </div>
                  ))}
                </h1>
                <p className="text-2xl md:text-3xl text-emerald font-space-grotesk font-light tracking-wide">
                  {s.hero_subtitle}
                </p>
              </div>
            </ScrollReveal>

            {/* Description text - punchy */}
            {s.hero_description && (
              <ScrollReveal delay={160}>
                <div className="space-y-6 max-w-md">
                  <p className="text-lg md:text-xl text-foreground/80 leading-relaxed font-light">
                    {s.hero_description}
                  </p>

                  {/* Meta info in grid */}
                  <div className="grid grid-cols-2 gap-6 pt-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-emerald flex-shrink-0 mt-1" />
                      <div>
                        <div className="text-xs text-foreground/50 font-space-grotesk uppercase tracking-wider">Location</div>
                        <div className="text-sm text-foreground font-medium">{s.hero_location}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-emerald flex-shrink-0 mt-1" />
                      <div>
                        <div className="text-xs text-foreground/50 font-space-grotesk uppercase tracking-wider">Timezone</div>
                        <div className="text-sm text-foreground font-medium">{s.hero_timezone}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>

          {/* CTA - BOLD BUTTON */}
          <ScrollReveal delay={240}>
            <a
              href="#work"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-emerald hover:bg-emerald/90 text-background font-space-grotesk font-bold uppercase tracking-wider text-sm transition-all duration-300 hover:scale-105 active:scale-95 w-fit"
            >
              View My Work
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </a>
          </ScrollReveal>
        </div>

        {/* RIGHT: Image with overlay - DRAMATIC */}
        <div className="hidden lg:block relative overflow-hidden bg-emerald/5">
          <ScrollReveal delay={100}>
            <div className="w-full h-full relative group">
              {s.hero_image_url ? (
                <Image
                  alt={s.hero_name}
                  src={s.hero_image_url}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  priority
                  sizes="50vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald/20 via-emerald/10 to-background flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="w-24 h-24 text-emerald/20 mx-auto mb-4" />
                    <span className="text-emerald/30 text-5xl font-bold font-cinzel">{s.hero_name.charAt(0)}</span>
                  </div>
                </div>
              )}

              {/* BOLD GRADIENT OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/30 to-transparent" />

              {/* ACCENT CIRCLE - BOTTOM RIGHT */}
              <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full border-2 border-emerald/20 group-hover:border-emerald/40 transition-colors" />
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Mobile image below on small screens */}
      <ScrollReveal delay={200}>
        <div className="lg:hidden px-6 md:px-12 py-16 bg-emerald/5">
          <div className="aspect-[3/4] relative overflow-hidden rounded-lg">
            {s.hero_image_url ? (
              <Image
                alt={s.hero_name}
                src={s.hero_image_url}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-emerald/20 to-background flex items-center justify-center">
                <span className="text-emerald/10 text-8xl font-bold font-cinzel">{s.hero_name.charAt(0)}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}
