import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ScalabilitySimulator } from "@/components/scalability/scalability-simulator"
import { ScalabilityInsights } from "@/components/scalability/scalability-insights"

export const metadata: Metadata = {
  title: "Scalability Simulator | Sayed Elshazly",
  description:
    "Interactive architecture simulator. Explore how a project scales from 1K to 1M users with real-time cost, performance, and architecture breakdowns.",
}

export default function ScalabilityPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Vertical column lines */}
      <div className="vertical-lines" aria-hidden="true">
        <div className="vertical-lines-inner">
          <div />
          <div />
          <div />
        </div>
      </div>

      <div className="relative z-10">
        {/* Nav */}
        <header className="px-6 md:px-12 py-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              <span className="text-xs text-emerald/80 tracking-wider uppercase">
                Interactive
              </span>
            </div>
          </div>
        </header>

        <main className="px-6 md:px-12 pb-24">
          <div className="max-w-6xl mx-auto">
            {/* Hero */}
            <section className="py-12 md:py-20">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 max-w-[40px] bg-emerald/40" />
                  <span className="text-xs text-emerald tracking-widest uppercase">
                    Scalability Simulator
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight text-balance">
                  From startup to enterprise, visualized
                </h1>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-lg">
                  Explore how architecture, costs, and performance evolve as you scale
                  from 1,000 to 1,000,000 users. Interactive, real-time, and data-driven.
                </p>
              </div>
            </section>

            <div className="hr-divider mb-12" aria-hidden="true" />

            {/* Simulator */}
            <section className="mb-20">
              <ScalabilitySimulator />
            </section>

            <div className="hr-divider mb-12" aria-hidden="true" />

            {/* Insights section */}
            <ScalabilityInsights />
          </div>
        </main>
      </div>
    </div>
  )
}
