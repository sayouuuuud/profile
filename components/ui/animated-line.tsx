"use client"

import { useEffect, useRef, useState } from "react"

interface AnimatedLineProps {
    /** "vertical" draws top-to-bottom, "horizontal" draws left-to-right */
    direction?: "vertical" | "horizontal"
    /** Length of the line in pixels */
    length?: number
    /** Color of the line */
    color?: string
    /** Animation delay in ms */
    delay?: number
    /** Stroke width */
    strokeWidth?: number
    /** Extra className on the SVG */
    className?: string
}

export function AnimatedLine({
    direction = "vertical",
    length = 80,
    color = "#10b981",
    delay = 0,
    strokeWidth = 1,
    className = "",
}: AnimatedLineProps) {
    const ref = useRef<SVGSVGElement>(null)
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
            { threshold: 0.3 }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    const isVertical = direction === "vertical"
    const w = isVertical ? strokeWidth + 2 : length
    const h = isVertical ? length : strokeWidth + 2
    const x1 = isVertical ? (strokeWidth + 2) / 2 : 0
    const y1 = isVertical ? 0 : (strokeWidth + 2) / 2
    const x2 = isVertical ? (strokeWidth + 2) / 2 : length
    const y2 = isVertical ? length : (strokeWidth + 2) / 2

    return (
        <svg
            ref={ref}
            width={w}
            height={h}
            className={className}
            style={{ overflow: "visible" }}
        >
            <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={length}
                strokeDashoffset={isVisible ? 0 : length}
                style={{
                    transition: `stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
                }}
            />
        </svg>
    )
}
