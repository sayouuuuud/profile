import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ParserDemo } from "@/components/ai-parser/parser-demo"
import { ParserFeatures } from "@/components/ai-parser/parser-features"

export const metadata: Metadata = {
  title: "AI Project Parser | Sayed Elshazly",
  description:
    "Add projects in seconds using AI. Paste text, GitHub URL, or send a voice note - the AI extracts structured data automatically.",
}

export default function AIParserPage() {
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
          <div className="max-w-5xl mx-auto flex items-center justify-between">
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
                AI Powered
              </span>
            </div>
          </div>
        </header>

        <main className="px-6 md:px-12 pb-24">
          <div className="max-w-5xl mx-auto">
            {/* Hero */}
            <section className="py-12 md:py-20">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 max-w-[40px] bg-emerald/40" />
                  <span className="text-xs text-emerald tracking-widest uppercase">
                    Project Parser
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight text-balance">
                  Add projects at the speed of thought
                </h1>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-lg">
                  Paste text, drop a GitHub URL, or send a voice note. The AI extracts
                  title, tech stack, KPIs, and more - in seconds.
                </p>
              </div>
            </section>

            <div className="hr-divider mb-12" aria-hidden="true" />

            {/* Demo section */}
            <section className="mb-20">
              <ParserDemo />
            </section>

            <div className="hr-divider mb-12" aria-hidden="true" />

            {/* Features grid */}
            <ParserFeatures />
          </div>
        </main>
      </div>
    </div>
  )
}
