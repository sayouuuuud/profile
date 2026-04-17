"use client"

import { MapPin, Clock, ArrowDown, Sparkles } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import Image from "next/image"
import { useEffect, useState } from "react"

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

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const nameWords = s.hero_name.split(" ")

  return (
    <section className="px-6 md:px-12 pt-10 md:pt-24 pb-20 w-full min-h-[90vh] flex flex-col justify-center relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="gradient-orb w-[600px] h-[600px] bg-emerald top-0 right-[-10%] animate-float" style={{ animationDelay: "0s" }} />
      <div className="gradient-orb w-[400px] h-[400px] bg-blue-500 bottom-0 left-[10%] animate-float" style={{ animationDelay: "-8s" }} />
      <div className="gradient-orb w-[300px] h-[300px] bg-emerald-dim top-1/2 left-1/2 animate-glow-pulse" />

      {/* Ambient accent lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 w-1/3 h-px bg-gradient-to-r from-emerald/0 via-emerald/20 to-emerald/0" />
        <div className="absolute top-2/3 right-0 w-1/3 h-px bg-gradient-to-l from-emerald/0 via-emerald/20 to-emerald/0" />
      </div>

      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 w-full max-w-7xl mx-auto items-center relative z-10">
        {/* Left: Text content */}
        <div className="lg:col-span-7 flex flex-col gap-8 order-last lg:order-first">
          {/* Status badge with animation */}
          <ScrollReveal>
            <div className={`flex items-center gap-3 mb-2 ${mounted ? 'animate-slide-right' : 'opacity-0'}`}>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald" />
              </span>
              <span className="text-emerald/90 text-xs tracking-widest uppercase font-space-grotesk font-medium">
                {s.hero_status}
              </span>
            </div>
          </ScrollReveal>

          {/* Hero name with staggered reveal */}
          <ScrollReveal delay={100}>
            <div className="space-y-3">
              <h1 className="font-bold leading-[1.02]">
                <div className="flex flex-wrap items-baseline gap-x-4 lg:gap-x-6">
                  {nameWords.map((word, i) => (
                    mounted ? (
                      <span 
                        key={i} 
                        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl animate-text-reveal-line"
                        style={{ animationDelay: `${i * 80}ms` }}
                      >
                        {word}
                      </span>
                    ) : (
                      <span key={i} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl opacity-0">
                        {word}
                      </span>
                    )
                  ))}
                </div>
                <div className="relative mt-4 inline-block">
                  <span className="block text-lg sm:text-xl md:text-2xl font-light text-muted-foreground tracking-wide">
                    {s.hero_subtitle}
                  </span>
                  <div className={`absolute -bottom-3 left-0 h-0.5 bg-gradient-to-r from-emerald to-emerald/0 ${mounted ? 'animate-accent-line' : 'w-0'}`} style={{ animationDelay: '400ms' }} />
                </div>
              </h1>
            </div>
          </ScrollReveal>

          {/* Description with fade-in */}
          {s.hero_description && (
            <ScrollReveal delay={300}>
              <div className={`${mounted ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '300ms' }}>
                <p className="text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed font-light">
                  {s.hero_description}
                </p>
              </div>
            </ScrollReveal>
          )}

          {/* CTA Buttons with premium styling */}
          <ScrollReveal delay={400}>
            <div className={`flex flex-wrap items-center gap-4 mt-8 ${mounted ? 'animate-fade-scale' : 'opacity-0'}`} style={{ animationDelay: '400ms' }}>
              <a
                href="#work"
                className="button-premium group inline-flex items-center justify-center rounded-lg bg-emerald hover:bg-emerald/90 active:scale-95 text-background text-sm font-medium h-12 px-8 gap-2 shadow-lg shadow-emerald/20 hover:shadow-emerald/40 transition-all duration-300"
              >
                <span>View My Work</span>
                <ArrowDown className="h-4 w-4 group-hover:translate-y-1 transition-transform duration-300" />
              </a>
              <a
                href="#contact"
                className="button-premium inline-flex items-center justify-center rounded-lg border border-emerald/30 hover:border-emerald/60 hover:bg-emerald/5 text-foreground text-sm font-medium h-12 px-8 transition-all duration-300"
              >
                Get in Touch
              </a>
            </div>
          </ScrollReveal>

          {/* Location and timezone info */}
          <ScrollReveal delay={500}>
            <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mt-8 pt-8 border-t border-border/30 ${mounted ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '500ms' }}>
              <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <MapPin className="h-4 w-4 text-emerald/60 flex-shrink-0" />
                <span className="font-light">{s.hero_location}</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-border/30" />
              <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Clock className="h-4 w-4 text-emerald/60 flex-shrink-0" />
                <span className="font-light">{s.hero_timezone}</span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Right: Profile image with premium effects */}
        <div className="lg:col-span-5 relative w-full flex justify-center lg:justify-end order-first lg:order-last min-h-[350px] sm:min-h-[450px]">
          <ScrollReveal delay={200} className="w-full h-full">
            <div className={`relative w-full max-w-sm aspect-[3/4] group mx-auto lg:ml-auto ${mounted ? 'animate-fade-scale' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
              {/* Premium glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-br from-emerald/30 to-emerald/5 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              
              {/* Inner accent border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald/10 to-emerald/0 pointer-events-none" />

              {/* Image container */}
              <div className="relative h-full w-full rounded-2xl border border-emerald/20 overflow-hidden card-glow">
                {s.hero_image_url ? (
                  <Image
                    alt={s.hero_name}
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    src={s.hero_image_url}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald/10 to-emerald/5 flex items-center justify-center">
                    <span className="text-8xl font-bold text-emerald/15 font-cinzel">
                      {s.hero_name.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-70" />

                {/* Bottom info bar with glassmorphism */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/80 to-transparent">
                  <div className="glass-panel rounded-lg p-4 flex items-center justify-between border border-emerald/20">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium font-space-grotesk">{s.hero_class}</div>
                      <div className="text-sm text-foreground font-medium mt-1 font-cinzel">{s.hero_role}</div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-emerald font-medium font-space-grotesk">
                      <span className="w-2 h-2 bg-emerald rounded-full animate-pulse" />
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
