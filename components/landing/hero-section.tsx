"use client"

import { MapPin, Clock } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { useEffect, useState, useCallback } from "react"

function TypewriterText({ text, speed = 80, delay = 600 }: { text: string; speed?: number; delay?: number }) {
  const [displayed, setDisplayed] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    let i = 0

    const startTyping = () => {
      timeout = setTimeout(function tick() {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1))
          i++
          timeout = setTimeout(tick, speed + Math.random() * 40)
        } else {
          setDone(true)
        }
      }, speed)
    }

    const delayTimeout = setTimeout(startTyping, delay)

    return () => {
      clearTimeout(timeout)
      clearTimeout(delayTimeout)
    }
  }, [text, speed, delay])

  useEffect(() => {
    if (!done) return
    const interval = setInterval(() => setShowCursor(c => !c), 530)
    return () => clearInterval(interval)
  }, [done])

  return (
    <span>
      {displayed}
      <span
        className={`inline-block w-[3px] h-[0.85em] bg-[#10b981] ml-1 align-middle transition-opacity duration-100 ${
          showCursor ? "opacity-100" : "opacity-0"
        }`}
      />
    </span>
  )
}

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
    hero_subtitle: "// The Wartime Architect",
    hero_description: "High-Velocity Technical Product Manager who thrives at the intersection of complex technology and user-centric design. Specializing in zero-sum engineering, AI orchestration, and mission-critical systems.",
    hero_image_url: null,
    hero_role: "TPM",
    hero_class: "Strategic Executive",
    hero_status: "OPERATIONAL",
    hero_location: "CAIRO, EG // REMOTE",
    hero_timezone: "UTC+3",
  }

  return (
    <section className="px-6 md:px-12 pt-32 pb-24 w-full min-h-[90vh] flex flex-col justify-center relative overflow-hidden">
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#10b981]/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-pulse" />
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />

      <div className="grid lg:grid-cols-12 gap-12 w-full max-w-7xl mx-auto items-center relative z-10">
        <div className="lg:col-span-6 flex flex-col gap-8">
          <ScrollReveal>
            <div className="flex items-center gap-3 text-[#10b981] text-xs font-mono tracking-[0.3em] uppercase opacity-80 mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]" />
              </span>
              Architect Command Center
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h1 className="font-black leading-[0.9] tracking-[0.02em] uppercase whitespace-nowrap">
              <span className="text-foreground relative z-10 glow-text text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                <TypewriterText text={s.hero_name} speed={90} delay={400} />
              </span>
              <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-[#6b7280]/60 tracking-normal mt-4 font-mono">
                {s.hero_subtitle}
              </span>
            </h1>
          </ScrollReveal>

          {s.hero_description && (
            <ScrollReveal delay={200}>
              <p className="text-[#6b7280] text-base md:text-lg mt-4 max-w-2xl font-light leading-relaxed border-l border-[#10b981]/30 pl-6 py-2">
                {s.hero_description}
              </p>
            </ScrollReveal>
          )}

          <ScrollReveal delay={300}>
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#10b981]/80">
                <MapPin className="h-3.5 w-3.5" />
                {s.hero_location}
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-2 text-xs font-mono text-[#10b981]/80">
                <Clock className="h-3.5 w-3.5" />
                {s.hero_timezone}
              </div>
            </div>
          </ScrollReveal>
        </div>

        <div className="lg:col-span-6 relative w-full flex justify-center lg:justify-end mt-12 lg:mt-0">
          <ScrollReveal delay={200}>
            <div className="relative w-full max-w-md aspect-[4/5] group">
              <div className="absolute -inset-10 bg-gradient-to-tr from-[#10b981]/20 via-transparent to-amber-500/20 blur-[80px] opacity-40 group-hover:opacity-70 transition-all duration-1000" />
              <div className="relative h-full w-full glass-panel border border-[#10b981]/40 shadow-2xl overflow-hidden" style={{ clipPath: "polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)" }}>
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#10b981] z-30" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#10b981] z-30" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#10b981] z-30" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#10b981] z-30" />

                {s.hero_image_url ? (
                  <img
                    alt={s.hero_name}
                    className="w-full h-full object-cover object-top opacity-90 transition-transform duration-1000 group-hover:scale-105"
                    src={s.hero_image_url}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#0a0a0a] to-[#050505] flex items-center justify-center">
                    <span className="text-6xl font-black text-[#10b981]/20">{s.hero_name.charAt(0)}</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-[#10b981]/5 opacity-60" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="bg-black/80 backdrop-blur-xl border-t border-[#10b981]/40 p-4 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-[10px] text-[#10b981]/60 font-mono tracking-widest uppercase">{"Class: " + s.hero_class}</div>
                      <div className="text-sm text-white font-bold font-mono tracking-widest flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
                        {"ROLE: " + s.hero_role}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-[10px] text-[#34d399] font-mono tracking-widest uppercase flex items-center justify-end gap-1.5">
                        <span className="w-1.5 h-1.5 bg-[#34d399] rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                        {"STATUS: " + s.hero_status}
                      </div>
                      <div className="text-[9px] text-[#6b7280] font-mono tracking-widest">UID_SYS.VER.3.0_2024</div>
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
