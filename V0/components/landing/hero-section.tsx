"use client"

import { MapPin, Clock, ArrowDown } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"

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
    hero_description: "I bridge product strategy and engineering execution to build products that drive measurable business impact. Specializing in AI-powered systems, scalable architecture, and user-centric design.",
    hero_image_url: null,
    hero_role: "TPM",
    hero_class: "Strategic Executive",
    hero_status: "Available",
    hero_location: "Cairo, EG / Remote",
    hero_timezone: "UTC+3",
  }

  return (
    <section className="px-6 md:px-12 pt-10  md:pt-24 pb-20 w-full min-h-[90vh] flex flex-col justify-center relative overflow-hidden">
      {/* neon.tech-style gradient orbs */}
      <div className="gradient-orb w-[600px] h-[600px] bg-emerald top-0 right-[-10%] animate-float" style={{ animationDelay: "0s" }} />
      <div className="gradient-orb w-[400px] h-[400px] bg-blue-500 bottom-0 left-[10%] animate-float" style={{ animationDelay: "-8s" }} />
      <div className="gradient-orb w-[300px] h-[300px] bg-emerald-dim top-1/2 left-1/2 animate-glow-pulse" />

      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 w-full max-w-7xl mx-auto items-center relative z-10">
        {/* Left: Text content */}
        <div className="lg:col-span-7 flex flex-col gap-6 order-last lg:order-first">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald" />
              </span>
              <span className="text-emerald/80 text-xs tracking-widest uppercase">
                {s.hero_status}
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h1 className="text-foreground font-bold leading-[1.05]">
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl glow-text">
                {s.hero_name}
              </span>
              <span className="block text-lg sm:text-xl md:text-2xl font-light text-muted-foreground mt-3">
                {s.hero_subtitle}
              </span>
            </h1>
          </ScrollReveal>

          {s.hero_description && (
            <ScrollReveal delay={200}>
              <p className="text-muted-foreground text-base md:text-lg max-w-xl leading-relaxed mt-2">
                {s.hero_description}
              </p>
            </ScrollReveal>
          )}

          <ScrollReveal delay={300}>
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <a
                href="#work"
                className="inline-flex items-center justify-center rounded-lg bg-emerald hover:bg-emerald-dim transition-colors text-background text-sm font-medium h-11 px-6 gap-2"
              >
                View My Work
                <ArrowDown className="h-4 w-4" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-lg border border-border hover:border-emerald/30 transition-colors text-foreground text-sm font-medium h-11 px-6"
              >
                Get in Touch
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="flex items-center gap-5 mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-emerald/60" />
                {s.hero_location}
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-emerald/60" />
                {s.hero_timezone}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Right: Profile image */}
        <div className="lg:col-span-5 relative w-full flex justify-center lg:justify-end order-first lg:order-last">
          <ScrollReveal delay={200}>
            <div className="relative w-full max-w-sm aspect-[3/4] group">
              {/* Glow behind image */}
              <div className="absolute -inset-8 bg-emerald/8 rounded-3xl blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

              {/* Image container */}
              <div className="relative h-full w-full rounded-2xl border border-border overflow-hidden card-glow">
                {s.hero_image_url ? (
                  <img
                    alt={s.hero_name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                    src={s.hero_image_url}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-surface-dark to-surface-light flex items-center justify-center">
                    <span className="text-7xl font-bold text-emerald/10">
                      {s.hero_name.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />

                {/* Bottom info bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="glass-panel rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground">{s.hero_class}</div>
                      <div className="text-sm text-foreground font-medium">{s.hero_role}</div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-emerald">
                      <span className="w-1.5 h-1.5 bg-emerald rounded-full" />
                      {s.hero_status}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
