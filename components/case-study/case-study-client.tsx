"use client"

import { useEffect, useRef, type ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft, Play } from "lucide-react"
import { Header } from "@/components/landing/header"
import { BlockGrid } from "./blocks/block-renderer"
import { VideoModal } from "@/components/ui/video-modal"

/* ========== Scroll Reveal ========== */
function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("is-visible"); obs.unobserve(el) } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reveal-on-scroll ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  )
}

/* ========== MAIN COMPONENT ========== */
export function CaseStudyClient({ cs }: { cs: any }) {
  const heroTag = cs.hero_tag || "Product Strategy & Technical Architecture"
  const contentBlocks = cs.content_blocks || []
  const footerText = cs.footer_text || `\u00A9 2024 SAYED ELSHAZLY // ${cs.title}`

  return (
    <div className="min-h-screen bg-[#050505] text-white relative font-sans">
      {/* Grid Background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundSize: "40px 40px",
          backgroundImage: "linear-gradient(to right, #1f2937 1px, transparent 1px), linear-gradient(to bottom, #1f2937 1px, transparent 1px)",
          maskImage: "radial-gradient(circle at center, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 30%, transparent 80%)",
        }}
      />
      {/* Scanline */}
      <div
        className="fixed inset-0 z-50 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent 50%, rgba(16,185,129,0.03) 51%)",
          backgroundSize: "100% 4px",
        }}
      />

      <Header />

      {/* ======== MAIN ======== */}
      <main className="flex-1 relative flex flex-col w-full max-w-7xl mx-auto z-10 pb-20">

        {/* === HERO SECTION === */}
        <section id="overview" className="px-6 md:px-10 pt-16 pb-12 w-full">
          <div className="flex flex-col gap-2 mb-8">
            <Reveal>
              <div className="flex items-center gap-2 text-[#10b981] text-xs font-mono tracking-widest uppercase mb-2">
                <span className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse" />
                {heroTag}
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="text-4xl md:text-6xl font-black leading-none tracking-tight uppercase max-w-4xl text-balance" style={{ textShadow: "0 0 20px rgba(16,185,129,0.4)" }}>
                {cs.title}{" "}
                <span className="text-[#6b7280] block md:inline text-2xl md:text-4xl align-middle opacity-50">{"//"}</span>{" "}
                <span className="text-white">{cs.subtitle}</span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-[#6b7280] text-lg mt-4 max-w-2xl font-light">{cs.summary}</p>
            </Reveal>

            {/* CTA Buttons */}
            {(cs.website_url || cs.video_url) && (
              <Reveal delay={300} className="mt-8 flex flex-wrap gap-4">
                {cs.website_url && (
                  <a
                    href={cs.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-[#10b981] text-black hover:bg-[#059669] rounded font-bold uppercase tracking-wider text-sm transition-all hover:scale-105"
                  >
                    Visit Website
                    <ArrowLeft className="rotate-[135deg] size-4" />
                  </a>
                )}

                {cs.video_url && (
                  <VideoModal
                    videoUrl={cs.video_url}
                    trigger={
                      <button className="flex items-center gap-2 px-6 py-3 border border-[#374151] hover:border-[#10b981] hover:text-[#10b981] text-white rounded font-bold uppercase tracking-wider text-sm transition-all hover:scale-105 group">
                        <Play className="size-4 fill-current" />
                        Watch Video
                      </button>
                    }
                  />
                )}
              </Reveal>
            )}
          </div>
        </section>

        {/* === CONTENT BLOCKS (Page Builder) === */}
        {contentBlocks.length > 0 && (
          <section className="px-6 md:px-10 py-6">
            <BlockGrid blocks={contentBlocks} />
          </section>
        )}

        {/* Back link */}
        <section className="px-6 md:px-10 py-8">
          <Link href="/case-studies" className="inline-flex items-center gap-2 text-[#10b981] hover:text-[#10b981]/80 text-sm font-mono uppercase tracking-wider transition-colors">
            <ArrowLeft className="size-4" />
            Back to Mission Archive
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#1f2937] bg-[#0a0a0a] py-8">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between items-center text-xs text-[#6b7280] font-mono">
          <div className="flex items-center gap-2">
            <span className="size-2 bg-green-500 rounded-full animate-pulse" />
            SYSTEM STATUS: OPTIMAL
          </div>
          <div className="mt-4 md:mt-0">{footerText}</div>
        </div>
      </footer>
    </div>
  )
}
