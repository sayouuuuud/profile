"use client"

import { Award, GraduationCap } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"

interface Certificate {
  id: string
  title: string
  issuer: string | null
  issue_date: string | null
  credential_id: string | null
  category: string | null
}

interface Education {
  id: string
  degree: string
  institution: string | null
  start_year: string | null
  end_year: string | null
  description: string | null
}

export function CredentialsSection({
  certificates,
  education,
}: {
  certificates: Certificate[]
  education: Education[]
}) {
  return (
    <section className="px-6 md:px-12 py-24" id="credentials">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 max-w-[40px] bg-emerald/40" />
            <span className="text-xs text-emerald tracking-widest uppercase">Background</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-14">
            Credentials
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {/* Certifications Column */}
          <div>
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-lg bg-emerald/10 border border-emerald/20 flex items-center justify-center">
                  <Award className="h-4 w-4 text-emerald/60" />
                </div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Certifications
                </h3>
              </div>
            </ScrollReveal>

            <div className="space-y-0">
              {certificates.map((cert, i) => (
                <ScrollReveal key={cert.id} delay={(i + 1) * 80}>
                  <div className="group py-4 border-b border-border last:border-0 hover:bg-secondary/50 transition-colors px-3 -mx-3 rounded-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-foreground group-hover:text-emerald transition-colors">
                          {cert.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {cert.issuer}
                        </p>
                      </div>
                      <span className="text-[11px] text-muted-foreground/60 whitespace-nowrap mt-0.5">
                        {cert.issue_date || cert.category || ""}
                      </span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Education Column */}
          <div>
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-lg bg-emerald/10 border border-emerald/20 flex items-center justify-center">
                  <GraduationCap className="h-4 w-4 text-emerald/60" />
                </div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Education
                </h3>
              </div>
            </ScrollReveal>

            <div className="space-y-0">
              {education.map((edu, i) => (
                <ScrollReveal key={edu.id} delay={(i + 1) * 80}>
                  <div className="group py-4 border-b border-border last:border-0 hover:bg-secondary/50 transition-colors px-3 -mx-3 rounded-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-foreground group-hover:text-emerald transition-colors">
                          {edu.degree}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {edu.institution}
                        </p>
                        {edu.description && (
                          <p className="text-xs text-muted-foreground/60 mt-2 leading-relaxed">
                            {edu.description}
                          </p>
                        )}
                      </div>
                      <span className="text-[11px] text-muted-foreground/60 whitespace-nowrap mt-0.5">
                        {edu.start_year}
                        {edu.end_year ? ` - ${edu.end_year}` : " - Present"}
                      </span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
