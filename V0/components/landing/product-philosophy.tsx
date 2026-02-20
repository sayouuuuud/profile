"use client"

import { useRef, useState } from "react"
import { ScrollReveal } from "@/components/scroll-reveal"

interface Principle {
  num: string
  title: string
  description: string
}

interface ProductPhilosophyProps {
  principles?: Principle[]
  quote?: string
}

const DEFAULT_PRINCIPLES = [
  {
    num: "01",
    title: "User-First",
    description:
      "Every feature starts with a real user pain. I dig into support tickets, watch session recordings, and talk to users before writing a single spec.",
  },
  {
    num: "02",
    title: "Data-Informed",
    description:
      "I define success metrics before building, run experiments to validate assumptions, and let data guide prioritization — not opinions.",
  },
  {
    num: "03",
    title: "Outcome-Driven",
    description:
      "Features are not the product. Outcomes are. I optimize for business results — retention, revenue, satisfaction — not feature count.",
  },
  {
    num: "04",
    title: "Smart Architecture",
    description:
      "Choose the right tool for each problem. Not the newest, not the most complex — the one that scales with the business.",
  },
  {
    num: "05",
    title: "Bias for Action",
    description:
      "Ship to learn. A shipped MVP teaches more than months of planning ever could. Move fast, measure, iterate.",
  },
]

const DEFAULT_QUOTE = "“I don’t believe in building features. I believe in solving problems. Every product decision passes through one filter: does this move the needle for users and the business?”"

function PrincipleRow({
  principle,
  index,
}: {
  principle: Principle
  index: number
}) {
  const rowRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!rowRef.current) return
    const rect = rowRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div
      ref={rowRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative border-b border-border py-10 md:py-14 cursor-default overflow-hidden"
    >
      {/* Spotlight glow that follows mouse */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: isHovered
            ? `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16,185,129,0.06), transparent 40%)`
            : "none",
        }}
      />

      <div className="relative flex flex-col md:flex-row md:items-center gap-4 md:gap-0">
        {/* Number + Title */}
        <div className="flex items-baseline gap-6 md:w-2/5">
          <span className="text-sm text-muted-foreground font-mono tabular-nums tracking-tight opacity-50 group-hover:opacity-100 group-hover:text-emerald-500 transition-all duration-500">
            {principle.num}
          </span>
          <h3 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-emerald-400 transition-colors duration-500">
            {principle.title}
          </h3>
        </div>

        {/* Description */}
        <p className="md:w-3/5 text-sm md:text-base text-muted-foreground leading-relaxed md:pl-8 group-hover:text-foreground/70 transition-colors duration-500">
          {principle.description}
        </p>
      </div>
    </div>
  )
}

export function ProductPhilosophy({ principles = DEFAULT_PRINCIPLES, quote = DEFAULT_QUOTE }: ProductPhilosophyProps) {
  return (
    <section className="px-6 md:px-12 py-24 relative overflow-hidden">
      {/* Background orb */}
      <div className="gradient-orb w-[500px] h-[500px] bg-emerald-500 -top-40 right-0 opacity-[0.06]" />

      <div className="max-w-5xl mx-auto relative">
        {/* Section Header */}
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 max-w-[40px] bg-gradient-to-r from-transparent to-emerald-500/40" />
            <span className="text-xs text-emerald-500 tracking-widest uppercase font-medium">
              Product Thinking
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
            How I Think About Products
          </h2>
          <p className="text-muted-foreground max-w-2xl mb-16 leading-relaxed">
            Building great products is not about code. It is about deeply
            understanding users, making smart trade-offs, and relentlessly
            focusing on outcomes.
          </p>
        </ScrollReveal>

        {/* Principles list */}
        <div className="border-t border-border">
          {principles.map((principle, i) => (
            <ScrollReveal key={principle.num} delay={i * 80}>
              <PrincipleRow principle={principle} index={i} />
            </ScrollReveal>
          ))}
        </div>

        {/* Manifesto quote */}
        <ScrollReveal delay={500}>
          <div className="mt-16 flex items-start gap-5">
            <div className="hidden md:block w-1 h-16 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-500/0 flex-shrink-0 mt-1" />
            <blockquote className="text-lg md:text-xl text-foreground/80 font-light italic leading-relaxed">
              {quote}
            </blockquote>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
