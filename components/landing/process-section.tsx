"use client"

import { useEffect, useRef, useState } from "react"
import { ScrollReveal } from "@/components/scroll-reveal"

const PROCESS_STEPS = [
    {
        id: "discover",
        label: "Discover",
        num: "01",
        branches: ["User Research", "Pain Points"],
    },
    {
        id: "define",
        label: "Define",
        num: "02",
        branches: ["PRDs", "Prioritization"],
    },
    {
        id: "deliver",
        label: "Deliver",
        num: "03",
        branches: ["Sprint Execution", "Code Review"],
    },
    {
        id: "measure",
        label: "Measure",
        num: "04",
        branches: ["Success Metrics", "Feedback Loop"],
    },
]

export function ProcessSection() {
    const ref = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [activeNode, setActiveNode] = useState(-1)

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
            { threshold: 0.3 }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    // Sequentially light up nodes
    useEffect(() => {
        if (!isVisible) return
        let i = 0
        const interval = setInterval(() => {
            if (i < PROCESS_STEPS.length) {
                setActiveNode(i)
                i++
            } else {
                clearInterval(interval)
            }
        }, 600)
        return () => clearInterval(interval)
    }, [isVisible])

    const nodeSpacing = 160
    const startX = 70
    const mainY = 80
    const svgWidth = startX * 2 + nodeSpacing * 3
    const svgHeight = 220

    return (
        <section className="px-6 md:px-12 py-32 relative" ref={ref}>
            <ScrollReveal>
                <div className="text-center mb-16">
                    <p className="text-[11px] font-mono text-emerald-500/80 tracking-[0.3em] uppercase mb-3">
                        Workflow
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        How I Work
                    </h2>
                </div>
            </ScrollReveal>

            <div className="max-w-3xl mx-auto overflow-x-auto">
                <svg
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    className="w-full h-auto min-w-[500px]"
                    style={{ overflow: "visible" }}
                >
                    {/* Main horizontal line */}
                    <line
                        x1={startX}
                        y1={mainY}
                        x2={startX + nodeSpacing * 3}
                        y2={mainY}
                        stroke="rgba(16, 185, 129, 0.15)"
                        strokeWidth={1.5}
                        strokeDasharray={nodeSpacing * 3}
                        strokeDashoffset={isVisible ? 0 : nodeSpacing * 3}
                        style={{ transition: "stroke-dashoffset 1.5s ease-out 0.3s" }}
                    />

                    {/* Active progress line */}
                    <line
                        x1={startX}
                        y1={mainY}
                        x2={startX + (activeNode >= 0 ? nodeSpacing * Math.min(activeNode, 3) : 0)}
                        y2={mainY}
                        stroke="#10b981"
                        strokeWidth={2}
                        style={{ transition: "x2 0.5s ease-out" }}
                    />

                    {/* Nodes */}
                    {PROCESS_STEPS.map((step, idx) => {
                        const x = startX + idx * nodeSpacing
                        const isActive = idx <= activeNode
                        const isCurrent = idx === activeNode

                        return (
                            <g key={step.id}>
                                {/* Node circle */}
                                <circle
                                    cx={x}
                                    cy={mainY}
                                    r={isActive ? 16 : 14}
                                    fill={isActive ? "rgba(16, 185, 129, 0.15)" : "#111"}
                                    stroke={isActive ? "#10b981" : "rgba(255,255,255,0.1)"}
                                    strokeWidth={isActive ? 2 : 1}
                                    style={{ transition: "all 0.4s ease-out" }}
                                />

                                {/* Pulse on current */}
                                {isCurrent && (
                                    <circle cx={x} cy={mainY} r={16} fill="none" stroke="#10b981" strokeWidth={1}>
                                        <animate attributeName="r" values="16;24;16" dur="2s" repeatCount="indefinite" />
                                        <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
                                    </circle>
                                )}

                                {/* Step number */}
                                <text
                                    x={x}
                                    y={mainY + 4}
                                    textAnchor="middle"
                                    fill={isActive ? "#10b981" : "rgba(255,255,255,0.3)"}
                                    fontSize={10}
                                    fontFamily="var(--font-mono)"
                                    fontWeight={700}
                                    style={{ transition: "fill 0.3s" }}
                                >
                                    {step.num}
                                </text>

                                {/* Step label above */}
                                <text
                                    x={x}
                                    y={mainY - 26}
                                    textAnchor="middle"
                                    fill={isActive ? "#f2f2f2" : "rgba(255,255,255,0.3)"}
                                    fontSize={12}
                                    fontFamily="var(--font-inter)"
                                    fontWeight={600}
                                    style={{ transition: "fill 0.3s" }}
                                >
                                    {step.label}
                                </text>

                                {/* Branches downward */}
                                {step.branches.map((branch, bi) => {
                                    const bx = x + (bi === 0 ? -35 : 35)
                                    const by = mainY + 55 + bi * 28

                                    return (
                                        <g key={branch}>
                                            {/* Branch line */}
                                            <path
                                                d={`M ${x} ${mainY + 16} Q ${x} ${by - 10} ${bx} ${by - 8}`}
                                                fill="none"
                                                stroke={isActive ? "rgba(16, 185, 129, 0.2)" : "rgba(255,255,255,0.05)"}
                                                strokeWidth={1}
                                                strokeDasharray={60}
                                                strokeDashoffset={isActive ? 0 : 60}
                                                style={{ transition: "all 0.6s ease-out" }}
                                            />
                                            {/* Branch label */}
                                            <text
                                                x={bx}
                                                y={by + 4}
                                                textAnchor="middle"
                                                fill={isActive ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.15)"}
                                                fontSize={9}
                                                fontFamily="var(--font-mono)"
                                                style={{ transition: "fill 0.3s" }}
                                            >
                                                {branch}
                                            </text>
                                        </g>
                                    )
                                })}
                            </g>
                        )
                    })}

                    {/* Arrow at end */}
                    <polygon
                        points={`${startX + nodeSpacing * 3 + 10},${mainY - 5} ${startX + nodeSpacing * 3 + 20},${mainY} ${startX + nodeSpacing * 3 + 10},${mainY + 5}`}
                        fill={activeNode >= 3 ? "#10b981" : "rgba(255,255,255,0.1)"}
                        style={{ transition: "fill 0.3s" }}
                    />
                </svg>
            </div>
        </section>
    )
}
