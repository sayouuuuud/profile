"use client"

import { useEffect, useRef, useState } from "react"
import { ScrollReveal } from "@/components/scroll-reveal"

interface ImpactDashboardProps {
    metrics?: any[]
}

// Architecture nodes positions (responsive via viewBox)
const NODES = [
    { id: "supabase", label: "Supabase", x: 200, y: 60, icon: "💾", desc: "Database & Auth" },
    { id: "cloudinary", label: "Cloudinary", x: 500, y: 60, icon: "🎬", desc: "Media Streaming" },
    { id: "uploadthing", label: "UploadThing", x: 500, y: 260, icon: "📦", desc: "File Storage" },
    { id: "vercel", label: "Vercel", x: 200, y: 260, icon: "▲", desc: "Compute & Edge" },
]

const CONNECTIONS = [
    { from: "supabase", to: "cloudinary", path: "M 260 80 L 440 80" },
    { from: "cloudinary", to: "uploadthing", path: "M 520 120 L 520 240" },
    { from: "uploadthing", to: "vercel", path: "M 440 280 L 260 280" },
    { from: "vercel", to: "supabase", path: "M 220 240 L 220 120" },
    // Cross connections
    { from: "supabase", to: "uploadthing", path: "M 260 100 Q 380 180 440 240" },
    { from: "cloudinary", to: "vercel", path: "M 440 100 Q 340 180 260 240" },
]

const METRICS = [
    { label: "Users Served", value: "1,000+", x: 350, y: 10 },
    { label: "Latency Cut", value: "98%", x: 600, y: 170 },
    { label: "Monthly Cost", value: "$0", x: 350, y: 320 },
    { label: "Media Assets", value: "150+", x: 100, y: 170 },
]

function ArchitectureNode({
    node,
    isVisible,
    delay,
}: {
    node: (typeof NODES)[0]
    isVisible: boolean
    delay: number
}) {
    return (
        <g
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "scale(1)" : "scale(0.8)",
                transformOrigin: `${node.x + 30}px ${node.y + 25}px`,
                transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
            }}
        >
            {/* Node background */}
            <rect
                x={node.x - 30}
                y={node.y - 15}
                width={120}
                height={50}
                rx={8}
                fill="#111111"
                stroke="rgba(16, 185, 129, 0.2)"
                strokeWidth={1}
            />
            {/* Icon */}
            <text
                x={node.x - 10}
                y={node.y + 15}
                textAnchor="middle"
                fontSize={16}
            >
                {node.icon}
            </text>
            {/* Label */}
            <text
                x={node.x + 30}
                y={node.y + 8}
                textAnchor="middle"
                fill="#f2f2f2"
                fontSize={11}
                fontFamily="var(--font-mono), monospace"
                fontWeight={500}
            >
                {node.label}
            </text>
            {/* Description */}
            <text
                x={node.x + 30}
                y={node.y + 24}
                textAnchor="middle"
                fill="rgba(255,255,255,0.35)"
                fontSize={9}
                fontFamily="var(--font-mono), monospace"
            >
                {node.desc}
            </text>
            {/* Pulse circle */}
            {isVisible && (
                <circle
                    cx={node.x + 30}
                    cy={node.y + 10}
                    r={30}
                    fill="none"
                    stroke="rgba(16, 185, 129, 0.15)"
                    strokeWidth={1}
                >
                    <animate
                        attributeName="r"
                        values="30;38;30"
                        dur="3s"
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="opacity"
                        values="0.4;0;0.4"
                        dur="3s"
                        repeatCount="indefinite"
                    />
                </circle>
            )}
        </g>
    )
}

function ConnectionLine({
    path,
    isVisible,
    delay,
}: {
    path: string
    isVisible: boolean
    delay: number
}) {
    const pathRef = useRef<SVGPathElement>(null)
    const [pathLength, setPathLength] = useState(500)

    useEffect(() => {
        if (pathRef.current) {
            setPathLength(pathRef.current.getTotalLength())
        }
    }, [])

    return (
        <g>
            {/* Background dim line */}
            <path
                d={path}
                fill="none"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth={1}
            />
            {/* Animated line */}
            <path
                ref={pathRef}
                d={path}
                fill="none"
                stroke="rgba(16, 185, 129, 0.3)"
                strokeWidth={1}
                strokeDasharray={pathLength}
                strokeDashoffset={isVisible ? 0 : pathLength}
                style={{
                    transition: `stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
                }}
            />
            {/* Flowing particle */}
            {isVisible && (
                <circle r={2.5} fill="#10b981">
                    <animateMotion dur="4s" repeatCount="indefinite" path={path} />
                    <animate
                        attributeName="opacity"
                        values="0;1;1;0"
                        dur="4s"
                        repeatCount="indefinite"
                    />
                </circle>
            )}
        </g>
    )
}

function MetricBadge({
    metric,
    isVisible,
    delay,
}: {
    metric: (typeof METRICS)[0]
    isVisible: boolean
    delay: number
}) {
    return (
        <g
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(8px)",
                transition: `all 0.6s ease-out ${delay}ms`,
            }}
        >
            <text
                x={metric.x}
                y={metric.y}
                textAnchor="middle"
                fill="#10b981"
                fontSize={18}
                fontWeight={800}
                fontFamily="var(--font-inter), system-ui"
            >
                {metric.value}
            </text>
            <text
                x={metric.x}
                y={metric.y + 16}
                textAnchor="middle"
                fill="rgba(255,255,255,0.4)"
                fontSize={9}
                fontFamily="var(--font-mono), monospace"
                textTransform="uppercase"
                letterSpacing={1.5}
            >
                {metric.label.toUpperCase()}
            </text>
        </g>
    )
}

export function ImpactDashboard({ metrics }: ImpactDashboardProps) {
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
        <section className="relative py-32 px-6 overflow-hidden" ref={ref}>
            {/* Section Label */}
            <ScrollReveal>
                <div className="text-center mb-16">
                    <p className="text-[11px] font-mono text-emerald-500/80 tracking-[0.3em] uppercase mb-3">
                        System Architecture
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        Measurable Impact
                    </h2>
                    <p className="text-white/40 text-sm mt-3 max-w-md mx-auto font-mono">
                        A federated zero-cost architecture serving 1,000+ users
                    </p>
                </div>
            </ScrollReveal>

            {/* Architecture Diagram */}
            <div className="max-w-3xl mx-auto">
                <svg
                    viewBox="0 0 700 350"
                    className="w-full h-auto"
                    style={{ overflow: "visible" }}
                >
                    {/* Grid background lines */}
                    {Array.from({ length: 12 }).map((_, i) => (
                        <line
                            key={`vg-${i}`}
                            x1={i * 60}
                            y1={0}
                            x2={i * 60}
                            y2={350}
                            stroke="rgba(255,255,255,0.03)"
                            strokeWidth={0.5}
                        />
                    ))}
                    {Array.from({ length: 7 }).map((_, i) => (
                        <line
                            key={`hg-${i}`}
                            x1={0}
                            y1={i * 60}
                            x2={700}
                            y2={i * 60}
                            stroke="rgba(255,255,255,0.03)"
                            strokeWidth={0.5}
                        />
                    ))}

                    {/* Center glow */}
                    <defs>
                        <radialGradient id="centerGlow" cx="50%" cy="50%" r="40%">
                            <stop offset="0%" stopColor="rgba(16, 185, 129, 0.08)" />
                            <stop offset="100%" stopColor="transparent" />
                        </radialGradient>
                    </defs>
                    <rect x={0} y={0} width={700} height={350} fill="url(#centerGlow)" />

                    {/* Connection Lines */}
                    {CONNECTIONS.map((conn, i) => (
                        <ConnectionLine
                            key={conn.from + conn.to}
                            path={conn.path}
                            isVisible={isVisible}
                            delay={600 + i * 200}
                        />
                    ))}

                    {/* Nodes */}
                    {NODES.map((node, i) => (
                        <ArchitectureNode
                            key={node.id}
                            node={node}
                            isVisible={isVisible}
                            delay={200 + i * 150}
                        />
                    ))}

                    {/* Metric Badges */}
                    {METRICS.map((metric, i) => (
                        <MetricBadge
                            key={metric.label}
                            metric={metric}
                            isVisible={isVisible}
                            delay={1200 + i * 200}
                        />
                    ))}

                    {/* Central $0/month highlight */}
                    {isVisible && (
                        <g>
                            <text
                                x={350}
                                y={175}
                                textAnchor="middle"
                                fill="#10b981"
                                fontSize={28}
                                fontWeight={900}
                                fontFamily="var(--font-inter), system-ui"
                                className="animate-glow-pulse"
                            >
                                $0/mo
                            </text>
                            <text
                                x={350}
                                y={196}
                                textAnchor="middle"
                                fill="rgba(255,255,255,0.3)"
                                fontSize={9}
                                fontFamily="var(--font-mono), monospace"
                                letterSpacing={2}
                            >
                                INFRASTRUCTURE COST
                            </text>
                        </g>
                    )}
                </svg>
            </div>

            {/* Bottom context */}
            <ScrollReveal>
                <p className="text-center text-white/30 text-xs font-mono mt-12 tracking-wide">
                    REAL-TIME DATA FLOWING BETWEEN 4 CLOUD PROVIDERS • ZERO MONTHLY COST
                </p>
            </ScrollReveal>
        </section>
    )
}
