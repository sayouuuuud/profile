"use client"

import React, { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"

export function FeaturedCaseStudies() {
    const [studies, setStudies] = useState<any[]>([])

    useEffect(() => {
        async function load() {
            try {
                const supabase = createClient()
                const { data } = await supabase
                    .from("case_studies")
                    .select("*")
                    .eq("is_visible", true)
                    .order("sort_order")
                    .limit(3)
                if (data) setStudies(data)
            } catch { }
        }
        load()
    }, [])

    if (studies.length === 0) return null

    return (
        <section className="px-6 md:px-12 py-32 relative" id="case-studies">
            <ScrollReveal>
                <div className="text-center mb-20">
                    <p className="text-[11px] font-mono text-emerald-500/80 tracking-[0.3em] uppercase mb-3">
                        Proven Results
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        Case Studies
                    </h2>
                    <p className="text-white/40 text-sm mt-3 max-w-md mx-auto font-mono">
                        Real transformations, not hypotheticals
                    </p>
                </div>
            </ScrollReveal>

            <div className="max-w-5xl mx-auto space-y-8">
                {studies.map((cs, idx) => (
                    <CaseStudyPipeline key={cs.id} study={cs} index={idx} />
                ))}
            </div>

            {/* View All CTA */}
            <div className="flex justify-center mt-16">
                <Link
                    href="/case-studies"
                    className="group flex items-center gap-3 px-8 py-4 border border-white/10 text-white/70 text-sm font-mono uppercase tracking-wider rounded hover:border-emerald-500/40 hover:text-emerald-400 transition-all"
                >
                    View All Case Studies
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>
        </section>
    )
}

function CaseStudyPipeline({ study, index }: { study: any; index: number }) {
    const ref = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.2 }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    // Extract before/after data from metrics if available
    const metrics = study.metrics || []
    const primaryMetric = metrics[0]

    return (
        <div ref={ref} className="relative">
            <Link
                href={`/case-studies/${study.slug}`}
                className="group block"
            >
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-0 items-stretch">
                    {/* BEFORE Panel */}
                    <div
                        className={`panel rounded-lg p-6 md:p-8 static-effect transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                            }`}
                        style={{ transitionDelay: `${index * 100}ms` }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 rounded-full bg-red-500/60" />
                            <span className="text-[10px] font-mono text-red-400/60 uppercase tracking-widest">
                                Before
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-white/60 mb-2 line-through decoration-red-500/30">
                            {study.category || "Legacy System"}
                        </h3>
                        <ul className="space-y-2 text-sm text-white/30 font-mono">
                            <li className="flex items-center gap-2">
                                <span className="text-red-500/50">✕</span> High latency
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-red-500/50">✕</span> Expensive infrastructure
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-red-500/50">✕</span> Manual processes
                            </li>
                        </ul>
                    </div>

                    {/* Pipeline Arrow */}
                    <div
                        className={`flex items-center justify-center py-4 md:py-0 md:px-6 transition-all duration-700 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
                            }`}
                        style={{ transitionDelay: `${index * 100 + 300}ms` }}
                    >
                        <svg width="80" height="40" viewBox="0 0 80 40" className="hidden md:block">
                            {/* Arrow line */}
                            <line
                                x1="0" y1="20" x2="65" y2="20"
                                stroke="#10b981"
                                strokeWidth="1.5"
                                strokeDasharray="80"
                                strokeDashoffset={isVisible ? 0 : 80}
                                style={{ transition: "stroke-dashoffset 1s ease-out 0.5s" }}
                            />
                            {/* Arrow head */}
                            <polygon
                                points="65,14 80,20 65,26"
                                fill="#10b981"
                                className={`transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
                                style={{ transitionDelay: "1s" }}
                            />
                            {/* Flowing dot */}
                            {isVisible && (
                                <circle r="3" fill="#10b981">
                                    <animate attributeName="cx" values="0;70" dur="2s" repeatCount="indefinite" />
                                    <animate attributeName="cy" values="20;20" dur="2s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" values="0;1;1;0" dur="2s" repeatCount="indefinite" />
                                </circle>
                            )}
                        </svg>
                        {/* Mobile arrow */}
                        <svg width="40" height="40" viewBox="0 0 40 40" className="md:hidden">
                            <line x1="20" y1="0" x2="20" y2="30" stroke="#10b981" strokeWidth="1.5" />
                            <polygon points="14,28 20,38 26,28" fill="#10b981" />
                        </svg>
                    </div>

                    {/* AFTER Panel */}
                    <div
                        className={`panel rounded-lg p-6 md:p-8 group-hover:glow-emerald transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                            }`}
                        style={{ transitionDelay: `${index * 100 + 200}ms` }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-node-pulse" />
                            <span className="text-[10px] font-mono text-emerald-500/80 uppercase tracking-widest">
                                After
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                            {study.title}
                        </h3>
                        <p className="text-sm text-white/50 mb-4">{study.subtitle}</p>

                        {/* Key metric */}
                        {primaryMetric && (
                            <div className="mt-auto pt-4 border-t border-white/[0.06]">
                                <span className="text-2xl font-black text-emerald-400 glow-text">
                                    {primaryMetric.value}
                                </span>
                                <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider ml-2">
                                    {primaryMetric.label}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom info bar */}
                <div
                    className={`flex items-center justify-between mt-3 px-2 transition-all duration-500 ${isVisible ? "opacity-100" : "opacity-0"
                        }`}
                    style={{ transitionDelay: `${index * 100 + 600}ms` }}
                >
                    {/* Tech stack */}
                    <div className="flex gap-2 flex-wrap">
                        {(study.tech_stack || []).slice(0, 4).map((tech: string) => (
                            <span
                                key={tech}
                                className="px-2 py-0.5 text-[10px] font-mono text-white/30 border border-white/[0.06] rounded"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>

                    {/* CTA */}
                    <span className="flex items-center gap-2 text-[11px] font-mono text-emerald-500/60 uppercase tracking-wider group-hover:text-emerald-400 group-hover:gap-3 transition-all">
                        Full Story <ArrowRight className="h-3 w-3" />
                    </span>
                </div>
            </Link>
        </div>
    )
}
