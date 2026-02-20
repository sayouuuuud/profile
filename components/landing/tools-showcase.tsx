"use client"

import Link from "next/link"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Sparkles, Activity, ArrowUpRight, FileText, Sun } from "lucide-react"

const tools = [
  {
    href: "/tools/ai-parser",
    icon: Sparkles,
    title: "AI Project Parser",
    description:
      "Add projects in seconds. Paste text, GitHub URL, or voice note - AI extracts structured data automatically.",
    tags: ["Gemini AI", "GitHub API", "Telegram Bot"],
    status: "Live",
  },
  {
    href: "/tools/scalability",
    icon: Activity,
    title: "Scalability Simulator",
    description:
      "Interactive architecture visualizer. Explore how a project scales from 1K to 1M users with real-time breakdowns.",
    tags: ["Interactive", "Architecture", "Cost Analysis"],
    status: "Live",
  },
  {
    href: "/tools/case-study-generator",
    icon: FileText,
    title: "Case Study Generator",
    description:
      "Import GitHub repo, answer targeted questions, and get a polished case study. AI-powered hybrid workflow.",
    tags: ["GitHub Import", "Interview AI", "Content Generation"],
    status: "Live",
  },
  {
    href: "/tools/morning-brief",
    icon: Sun,
    title: "Enhanced Morning Brief",
    description:
      "AI-powered daily analytics digest with insights, anomalies, opportunities, and actionable recommendations.",
    tags: ["Analytics", "AI Insights", "Smart Recommendations"],
    status: "Live",
  },
]

export function ToolsShowcase() {
  return (
    <section className="px-6 md:px-12 py-24" id="tools">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 max-w-[40px] bg-emerald/40" />
            <span className="text-xs text-emerald tracking-widest uppercase">
              Interactive Tools
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Built to demonstrate, not just describe
          </h2>
          <p className="text-muted-foreground text-base max-w-lg mb-12">
            Interactive tools that showcase product thinking and technical execution. Try them live.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4">
          {tools.map((tool, idx) => {
            const Icon = tool.icon
            return (
              <ScrollReveal key={tool.title} delay={(idx + 1) * 150}>
                <Link href={tool.href} className="block group">
                  <div className="glass-panel rounded-xl p-6 md:p-8 card-glow h-full relative overflow-hidden">
                    {/* Subtle glow on hover */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-5">
                        <div className="w-12 h-12 rounded-xl bg-emerald/10 border border-emerald/20 flex items-center justify-center group-hover:bg-emerald/15 transition-colors">
                          <Icon className="h-6 w-6 text-emerald" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1.5 text-xs text-emerald bg-emerald/10 border border-emerald/20 px-2.5 py-1 rounded-md">
                            <span className="w-1.5 h-1.5 bg-emerald rounded-full" />
                            {tool.status}
                          </span>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-border group-hover:border-emerald/30 transition-colors">
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald transition-colors" />
                          </div>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-emerald transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                        {tool.description}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                        {tool.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 text-[11px] text-muted-foreground bg-secondary rounded-md border border-border"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
