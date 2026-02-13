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
        <section className="px-6 md:px-12 py-32" id="credentials">
            <ScrollReveal>
                <div className="text-center mb-16">
                    <p className="text-[11px] font-mono text-emerald-500/80 tracking-[0.3em] uppercase mb-3">
                        Background
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        Credentials
                    </h2>
                </div>
            </ScrollReveal>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
                {/* Certifications Column */}
                <div>
                    <ScrollReveal>
                        <div className="flex items-center gap-3 mb-8">
                            <Award className="h-4 w-4 text-emerald-500/60" />
                            <h3 className="text-sm font-mono text-white/50 uppercase tracking-widest">
                                Certifications
                            </h3>
                        </div>
                    </ScrollReveal>

                    <div className="space-y-0">
                        {certificates.map((cert, i) => (
                            <ScrollReveal key={cert.id} delay={(i + 1) * 100}>
                                <div className="group py-4 border-b border-white/[0.06] last:border-0 hover:bg-white/[0.02] transition-colors px-2 -mx-2 rounded">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                                                {cert.title}
                                            </h4>
                                            <p className="text-xs font-mono text-white/30 mt-1">
                                                {cert.issuer}
                                            </p>
                                        </div>
                                        <span className="text-[10px] font-mono text-white/20 whitespace-nowrap mt-0.5">
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
                        <div className="flex items-center gap-3 mb-8">
                            <GraduationCap className="h-4 w-4 text-emerald-500/60" />
                            <h3 className="text-sm font-mono text-white/50 uppercase tracking-widest">
                                Education
                            </h3>
                        </div>
                    </ScrollReveal>

                    <div className="space-y-0">
                        {education.map((edu, i) => (
                            <ScrollReveal key={edu.id} delay={(i + 1) * 100}>
                                <div className="group py-4 border-b border-white/[0.06] last:border-0 hover:bg-white/[0.02] transition-colors px-2 -mx-2 rounded">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                                                {edu.degree}
                                            </h4>
                                            <p className="text-xs font-mono text-white/30 mt-1">
                                                {edu.institution}
                                            </p>
                                            {edu.description && (
                                                <p className="text-xs text-white/20 mt-2 leading-relaxed">
                                                    {edu.description}
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-[10px] font-mono text-white/20 whitespace-nowrap mt-0.5">
                                            {edu.start_year}
                                            {edu.end_year ? ` — ${edu.end_year}` : " — Present"}
                                        </span>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
