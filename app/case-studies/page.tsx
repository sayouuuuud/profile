"use client"

import React, { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { ArrowRight, Zap, Target, Shield, ShoppingCart } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Header } from "@/components/landing/header"

export default function CaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("case_studies")
          .select("*")
          .eq("is_visible", true)
          .order("sort_order")
        if (!error) setCaseStudies(data)
      } catch {
        setCaseStudies(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Grid background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-grid-pattern" style={{ backgroundSize: "40px 40px", maskImage: "radial-gradient(circle at center, black 30%, transparent 80%)", WebkitMaskImage: "radial-gradient(circle at center, black 30%, transparent 80%)" }} />
      {/* Scanline */}
      <div className="fixed inset-0 z-50 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(16,185,129,0.03) 51%)", backgroundSize: "100% 4px" }} />

      <Header />

      <main className="flex-1 relative flex flex-col w-full max-w-7xl mx-auto z-10 pb-20">
        {/* Hero Section */}
        <section className="px-6 md:px-10 pt-16 pb-12 w-full">
          <ScrollReveal>
            <div className="flex flex-col gap-2 mb-8">
              <div className="flex items-center gap-2 text-primary text-xs font-mono tracking-widest uppercase mb-2">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Operational Database
              </div>
              <h1 className="text-4xl md:text-6xl font-black leading-none tracking-tight uppercase max-w-4xl" style={{ textShadow: "0 0 20px rgba(16,185,129,0.4)" }}>
                {"SYSTEM_ARCHIVE "}
                <span className="text-muted-foreground block md:inline text-2xl md:text-4xl align-middle opacity-50">{"//"}</span>
                {" "}
                <span className="text-foreground">PROJECT_INTERVENTIONS</span>
              </h1>
              <div className="flex items-center gap-4 mt-6">
                <span className="text-muted-foreground font-mono text-xs uppercase tracking-wider">Active Missions:</span>
                <span className="text-foreground font-mono text-xl font-bold">{String(caseStudies?.length || 0).padStart(2, "0")}</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Filter bar */}
          <ScrollReveal delay={100}>
            <div className="flex flex-wrap items-center gap-4 mb-12 border-b border-border pb-6">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest mr-4">Filter Protocols:</span>
              <button type="button" className="px-4 py-2 bg-primary/10 border border-primary text-primary text-xs font-mono uppercase tracking-wider rounded hover:bg-primary/20 transition-all flex items-center gap-2">
                <Zap className="size-3.5" /> All Missions
              </button>
            </div>
          </ScrollReveal>

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="flex items-center gap-3 text-muted-foreground font-mono text-sm">
                <div className="size-2 bg-primary rounded-full animate-pulse" />
                Loading missions...
              </div>
            </div>
          )}

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {(caseStudies || []).map((cs: any, idx: number) => (
              <ScrollReveal key={cs.id} delay={idx * 150}>
                <Link
                  href={`/case-studies/${cs.slug}`}
                  className="rounded-lg border border-border relative group overflow-hidden transition-all duration-300 hover:border-primary/50 h-[420px] flex flex-col"
                  style={{ background: "rgba(10,10,10,0.7)", backdropFilter: "blur(12px)" }}
                >
                  {/* Background */}
                  <div className="absolute inset-0 z-0">
                    <div className="w-full h-full bg-gradient-to-br from-surface-dark to-gray-900 transition-all duration-500 relative group-hover:opacity-20 group-hover:grayscale">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="p-6 flex justify-between items-start">
                      <div className="bg-background/60 backdrop-blur-md px-3 py-1 border border-primary/30 rounded text-[10px] font-mono text-primary uppercase tracking-widest">
                        {cs.category}
                      </div>
                      <div className="bg-background/60 backdrop-blur-md px-3 py-1 border border-border rounded text-[10px] font-mono text-foreground uppercase tracking-widest">
                        {cs.duration}
                      </div>
                    </div>
                    <div className="mt-auto bg-gradient-to-t from-black via-black/90 to-transparent p-6 pt-12 border-t border-foreground/5">
                      <div className="flex justify-between items-end mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{cs.title}</h3>
                          <p className="text-xs text-muted-foreground font-mono uppercase tracking-wide">{cs.subtitle}</p>
                        </div>
                        {cs.metrics && cs.metrics[0] && (
                          <div className="text-right">
                            <span className="block text-3xl font-black text-foreground" style={{ textShadow: "0 0 20px rgba(16,185,129,0.4)" }}>{cs.metrics[0].value}</span>
                            <span className="text-[9px] text-muted-foreground font-mono uppercase">{cs.metrics[0].label}</span>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-6 border-t border-foreground/10 pt-4">
                        <div>
                          <span className="text-[9px] text-muted-foreground font-mono uppercase block mb-1">Stack</span>
                          <span className="text-xs text-foreground">{(cs.tech_stack || []).slice(0, 3).join(", ")}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-muted-foreground font-mono uppercase block mb-1">Impact</span>
                          <span className="text-xs text-foreground">{cs.metrics?.[1]?.value || "N/A"} {cs.metrics?.[1]?.label || ""}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between w-full bg-surface-light border border-border hover:border-primary/50 text-foreground text-xs font-mono font-bold uppercase py-3 px-4 rounded transition-all group-hover:bg-primary/10 group-hover:text-primary">
                        <span>View_Mission_Debrief</span>
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>

                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary/50 group-hover:border-primary transition-colors" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary/50 group-hover:border-primary transition-colors" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary/50 group-hover:border-primary transition-colors" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary/50 group-hover:border-primary transition-colors" />
                </Link>
              </ScrollReveal>
            ))}
          </div>

          {/* Empty state */}
          {!loading && (!caseStudies || caseStudies.length === 0) && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="size-16 border border-border rounded-full flex items-center justify-center mb-4">
                <Target className="size-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">No Missions Found</h3>
              <p className="text-sm text-muted-foreground font-mono">Archive is currently empty. Add case studies from the admin panel.</p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border bg-surface-dark py-8">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground font-mono">
          <div className="flex items-center gap-2">
            <span className="size-2 bg-green-500 rounded-full animate-pulse" />
            {"SYSTEM STATUS: OPTIMAL // ARCHIVE SECURE"}
          </div>
          <div className="mt-4 md:mt-0">
            {"© 2024 SAYED ELSHAZLY // MISSION CONTROL"}
          </div>
        </div>
      </footer>
    </div>
  )
}
