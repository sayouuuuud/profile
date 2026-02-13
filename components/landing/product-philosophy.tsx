"use client"

import { useEffect, useRef, useState } from "react"
import { ScrollReveal } from "@/components/scroll-reveal"

interface PhilosophyProps {
    brief?: any
}

export function ProductPhilosophy({ brief }: PhilosophyProps) {
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

    return (
        <section className="px-6 md:px-12 py-32 relative" ref={ref}>
            <ScrollReveal>
                <div className="text-center mb-16">
                    <p className="text-[11px] font-mono text-emerald-500/80 tracking-[0.3em] uppercase mb-3">
                        Decision Framework
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        How I Think
                    </h2>
                </div>
            </ScrollReveal>

            {/* Decision Tree SVG */}
            <div className="max-w-3xl mx-auto">
                <svg viewBox="0 0 700 380" className="w-full h-auto" style={{ overflow: "visible" }}>
                    {/* Problem Node */}
                    <g
                        className="transition-all duration-700"
                        style={{
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? "translateY(0)" : "translateY(-10px)",
                        }}
                    >
                        <rect x={250} y={10} width={200} height={44} rx={22} fill="#111" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                        <text x={350} y={37} textAnchor="middle" fill="#f2f2f2" fontSize={13} fontFamily="var(--font-inter)" fontWeight={600}>
                            Problem Appears
                        </text>
                    </g>

                    {/* Branch lines from problem */}
                    {/* Left branch — throw money */}
                    <path
                        d="M 300 54 Q 300 100 180 130"
                        fill="none"
                        stroke="rgba(239, 68, 68, 0.3)"
                        strokeWidth={1.5}
                        strokeDasharray={120}
                        strokeDashoffset={isVisible ? 0 : 120}
                        style={{ transition: "stroke-dashoffset 1s ease-out 0.5s" }}
                    />
                    {/* Right branch — engineer it */}
                    <path
                        d="M 400 54 Q 400 100 520 130"
                        fill="none"
                        stroke="rgba(16, 185, 129, 0.5)"
                        strokeWidth={1.5}
                        strokeDasharray={120}
                        strokeDashoffset={isVisible ? 0 : 120}
                        style={{ transition: "stroke-dashoffset 1s ease-out 0.7s" }}
                    />

                    {/* LEFT: Throw money? NO */}
                    <g
                        style={{
                            opacity: isVisible ? 1 : 0,
                            transition: "opacity 0.6s ease-out 0.8s",
                        }}
                    >
                        <rect x={80} y={125} width={200} height={44} rx={8} fill="#111" stroke="rgba(239, 68, 68, 0.2)" strokeWidth={1} />
                        <text x={180} y={148} textAnchor="middle" fill="rgba(239, 68, 68, 0.6)" fontSize={12} fontFamily="var(--font-mono)" fontWeight={500}>
                            Throw money at it?
                        </text>
                        <text x={180} y={164} textAnchor="middle" fill="rgba(239, 68, 68, 0.4)" fontSize={10} fontFamily="var(--font-mono)">
                            ✕ REJECTED
                        </text>
                        {/* Strike-through line */}
                        <line x1={100} y1={147} x2={260} y2={147} stroke="rgba(239, 68, 68, 0.25)" strokeWidth={1} />
                    </g>

                    {/* RIGHT: Engineer smarter? YES */}
                    <g
                        style={{
                            opacity: isVisible ? 1 : 0,
                            transition: "opacity 0.6s ease-out 1s",
                        }}
                    >
                        <rect x={420} y={125} width={220} height={44} rx={8} fill="#111" stroke="rgba(16, 185, 129, 0.3)" strokeWidth={1} />
                        <text x={530} y={148} textAnchor="middle" fill="#10b981" fontSize={12} fontFamily="var(--font-mono)" fontWeight={500}>
                            Engineer a smarter solution?
                        </text>
                        <text x={530} y={164} textAnchor="middle" fill="rgba(16, 185, 129, 0.6)" fontSize={10} fontFamily="var(--font-mono)">
                            ✓ ACCEPTED
                        </text>
                    </g>

                    {/* Line from YES to result */}
                    <path
                        d="M 530 169 L 530 210 Q 530 230 400 240 L 350 240"
                        fill="none"
                        stroke="rgba(16, 185, 129, 0.4)"
                        strokeWidth={1.5}
                        strokeDasharray={150}
                        strokeDashoffset={isVisible ? 0 : 150}
                        style={{ transition: "stroke-dashoffset 1.2s ease-out 1.2s" }}
                    />

                    {/* Result Node */}
                    <g
                        style={{
                            opacity: isVisible ? 1 : 0,
                            transition: "opacity 0.6s ease-out 1.4s",
                        }}
                    >
                        <rect x={200} y={220} width={300} height={50} rx={25} fill="rgba(16, 185, 129, 0.08)" stroke="rgba(16, 185, 129, 0.3)" strokeWidth={1} />
                        <text x={350} y={248} textAnchor="middle" fill="#10b981" fontSize={14} fontFamily="var(--font-inter)" fontWeight={700}>
                            Zero-cost, enterprise-grade solution
                        </text>
                        {/* Glow effect */}
                        {isVisible && (
                            <rect x={200} y={220} width={300} height={50} rx={25} fill="none" stroke="rgba(16, 185, 129, 0.15)" strokeWidth={1}>
                                <animate attributeName="stroke-opacity" values="0.15;0.4;0.15" dur="3s" repeatCount="indefinite" />
                            </rect>
                        )}
                    </g>

                    {/* Floating Principle Badges */}
                    {[
                        { label: "User-First", x: 90, y: 220 },
                        { label: "Zero-Sum Engineering", x: 90, y: 255 },
                        { label: "Outcome > Process", x: 570, y: 240 },
                    ].map((p, i) => (
                        <g
                            key={p.label}
                            style={{
                                opacity: isVisible ? 1 : 0,
                                transition: `opacity 0.5s ease-out ${1.6 + i * 0.2}s`,
                            }}
                        >
                            <rect
                                x={p.x - 5}
                                y={p.y - 12}
                                width={p.label.length * 8 + 16}
                                height={20}
                                rx={4}
                                fill="rgba(16, 185, 129, 0.06)"
                                stroke="rgba(16, 185, 129, 0.15)"
                                strokeWidth={0.5}
                            />
                            <text
                                x={p.x + 3}
                                y={p.y + 2}
                                fill="rgba(16, 185, 129, 0.6)"
                                fontSize={9}
                                fontFamily="var(--font-mono)"
                                letterSpacing={1}
                            >
                                {p.label}
                            </text>
                        </g>
                    ))}

                    {/* Quote at bottom */}
                    <g
                        style={{
                            opacity: isVisible ? 1 : 0,
                            transition: "opacity 0.6s ease-out 2s",
                        }}
                    >
                        <text x={350} y={320} textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize={20} fontStyle="italic" fontFamily="var(--font-inter)">
                            &ldquo;
                        </text>
                        <text x={350} y={340} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={13} fontStyle="italic" fontFamily="var(--font-inter)">
                            Ship to learn. Optimize to scale.
                        </text>
                        <text x={350} y={360} textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize={20} fontStyle="italic" fontFamily="var(--font-inter)">
                            &rdquo;
                        </text>
                    </g>
                </svg>
            </div>
        </section>
    )
}
