"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Server,
  Database,
  Globe,
  Shield,
  Gauge,
  DollarSign,
  Users,
  Zap,
  AlertTriangle,
  ChevronRight,
  Activity,
  HardDrive,
  Cpu,
  Layers,
  Monitor,
  Cloud,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

export interface ScaleLevel {
  users: number
  label: string
  level: "startup" | "growth" | "scale" | "enterprise"
  color: string
  architecture: {
    app: string
    database: string
    cache: string
    cdn: string
    hosting: string
    monitoring?: string
    security?: string
  }
  cost: {
    hosting: number
    database: number
    cache: number
    cdn: number
    monitoring?: number
    security?: number
    total: number
  }
  performance: {
    responseTime: string
    uptime: string
    throughput: string
  }
  recommendations: string[]
  warning: string | null
  nodes: ArchNode[]
}

export interface ArchNode {
  id: string
  label: string
  icon: keyof typeof iconMap
  type: "primary" | "secondary" | "tertiary"
}

export const iconMap = {
  server: Server,
  database: Database,
  globe: Globe,
  shield: Shield,
  gauge: Gauge,
  zap: Zap,
  harddrive: HardDrive,
  cpu: Cpu,
  layers: Layers,
  monitor: Monitor,
  cloud: Cloud,
  activity: Activity,
} as const

export const defaultScaleLevels: ScaleLevel[] = [
  {
    users: 1000,
    label: "1K",
    level: "startup",
    color: "rgb(16, 185, 129)",
    architecture: {
      app: "Next.js Monolith",
      database: "PostgreSQL (Single)",
      cache: "None",
      cdn: "Vercel CDN",
      hosting: "Vercel Hobby",
    },
    cost: { hosting: 0, database: 5, cache: 0, cdn: 0, total: 5 },
    performance: { responseTime: "200ms", uptime: "99%", throughput: "100 req/s" },
    recommendations: [
      "Perfect for MVP and validation",
      "Easy to deploy and maintain",
      "Low operational overhead",
    ],
    warning: null,
    nodes: [
      { id: "app", label: "Next.js App", icon: "server", type: "primary" },
      { id: "db", label: "PostgreSQL", icon: "database", type: "secondary" },
      { id: "cdn", label: "Vercel CDN", icon: "globe", type: "tertiary" },
    ],
  },
  {
    users: 10000,
    label: "10K",
    level: "growth",
    color: "rgb(234, 179, 8)",
    architecture: {
      app: "Next.js + API Routes",
      database: "PostgreSQL + Read Replicas",
      cache: "Redis (Upstash)",
      cdn: "Cloudflare",
      hosting: "Vercel Pro",
    },
    cost: { hosting: 20, database: 25, cache: 10, cdn: 20, total: 75 },
    performance: { responseTime: "100ms", uptime: "99.5%", throughput: "500 req/s" },
    recommendations: [
      "Add caching layer for frequent queries",
      "Use CDN for static assets globally",
      "Consider database read replicas",
    ],
    warning: "Database becomes bottleneck without optimization",
    nodes: [
      { id: "app", label: "Next.js + APIs", icon: "server", type: "primary" },
      { id: "cache", label: "Redis Cache", icon: "zap", type: "secondary" },
      { id: "db", label: "PostgreSQL + Replicas", icon: "database", type: "secondary" },
      { id: "cdn", label: "Cloudflare CDN", icon: "globe", type: "tertiary" },
    ],
  },
  {
    users: 100000,
    label: "100K",
    level: "scale",
    color: "rgb(249, 115, 22)",
    architecture: {
      app: "Microservices",
      database: "PostgreSQL Cluster",
      cache: "Redis Cluster",
      cdn: "Multi-CDN",
      hosting: "AWS ECS",
      monitoring: "DataDog",
    },
    cost: { hosting: 500, database: 300, cache: 100, cdn: 50, monitoring: 50, total: 1000 },
    performance: { responseTime: "50ms", uptime: "99.9%", throughput: "5,000 req/s" },
    recommendations: [
      "Split into microservices architecture",
      "Implement API Gateway pattern",
      "Add comprehensive monitoring & alerting",
    ],
    warning: "Single server cannot handle this load",
    nodes: [
      { id: "lb", label: "Load Balancer", icon: "layers", type: "primary" },
      { id: "svc1", label: "Service A", icon: "cpu", type: "secondary" },
      { id: "svc2", label: "Service B", icon: "cpu", type: "secondary" },
      { id: "cache", label: "Redis Cluster", icon: "zap", type: "secondary" },
      { id: "db", label: "PostgreSQL Cluster", icon: "database", type: "secondary" },
      { id: "cdn", label: "Multi-CDN", icon: "globe", type: "tertiary" },
      { id: "monitor", label: "DataDog", icon: "activity", type: "tertiary" },
    ],
  },
  {
    users: 1000000,
    label: "1M",
    level: "enterprise",
    color: "rgb(239, 68, 68)",
    architecture: {
      app: "Kubernetes Cluster",
      database: "Distributed PostgreSQL (Citus)",
      cache: "Redis Enterprise",
      cdn: "Cloudflare Enterprise",
      hosting: "Multi-Region AWS",
      monitoring: "Full Observability Stack",
      security: "WAF + DDoS Protection",
    },
    cost: {
      hosting: 2000,
      database: 1500,
      cache: 500,
      cdn: 200,
      monitoring: 300,
      security: 500,
      total: 5000,
    },
    performance: { responseTime: "20ms", uptime: "99.99%", throughput: "50,000 req/s" },
    recommendations: [
      "Multi-region deployment required",
      "Auto-scaling policies for traffic spikes",
      "Advanced security measures & WAF",
      "Dedicated DevOps / SRE team",
    ],
    warning: "Requires significant operational expertise",
    nodes: [
      { id: "waf", label: "WAF / DDoS", icon: "shield", type: "tertiary" },
      { id: "lb", label: "Global Load Balancer", icon: "layers", type: "primary" },
      { id: "k8s1", label: "K8s Region A", icon: "cloud", type: "secondary" },
      { id: "k8s2", label: "K8s Region B", icon: "cloud", type: "secondary" },
      { id: "cache", label: "Redis Enterprise", icon: "zap", type: "secondary" },
      { id: "db", label: "Citus Distributed", icon: "database", type: "secondary" },
      { id: "cdn", label: "CF Enterprise", icon: "globe", type: "tertiary" },
      { id: "obs", label: "Observability", icon: "monitor", type: "tertiary" },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Animated number                                                    */
/* ------------------------------------------------------------------ */
function AnimatedCost({ value }: { value: number }) {
  const [display, setDisplay] = useState(value)
  const prev = useRef(value)

  useEffect(() => {
    const from = prev.current
    const to = value
    const diff = to - from
    const startTime = performance.now()
    const duration = 800

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(from + diff * eased))
      if (progress < 1) requestAnimationFrame(tick)
      else prev.current = to
    }

    requestAnimationFrame(tick)
  }, [value])

  return <>${display.toLocaleString()}</>
}

/* ------------------------------------------------------------------ */
/*  Architecture diagram                                               */
/* ------------------------------------------------------------------ */
function ArchDiagram({ nodes, color }: { nodes: ArchNode[]; color: string }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-4">
      <AnimatePresence mode="popLayout">
        {nodes.map((node, i) => {
          const Icon = iconMap[node.icon]
          return (
            <motion.div
              key={node.id}
              layout
              initial={{ opacity: 0, scale: 0.7, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: -10 }}
              transition={{
                delay: i * 0.06,
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
              className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300 ${node.type === "primary"
                ? "bg-emerald/10 border-emerald/30 min-w-[100px]"
                : node.type === "secondary"
                  ? "bg-secondary/80 border-border min-w-[90px]"
                  : "bg-muted/30 border-border/50 min-w-[80px]"
                }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${node.type === "primary"
                  ? "bg-emerald/20 text-emerald"
                  : node.type === "secondary"
                    ? "bg-muted text-muted-foreground"
                    : "bg-muted/50 text-muted-foreground/60"
                  }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span
                className={`text-[10px] font-medium text-center leading-tight ${node.type === "primary" ? "text-foreground" : "text-muted-foreground"
                  }`}
              >
                {node.label}
              </span>
              {node.type === "primary" && (
                <motion.div
                  className="absolute -inset-px rounded-xl"
                  style={{ border: `1px solid ${color}`, opacity: 0.3 }}
                  animate={{ opacity: [0.15, 0.4, 0.15] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Cost breakdown bar                                                 */
/* ------------------------------------------------------------------ */
function CostBreakdown({ cost }: { cost: ScaleLevel["cost"] }) {
  const entries = Object.entries(cost).filter(([k]) => k !== "total")
  const total = cost.total || 1

  return (
    <div className="space-y-2">
      {entries.map(([key, val]) => {
        const pct = (val / total) * 100
        return (
          <div key={key} className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground w-20 text-right shrink-0">
              {key}
            </span>
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-emerald/60 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
            <span className="text-xs text-muted-foreground w-14 text-right font-mono">
              ${val}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Simulator                                                     */
/* ------------------------------------------------------------------ */

interface ScalabilitySimulatorProps {
  levels?: ScaleLevel[]
  projectId?: string
}

export function ScalabilitySimulator({ levels = defaultScaleLevels, projectId }: ScalabilitySimulatorProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  // Ensure we don't crash if levels is empty or malformed
  const safeLevels = Array.isArray(levels) && levels.length > 0 ? levels : defaultScaleLevels
  // Fix OOB index if the provided levels array is smaller than the active index
  const safeIndex = activeIndex >= safeLevels.length ? Math.max(0, safeLevels.length - 1) : activeIndex
  const current = safeLevels[safeIndex]

  // Reset active index when levels array changes size
  useEffect(() => {
    if (activeIndex >= safeLevels.length) {
      setActiveIndex(Math.max(0, safeLevels.length - 1))
    }
  }, [safeLevels.length, activeIndex])

  if (!current) return null

  return (
    <div className="w-full">
      {/* Scale slider */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald/60" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Target Users
            </span>
          </div>
          <motion.span
            key={current.label}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-bold text-foreground font-mono"
          >
            {(current.users || 0).toLocaleString()} users
          </motion.span>
        </div>

        <div className="relative w-full mt-4 pb-14 px-0">
          {/* Universal Track Wrapper perfectly aligned between the dot centers (left 16px to right 16px) */}
          <div className="absolute top-[15px] left-4 right-4 h-2 bg-muted/50 rounded-full overflow-hidden">
            {/* Active Track */}
            <motion.div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{ backgroundColor: current.color || "rgb(16, 185, 129)" }}
              animate={{ width: safeLevels.length > 1 ? `${(safeIndex / (safeLevels.length - 1)) * 100}%` : '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>

          {/* Stepper Dots & Labels */}
          <div className="relative flex justify-between z-10 items-center w-full">
            {safeLevels.map((level, i) => {
              const isActive = i === safeIndex
              const isPast = i < safeIndex

              const dotColor = current.color || "rgb(16, 185, 129)"

              return (
                <div key={`${i}-${level.label}`} className="flex flex-col items-center relative">
                  <button
                    onClick={() => setActiveIndex(i)}
                    className="w-8 h-8 flex items-center justify-center group outline-none cursor-pointer bg-background rounded-full"
                    aria-label={`Set scale to ${level.label} users`}
                  >
                    <motion.div
                      className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${!isActive && !isPast ? "border-muted-foreground/30 bg-background" : ""}`}
                      style={
                        isActive ? { borderColor: dotColor, backgroundColor: dotColor, transform: "scale(1.2)" } :
                          isPast ? { borderColor: dotColor, backgroundColor: "background" } : {}
                      }
                      whileHover={{ scale: 1.4 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  </button>

                  <div className="absolute top-9 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none w-24">
                    <span
                      className={`text-[11px] font-mono whitespace-nowrap transition-colors ${isActive ? "text-foreground font-bold" : "text-muted-foreground"
                        }`}
                    >
                      {level.label}
                    </span>
                    <span
                      style={{ color: isActive ? dotColor : undefined }}
                      className={`text-[9.5px] font-mono uppercase tracking-wider whitespace-nowrap transition-colors mt-0.5 ${!isActive ? "text-muted-foreground/40" : "font-semibold"
                        }`}
                    >
                      {level.level}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-5 gap-4">
        {/* Architecture diagram - spans 3 cols */}
        <div className="lg:col-span-3 glass-panel rounded-xl p-6 card-glow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald/60" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Architecture
              </span>
            </div>
            <motion.div
              key={current.level}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1.5"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: current.color || "rgb(16, 185, 129)" }}
              />
              <span className="text-xs font-medium capitalize text-foreground">
                {current.level}
              </span>
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.level}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArchDiagram nodes={current.nodes || []} color={current.color || "rgb(16, 185, 129)"} />
            </motion.div>
          </AnimatePresence>

          {/* Arch details */}
          <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 gap-3">
            {Object.entries(current.architecture || {}).map(([key, val]) => (
              <div key={key} className="flex items-start gap-2">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 w-16 shrink-0 pt-0.5">
                  {key}
                </span>
                <span className="text-xs text-foreground">{val as string}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar - spans 2 cols */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Cost card */}
          <div className="glass-panel rounded-xl p-6 card-glow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald/60" />
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  Monthly Cost
                </span>
              </div>
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold text-foreground font-mono">
                <AnimatedCost value={current.cost?.total || 0} />
              </span>
              <span className="text-sm text-muted-foreground">/mo</span>
            </div>
            <CostBreakdown cost={current.cost || { hosting: 0, database: 0, cache: 0, cdn: 0, total: 0 }} />
          </div>

          {/* Performance card */}
          <div className="glass-panel rounded-xl p-6 card-glow">
            <div className="flex items-center gap-2 mb-4">
              <Gauge className="h-4 w-4 text-emerald/60" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Performance
              </span>
            </div>
            <div className="space-y-3">
              {Object.entries(current.performance || {}).map(([key, val]) => (
                <motion.div
                  key={`${current.level}-${key}`}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between"
                >
                  <span className="text-xs text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span className="text-sm font-mono font-medium text-foreground">{val as string}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations + Warning */}
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        {/* Recommendations */}
        <div className="glass-panel rounded-xl p-6 card-glow">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-4 w-4 text-emerald/60" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Recommendations
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.ul
              key={current.level}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2.5"
            >
              {(current.recommendations || []).map((rec, i) => (
                <motion.li
                  key={`${i}-${rec}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-2.5"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-emerald mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground leading-relaxed">{rec}</span>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>

        {/* Warning / Info */}
        <div className="glass-panel rounded-xl p-6 card-glow flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            {current.warning ? (
              <AlertTriangle className="h-4 w-4 text-amber-500/80" />
            ) : (
              <Activity className="h-4 w-4 text-emerald/60" />
            )}
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              {current.warning ? "Warning" : "Status"}
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={current.level}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex-1 flex items-start"
            >
              {current.warning ? (
                <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 w-full">
                  <p className="text-sm text-amber-200/80 leading-relaxed">
                    {current.warning}
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-emerald/5 border border-emerald/20 w-full">
                  <p className="text-sm text-emerald/80 leading-relaxed">
                    All systems nominal. This architecture is well-suited for your current user base.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
