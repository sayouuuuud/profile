"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  Github,
  MessageSquare,
  Mic,
  ArrowRight,
  Check,
  AlertCircle,
  Code2,
  Gauge,
  ChevronRight,
  Terminal,
  Zap,
  Copy,
  RotateCcw,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Mock data & types                                                  */
/* ------------------------------------------------------------------ */

interface ParsedProject {
  title: string
  description: string
  technologies: string[]
  kpis: Record<string, number | string>
  github_url?: string
  confidence: number
}

const MOCK_RESULTS: Record<string, ParsedProject> = {
  text: {
    title: "TaskMaster Pro",
    description:
      "A full-stack task management platform with real-time collaboration, built using React and Firebase with advanced role-based access control.",
    technologies: ["React", "Firebase", "TypeScript", "Tailwind CSS", "Framer Motion"],
    kpis: { users: "12,400", tasks_completed: "1.2M", uptime: "99.9%" },
    github_url: "https://github.com/sayouuuuud/taskmaster-pro",
    confidence: 92,
  },
  github: {
    title: "FoodDelivery App",
    description:
      "Cross-platform food delivery application with real-time order tracking, payment integration, and restaurant management dashboard.",
    technologies: ["Flutter", "Firebase", "Node.js", "Stripe", "Google Maps API"],
    kpis: { downloads: "10,000+", active_users: "5,200", restaurants: 48 },
    github_url: "https://github.com/sayouuuuud/food-delivery",
    confidence: 87,
  },
  voice: {
    title: "E-Commerce Analytics",
    description:
      "AI-powered analytics dashboard for e-commerce businesses, providing real-time insights, predictive forecasting, and customer segmentation.",
    technologies: ["Next.js", "PostgreSQL", "Python", "TensorFlow", "Redis"],
    kpis: { revenue_tracked: "$2.4M", predictions_accuracy: "94%", merchants: 120 },
    confidence: 78,
  },
}

const PARSING_STEPS = [
  { label: "Analyzing input source", icon: Terminal },
  { label: "Extracting project metadata", icon: Code2 },
  { label: "Identifying tech stack", icon: Zap },
  { label: "Computing confidence score", icon: Gauge },
]

type InputSource = "text" | "github" | "voice"

/* ------------------------------------------------------------------ */
/*  Animated counter                                                   */
/* ------------------------------------------------------------------ */
function AnimatedNumber({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<number>(0)

  useEffect(() => {
    const start = ref.current
    const diff = value - start
    const startTime = performance.now()

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(start + diff * eased)
      setDisplay(current)
      if (progress < 1) requestAnimationFrame(tick)
      else ref.current = value
    }

    requestAnimationFrame(tick)
  }, [value, duration])

  return <>{display}</>
}

/* ------------------------------------------------------------------ */
/*  Confidence ring                                                    */
/* ------------------------------------------------------------------ */
function ConfidenceRing({ value }: { value: number }) {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  const color =
    value >= 85 ? "rgb(16, 185, 129)" : value >= 70 ? "rgb(234, 179, 8)" : "rgb(239, 68, 68)"

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="100" height="100" className="-rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="hsl(0 0% 12%)"
          strokeWidth="6"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-foreground">
          <AnimatedNumber value={value} />
          <span className="text-sm">%</span>
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export function ParserDemo() {
  const [source, setSource] = useState<InputSource>("text")
  const [inputValue, setInputValue] = useState("")
  const [isParsing, setIsParsing] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)
  const [result, setResult] = useState<ParsedProject | null>(null)
  const [copied, setCopied] = useState(false)

  const placeholders: Record<InputSource, string> = {
    text: "e.g. Built a task management app using React and Firebase with 12k users...",
    github: "e.g. https://github.com/username/awesome-project",
    voice: "Click to simulate a voice transcription...",
  }

  const handleParse = useCallback(async () => {
    if (isParsing || !inputValue.trim()) return
    setResult(null)
    setIsParsing(true)
    setCurrentStep(0)

    try {
      // Animate through parsing steps while API processes
      const parsePromise = (async () => {
        const response = await fetch('/api/ai/parse-project', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: inputValue,
            source,
          }),
        })

        if (!response.ok) {
          throw new Error(`Parse error: ${response.statusText}`)
        }

        const data = await response.json() as any
        return data.data || MOCK_RESULTS[source]
      })()

      // Animate steps while waiting for API
      for (let i = 0; i < PARSING_STEPS.length; i++) {
        setCurrentStep(i)
        await new Promise((r) => setTimeout(r, 700 + Math.random() * 400))
      }

      // Get API result
      const apiResult = await parsePromise
      await new Promise((r) => setTimeout(r, 300))
      setResult(apiResult)
    } catch (error) {
      console.error('[Parser] Error:', error)
      // Fallback to mock data on API error
      setResult(MOCK_RESULTS[source])
    } finally {
      setIsParsing(false)
      setCurrentStep(-1)
    }
  }, [source, isParsing, inputValue])

  const handleReset = () => {
    setResult(null)
    setInputValue("")
    setCurrentStep(-1)
    setIsParsing(false)
  }

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const sourceButtons: { key: InputSource; label: string; icon: typeof Sparkles }[] = [
    { key: "text", label: "Text", icon: MessageSquare },
    { key: "github", label: "GitHub", icon: Github },
    { key: "voice", label: "Voice", icon: Mic },
  ]

  return (
    <div className="w-full">
      {/* Source selector */}
      <div className="flex items-center gap-2 mb-6">
        {sourceButtons.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => {
              setSource(key)
              setResult(null)
              setInputValue("")
            }}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              source === key
                ? "text-emerald bg-emerald/10 border border-emerald/30"
                : "text-muted-foreground border border-border hover:border-emerald/20 hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
            {source === key && (
              <motion.div
                layoutId="parser-source-indicator"
                className="absolute inset-0 rounded-lg border border-emerald/30 bg-emerald/5"
                style={{ zIndex: -1 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="glass-panel rounded-xl p-1 mb-6">
        <div className="flex items-start gap-3 p-4">
          <div className="flex-shrink-0 mt-1">
            <div className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholders[source]}
              rows={3}
              className="w-full bg-transparent text-foreground text-sm placeholder:text-muted-foreground/50 resize-none outline-none leading-relaxed"
              disabled={isParsing}
            />
          </div>
        </div>
        <div className="flex items-center justify-between px-4 pb-3 pt-1 border-t border-border/50">
          <span className="text-xs text-muted-foreground">
            {source === "github" ? "Paste a GitHub repository URL" : source === "voice" ? "Simulated voice input" : "Describe your project in natural language"}
          </span>
          <button
            onClick={handleParse}
            disabled={isParsing}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald hover:bg-emerald-dim disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-background text-sm font-medium"
          >
            {isParsing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-4 w-4" />
                </motion.div>
                Parsing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Parse Project
              </>
            )}
          </button>
        </div>
      </div>

      {/* Parsing animation */}
      <AnimatePresence mode="wait">
        {isParsing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-panel rounded-xl p-6 mb-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Terminal className="h-4 w-4 text-emerald" />
              <span className="text-sm font-medium text-foreground">AI Processing Pipeline</span>
            </div>
            <div className="space-y-3">
              {PARSING_STEPS.map((step, i) => {
                const StepIcon = step.icon
                const isActive = i === currentStep
                const isDone = i < currentStep

                return (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-emerald/10 border border-emerald/20"
                        : isDone
                          ? "bg-emerald/5 border border-transparent"
                          : "border border-transparent opacity-40"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center ${
                        isDone
                          ? "bg-emerald/20 text-emerald"
                          : isActive
                            ? "bg-emerald/15 text-emerald"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isDone ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : isActive ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <StepIcon className="h-3.5 w-3.5" />
                        </motion.div>
                      ) : (
                        <StepIcon className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        isActive
                          ? "text-emerald font-medium"
                          : isDone
                            ? "text-foreground"
                            : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                    {isActive && (
                      <div className="ml-auto flex gap-1">
                        {[0, 1, 2].map((d) => (
                          <motion.div
                            key={d}
                            className="w-1 h-1 rounded-full bg-emerald"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: d * 0.2 }}
                          />
                        ))}
                      </div>
                    )}
                    {isDone && (
                      <span className="ml-auto text-xs text-emerald/60">Done</span>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result card */}
      <AnimatePresence mode="wait">
        {result && !isParsing && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header bar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald" />
                <span className="text-sm font-medium text-foreground">Parsed Result</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground border border-border hover:border-emerald/20 transition-all"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald" /> : <Copy className="h-3 w-3" />}
                  {copied ? "Copied" : "Copy JSON"}
                </button>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground border border-border hover:border-emerald/20 transition-all"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
              </div>
            </div>

            <div className="glass-panel rounded-xl overflow-hidden">
              {/* Project header */}
              <div className="p-6 border-b border-border/50">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <motion.h3
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-xl font-bold text-foreground mb-2"
                    >
                      {result.title}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-sm text-muted-foreground leading-relaxed"
                    >
                      {result.description}
                    </motion.p>
                    {result.github_url && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center gap-2 mt-3"
                      >
                        <Github className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs text-emerald/80 font-mono">
                          {result.github_url}
                        </span>
                      </motion.div>
                    )}
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="flex-shrink-0"
                  >
                    <ConfidenceRing value={result.confidence} />
                    <div className="text-center mt-1">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Confidence
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Tech stack */}
              <div className="p-6 border-b border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Code2 className="h-3.5 w-3.5 text-emerald/60" />
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Tech Stack
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.technologies.map((tech, i) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      className="px-3 py-1.5 text-xs font-medium text-emerald bg-emerald/10 border border-emerald/20 rounded-md"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* KPIs */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Gauge className="h-3.5 w-3.5 text-emerald/60" />
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Key Metrics
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(result.kpis).map(([key, val], i) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.08 }}
                      className="p-3 rounded-lg bg-secondary/50 border border-border"
                    >
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                        {key.replace(/_/g, " ")}
                      </div>
                      <div className="text-lg font-bold text-foreground">{String(val)}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Action bar */}
              <div className="px-6 py-4 border-t border-border/50 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald hover:bg-emerald-dim transition-colors text-background text-sm font-medium">
                  <Check className="h-4 w-4" />
                  Approve & Publish
                </button>
                <button className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-border hover:border-emerald/30 transition-colors text-foreground text-sm font-medium">
                  Edit Details
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!result && !isParsing && (
        <div className="glass-panel rounded-xl p-8 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-xl bg-emerald/10 border border-emerald/20 flex items-center justify-center mb-4">
            <Sparkles className="h-5 w-5 text-emerald" />
          </div>
          <h4 className="text-sm font-medium text-foreground mb-1">
            Ready to parse
          </h4>
          <p className="text-xs text-muted-foreground max-w-xs">
            Enter project details above and click Parse to extract structured data using AI
          </p>
        </div>
      )}
    </div>
  )
}
