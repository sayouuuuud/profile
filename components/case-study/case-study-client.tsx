"use client"

import { useEffect, useRef, type ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft, Play, ExternalLink, BookOpen } from "lucide-react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/contact-footer"
import { BlockGrid } from "./blocks/block-renderer"
import { VideoModal } from "@/components/ui/video-modal"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { GENERATOR_QUESTIONS } from "@/lib/case-study-questions"

function getQuestionText(id: string) {
  return GENERATOR_QUESTIONS.find(q => q.id === id)?.question || "Key Insight"
}

function ensureAbsoluteUrl(url: string) {
  if (!url) return url
  if (url.startsWith("http://") || url.startsWith("https://")) return url
  return `https://${url}`
}
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
  const heroTag = cs.hero_tag || cs.category || "Product Strategy"
  const contentBlocks = cs.content_blocks || []

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Vertical lines */}
      <div className="vertical-lines" aria-hidden="true">
        <div className="vertical-lines-inner">
          <div />
          <div />
          <div />
        </div>
      </div>

      <Header />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="px-4 md:px-8 lg:px-12 pt-16 pb-16 max-w-[1600px] mx-auto">
          {/* Back link */}
          <Reveal>
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary text-sm transition-colors mb-10"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Case Studies
            </Link>
          </Reveal>

          {/* Tag */}
          <Reveal delay={50}>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-primary/40" />
              <span className="text-xs text-primary tracking-widest uppercase">{heroTag}</span>
            </div>
          </Reveal>

          {/* Title */}
          <Reveal delay={100}>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance mb-3">
              {cs.title}
            </h1>
          </Reveal>

          {/* Subtitle */}
          {cs.subtitle && (
            <Reveal delay={150}>
              <p className="text-lg md:text-xl text-muted-foreground font-light mb-4">
                {cs.subtitle}
              </p>
            </Reveal>
          )}

          {/* Summary */}
          {cs.summary && (
            <Reveal delay={200}>
              <p className="text-muted-foreground leading-relaxed max-w-2xl mb-8">
                {cs.summary}
              </p>
            </Reveal>
          )}

          {/* Metadata row */}
          <Reveal delay={250}>
            <div className="flex flex-wrap items-center gap-6 mb-8">
              {cs.category && (
                <span className="text-[11px] text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-md">
                  {cs.category}
                </span>
              )}
              {cs.duration && (
                <span className="text-[11px] text-muted-foreground bg-secondary border border-border px-3 py-1 rounded-md">
                  {cs.duration}
                </span>
              )}
              {cs.role && (
                <span className="text-xs text-muted-foreground">
                  Role: <span className="text-foreground">{cs.role}</span>
                </span>
              )}
            </div>
          </Reveal>

          {/* Key metrics */}
          {cs.metrics && cs.metrics.length > 0 && (() => {
            // Filter out garbage metrics (zeros, usernames, empty values)
            const cleanMetrics = cs.metrics.filter((m: any) => {
              if (!m.value || !m.label) return false
              if (m.value === "0" || m.value === "0+" || m.value === "None") return false
              if (m.label.toUpperCase() === "TOP CONTRIBUTOR") return false
              if (m.label.toUpperCase() === "STARS" && (m.value === "0" || parseInt(m.value) <= 0)) return false
              if (m.label.toUpperCase() === "FORKS" && (m.value === "0" || parseInt(m.value) <= 0)) return false
              return true
            }).slice(0, 4)

            if (cleanMetrics.length === 0) return null

            return (
            <Reveal delay={300}>
              <div className="flex flex-wrap gap-8 py-6 border-y border-border mb-8">
                {cleanMetrics.map((m: any, i: number) => (
                  <div key={i}>
                    <span className="block text-2xl md:text-3xl font-bold text-foreground">{m.value}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">{m.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
            )
          })()}

          {/* CTA Buttons */}
          {(cs.website_url || cs.video_url) && (
            <Reveal delay={350}>
              <div className="flex flex-wrap gap-3">
                {cs.website_url && (
                  <a
                    href={ensureAbsoluteUrl(cs.website_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium text-sm transition-colors"
                  >
                    Visit Website
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                {cs.story_content && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="inline-flex items-center gap-2 px-5 py-2.5 border border-primary/30 hover:border-primary/60 bg-primary/5 text-primary rounded-lg font-medium text-sm transition-colors group">
                        <BookOpen className="h-4 w-4" />
                        Story of Project
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[calc(100vw-2rem)] md:max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl md:text-3xl font-bold text-foreground">
                          {cs.story_title || cs.title}
                        </DialogTitle>
                        {cs.story_subtitle && (
                          <DialogDescription className="text-lg text-primary/80 font-medium">
                            {cs.story_subtitle}
                          </DialogDescription>
                        )}
                      </DialogHeader>
                      <div className="mt-6 text-muted-foreground leading-relaxed whitespace-pre-wrap prose prose-invert max-w-none">
                        {cs.story_content}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                {cs.video_url && (
                  <VideoModal
                    videoUrl={cs.video_url}
                    trigger={
                      <button className="inline-flex items-center gap-2 px-5 py-2.5 border border-border hover:border-primary/30 text-foreground rounded-lg font-medium text-sm transition-colors group">
                        <Play className="h-4 w-4 fill-current" />
                        Watch Video
                      </button>
                    }
                  />
                )}
              </div>
            </Reveal>
          )}

          {/* Tech Stack */}
          {cs.tech_stack && cs.tech_stack.length > 0 && (
            <Reveal delay={400}>
              <div className="flex flex-wrap gap-2 mt-8">
                {cs.tech_stack.map((tech: string) => (
                  <span
                    key={tech}
                    className="text-[11px] text-muted-foreground bg-secondary border border-border px-2.5 py-1 rounded-md hover:text-foreground hover:border-primary/20 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </Reveal>
          )}
        </section>

        <div className="hr-divider" aria-hidden="true" />

        {/* Content Blocks (Page Builder) */}
        {contentBlocks.length > 0 && (
          <section className="px-4 md:px-8 lg:px-12 py-16 max-w-[1600px] mx-auto">
            <BlockGrid blocks={contentBlocks} />
          </section>
        )}


        {/* Deep Dive (Hybrid Interview) */}
        {cs.responses && cs.responses.length > 0 && (
          <section className="px-4 md:px-8 lg:px-12 py-16 max-w-[1000px] mx-auto">
            <Reveal>
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-3 flex items-center gap-3">
                  <span className="w-8 h-1 bg-primary rounded-full" />
                  Inside the Build
                </h2>
                <p className="text-muted-foreground">Technical deep dive and architectural decisions.</p>
              </div>
            </Reveal>

            <div className="space-y-12">
              {cs.responses.map((resp: any, i: number) => {
                // Import dynamically or check if we can import at top. 
                // Since we are in client component, we should import at top, but for replace_file_content strictness let's assume we pass it or import it.
                // Actually, better to just map it here if we imported it.
                // Let's add the import to the top of file in a separate edit or assume it's available.
                // Wait, I can't import in the middle of a file. I should have added the import first.
                // I'll proceed with rendering and assume `questions` map is available or I'll use a helper.
                // I will fix the import in the next step or use a hardcoded lookup for now if needed, but import is better.
                return (
                  <Reveal key={resp.id} delay={i * 100}>
                    <div className="group relative pl-8 border-l-2 border-border hover:border-primary/50 transition-colors">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-border group-hover:border-primary transition-colors" />
                      <h3 className="text-lg font-semibold text-foreground mb-3">
                        {getQuestionText(resp.question_id)}
                      </h3>
                      <div className="prose prose-invert prose-sm max-w-none text-muted-foreground">
                        <p className="whitespace-pre-wrap">{resp.response}</p>
                      </div>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </section>
        )}



        {/* Bottom nav */}
        <div className="hr-divider" aria-hidden="true" />
        <section className="px-4 md:px-8 lg:px-12 py-10 max-w-[1600px] mx-auto">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            All Case Studies
          </Link>
        </section>
      </main>

      <div className="hr-divider" aria-hidden="true" />
      <Footer />
    </div>
  )
}
