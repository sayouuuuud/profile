import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/contact-footer"
import { ScrollReveal } from "@/components/scroll-reveal"
import Link from "next/link"
import { ArrowRight, Briefcase } from "lucide-react"

async function getCaseStudies() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("case_studies")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order")
    if (error) return []
    return data || []
  } catch {
    return []
  }
}

export const metadata = {
  title: "Case Studies | Sayed Elshazly",
  description: "Real product challenges, real outcomes. Explore how I approach complex problems and deliver measurable impact.",
}

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies()

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
        {/* Hero */}
        <section className="px-6 md:px-12 pt-20 pb-16 max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-primary/40" />
              <span className="text-xs text-primary tracking-widest uppercase">Case Studies</span>
              <div className="h-px w-10 bg-primary/40" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance mb-4">
              Real Challenges,{" "}
              <span className="text-primary">Real Outcomes</span>
            </h1>
            <p className="text-muted-foreground max-w-xl text-base md:text-lg leading-relaxed">
              Each project is a story of identifying problems, making strategic decisions, and delivering measurable impact.
            </p>
            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                <span>
                  <span className="text-foreground font-semibold">{caseStudies.length}</span> projects
                </span>
              </div>
            </div>
          </ScrollReveal>
        </section>

        <div className="hr-divider" aria-hidden="true" />

        {/* Cards Grid */}
        <section className="px-6 md:px-12 py-16 max-w-6xl mx-auto">
          {caseStudies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {caseStudies.map((cs: any, idx: number) => (
                <ScrollReveal key={cs.id} delay={idx * 100}>
                  <Link
                    href={`/case-studies/${cs.slug}`}
                    className="group relative flex flex-col h-full rounded-xl glass-panel card-glow overflow-hidden"
                  >
                    {/* Thumbnail */}
                    {cs.thumbnail_url && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={cs.thumbnail_url}
                          alt={cs.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-40"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
                      </div>
                    )}

                    <div className="flex flex-col flex-1 p-6">
                      {/* Top tags */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[11px] text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-md">
                          {cs.category}
                        </span>
                        {cs.duration && (
                          <span className="text-[11px] text-muted-foreground bg-secondary border border-border px-2.5 py-1 rounded-md">
                            {cs.duration}
                          </span>
                        )}
                      </div>

                      {/* Title + subtitle */}
                      <h3 className="text-xl font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {cs.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                        {cs.subtitle}
                      </p>

                      {/* Metrics row */}
                      {cs.metrics && cs.metrics.length > 0 && (
                        <div className="flex gap-6 mb-6 pt-4 border-t border-border">
                          {cs.metrics.slice(0, 3).map((m: any, i: number) => (
                            <div key={i}>
                              <span className="block text-lg font-bold text-foreground">{m.value}</span>
                              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{m.label}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tech stack */}
                      {cs.tech_stack && cs.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {cs.tech_stack.slice(0, 5).map((tech: string) => (
                            <span
                              key={tech}
                              className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* CTA */}
                      <div className="mt-auto flex items-center gap-2 text-sm text-primary font-medium group-hover:gap-3 transition-all">
                        <span>View Case Study</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-14 w-14 rounded-full border border-border flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Case Studies Yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Case studies will appear here once added from the admin panel.
              </p>
            </div>
          )}
        </section>
      </main>

      <div className="hr-divider" aria-hidden="true" />
      <Footer />
    </div>
  )
}
