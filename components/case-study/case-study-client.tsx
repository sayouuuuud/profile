"use client"

import { useEffect, useRef, type ReactNode } from "react"
import Link from "next/link"
import {
  Target, X, CheckCircle, ArrowLeft, Shield, Cloud,
  Database, Network, Upload, Cpu, Lock
} from "lucide-react"

/* ---------- Scroll reveal wrapper ---------- */
function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("is-visible"); obs.unobserve(el) } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reveal-on-scroll ${delay ? `reveal-delay-${delay}` : ""} ${className}`}>
      {children}
    </div>
  )
}

/* ---------- Main component ---------- */
export function CaseStudyClient({ cs }: { cs: any }) {
  const techStack = cs.tech_stack || ["Next.js", "TypeScript", "Supabase", "Vercel"]
  const metrics = cs.metrics || []
  const challengeText = cs.challenge || ""
  const solutionText = cs.solution || ""

  // Parse challenges / solutions from DB text or use fallback
  const challenges = challengeText
    ? challengeText.split("\n").filter(Boolean).map((line: string) => {
        const [title, ...rest] = line.split(":")
        return { title: title.trim(), desc: rest.join(":").trim() }
      })
    : [
        { title: "Storage Bottlenecks", desc: "Standard CMS limit of 4MB was insufficient for 128MB+ religious manuscripts." },
        { title: "Bandwidth Costs", desc: "Streaming 1,000+ assets would incur massive hosting fees without optimization." },
        { title: "Latency Issues", desc: "Initial load times of 5s+ were unacceptable for user retention." },
      ]

  const solutions = solutionText
    ? solutionText.split("\n").filter(Boolean).map((line: string) => {
        const [title, ...rest] = line.split(":")
        return { title: title.trim(), desc: rest.join(":").trim() }
      })
    : [
        { title: "Hybrid Storage Engine", desc: "3-Tier system: UploadThing (Cache), Cloudinary (Opt), Backblaze B2 (Archive)." },
        { title: "Advanced Streaming", desc: "HLS & Range Requests reduced load time to <1s with seek-glitch-free audio." },
        { title: "AI Orchestration", desc: "Automated content metadata generation and migration tasks." },
      ]

  const archNodes = cs.architecture_nodes || [
    { title: "VERCEL EDGE", sub: "COMPUTE", color: "primary", stats: [{ l: "FUNCTIONS", v: "SERVERLESS" }, { l: "REGION", v: "GLOBAL" }] },
    { title: "SUPABASE", sub: "POSTGRES + RLS", color: "emerald", stats: [{ l: "SECURITY", v: "100% RLS" }, { l: "MIGRATIONS", v: "15 SCHEMAS" }] },
    { title: "CLOUDINARY", sub: "STREAMING", color: "indigo", stats: [{ l: "PROTOCOL", v: "HLS / RANGE" }, { l: "PERF", v: "INSTANT SEEK" }] },
    { title: "UPLOADTHING", sub: "LARGE STORAGE", color: "rose", stats: [{ l: "PDF LIMIT", v: "128MB" }, { l: "TYPE", v: "CACHE LAYER" }] },
  ]

  const nodeIcons: Record<string, ReactNode> = {
    "VERCEL EDGE": <Cloud className="size-5 text-foreground" />,
    SUPABASE: <Database className="size-5 text-emerald-500" />,
    CLOUDINARY: <Network className="size-5 text-indigo-400" />,
    UPLOADTHING: <Upload className="size-5 text-rose-400" />,
  }

  const nodeColorMap: Record<string, string> = {
    primary: "text-primary",
    emerald: "text-emerald-500",
    indigo: "text-indigo-400",
    rose: "text-rose-400",
  }

  const nodePositions = [
    "top-[10%] left-[5%] md:left-[10%] md:top-[15%]",
    "top-[10%] right-[5%] md:right-[10%] md:top-[15%]",
    "bottom-[10%] left-[5%] md:left-[10%] md:bottom-[15%]",
    "bottom-[10%] right-[5%] md:right-[10%] md:bottom-[15%]",
  ]

  return (
    <div className="min-h-screen bg-background text-foreground relative font-sans">
      {/* Grid bg */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 grid-bg bg-grid-pattern" style={{ backgroundSize: "40px 40px" }} />
      {/* Scanline */}
      <div className="fixed inset-0 z-50 pointer-events-none scanline" />

      {/* -------- HEADER -------- */}
      <header className="relative z-50 flex items-center justify-between whitespace-nowrap border-b border-border px-6 md:px-10 py-4 glass-panel sticky top-0">
        <div className="flex items-center gap-4 text-foreground">
          <div className="size-6 text-primary animate-pulse"><Target className="size-6" /></div>
          <h2 className="text-foreground text-lg font-bold leading-tight tracking-tight">{cs.title?.toUpperCase()}</h2>
          <span className="hidden md:block h-4 w-px bg-border mx-2" />
          <span className="hidden md:block text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
            {cs.category?.toUpperCase().replace(/ /g, "_")}
          </span>
        </div>
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-9">
            <a href="#overview" className="text-muted-foreground hover:text-primary transition-colors text-xs font-mono uppercase tracking-wider">Overview</a>
            <a href="#architecture" className="text-foreground text-xs font-mono uppercase tracking-wider">Architecture</a>
            <a href="#outcomes" className="text-muted-foreground hover:text-primary transition-colors text-xs font-mono uppercase tracking-wider">Outcomes</a>
          </div>
          <Link href="/case-studies" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded bg-foreground hover:bg-foreground/80 transition-colors text-background text-xs font-bold h-8 px-4 tracking-wider uppercase">
            Exit View
          </Link>
        </div>
      </header>

      {/* -------- MAIN -------- */}
      <main className="flex-1 relative flex flex-col w-full max-w-7xl mx-auto z-10 pb-20">

        {/* ===== HERO ===== */}
        <section id="overview" className="px-6 md:px-10 pt-16 pb-12 w-full">
          <div className="flex flex-col gap-2 mb-8">
            <Reveal>
              <div className="flex items-center gap-2 text-primary text-xs font-mono tracking-widest uppercase mb-2">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Product Strategy & Technical Architecture
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="text-4xl md:text-6xl font-black leading-none tracking-tight uppercase glow-text max-w-4xl text-balance">
                {cs.title}{" "}
                <span className="text-muted-foreground block md:inline text-2xl md:text-4xl align-middle opacity-50">{"//"}</span>{" "}
                <span className="text-foreground">{cs.subtitle}</span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-muted-foreground text-lg mt-4 max-w-2xl font-light">{cs.summary}</p>
            </Reveal>
          </div>

          {/* ===== STAT CARDS (3 cols matching HTML) ===== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-10">
            {/* Card 1: Donut Chart */}
            <Reveal delay={300}>
              <div className="glass-panel p-6 rounded-lg border border-border relative group overflow-hidden flex flex-col justify-between min-h-[320px]">
                <CornerAccents />
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[10px] font-mono text-primary uppercase tracking-widest block mb-1">OPTIMIZATION_STRATEGY</span>
                    <h3 className="text-2xl font-bold text-foreground">{metrics[0]?.label || "Zero-Cost Infra"}</h3>
                  </div>
                </div>
                <div className="flex items-center justify-center flex-1 relative my-4">
                  <div className="relative size-40">
                    <svg className="size-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
                      <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--primary))" strokeWidth="6"
                        strokeLinecap="round" className="drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-circle-fill" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-black text-foreground tracking-tighter">{metrics[0]?.value || "0$"}</span>
                      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-1">MONTHLY</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center leading-relaxed font-mono px-2">
                  {metrics[0]?.description || "Leveraging free tiers to eliminate projected hosting costs."}
                </p>
              </div>
            </Reveal>

            {/* Card 2: Progress Bars */}
            <Reveal delay={400}>
              <div className="glass-panel p-6 rounded-lg border border-border relative group overflow-hidden min-h-[320px]">
                <CornerAccents />
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-mono text-orange-500 uppercase tracking-widest block mb-1">SYSTEM_CAPACITY</span>
                    <h3 className="text-xl font-bold text-foreground">{metrics[1]?.label || "128MB Limit"}</h3>
                  </div>
                  <span className="text-[10px] font-mono text-orange-500 border border-orange-500/30 px-2 py-1 rounded bg-orange-500/10">BROKEN</span>
                </div>
                <div className="bg-surface-dark/50 border border-foreground/5 rounded p-4">
                  <div className="mb-4">
                    <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-1 uppercase">
                      <span>Standard CMS</span><span>4MB</span>
                    </div>
                    <div className="w-full bg-border h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-600 progress-width" data-w="5" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-foreground mb-1 uppercase">
                      <span>THIS PROJECT</span>
                      <span className="text-orange-500 font-bold">{metrics[1]?.value || "128MB"}</span>
                    </div>
                    <div className="w-full bg-border h-2 rounded-full overflow-hidden relative">
                      <div className="h-full bg-orange-500 progress-width shadow-[0_0_10px_rgba(249,115,22,0.6)] relative z-10" data-w="95" />
                      <div className="absolute inset-0 bg-orange-500/20 w-[95%] blur-sm" />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4 px-1 leading-relaxed font-mono">
                  {metrics[1]?.description || "Shattered the standard limit, supporting massive file uploads."}
                </p>
              </div>
            </Reveal>

            {/* Card 3: Bar Chart */}
            <Reveal delay={500}>
              <div className="glass-panel p-6 rounded-lg border border-border relative group overflow-hidden min-h-[320px]">
                <CornerAccents />
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-mono text-primary uppercase tracking-widest block mb-1">TECHNICAL_EXECUTION</span>
                    <h3 className="text-xl font-bold text-foreground">{metrics[2]?.label || "Instant Seek"}</h3>
                  </div>
                </div>
                <div className="h-24 flex items-end justify-center gap-1.5 mb-4 px-4">
                  {[30, 50, 40, 70, 100, 60, 45, 25].map((h, i) => (
                    <div key={i} className={`w-1.5 rounded-sm bar-fill ${h === 100 ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : `bg-emerald-${900 - i * 100 > 400 ? 900 - i * 100 : 500}/${40 + i * 10}`}`}
                      data-h={String(h)} style={{ backgroundColor: h === 100 ? undefined : `rgba(16,185,129,${0.3 + (h / 200)})` }} />
                  ))}
                </div>
                <div className="bg-surface-dark/50 border border-foreground/5 rounded p-3 flex justify-between items-center">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">LOAD TIME</span>
                  <div className="flex items-center gap-2 font-mono text-sm">
                    <span className="text-red-500 line-through opacity-60 text-xs">5.0s</span>
                    <span className="text-muted-foreground text-[10px]">{"->"}</span>
                    <span className="text-foreground font-bold text-base">{"< 1s"}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ===== CHALLENGES + SOLUTIONS ===== */}
        <section className="px-6 md:px-10 py-8 grid md:grid-cols-2 gap-8">
          <Reveal>
            <div className="glass-panel p-8 rounded-lg relative overflow-hidden group h-full">
              <div className="absolute top-0 right-0 p-4 text-red-500/20 group-hover:text-red-500/40 transition-colors">
                <X className="size-16" />
              </div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="text-red-500">01.</span> CHALLENGES & LIMITS
              </h3>
              <ul className="space-y-4">
                {challenges.map((c: any, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <X className="text-red-400 mt-1 size-4 shrink-0" />
                    <div>
                      <strong className="block text-red-100">{c.title}</strong>
                      <span className="text-sm text-muted-foreground">{c.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="glass-panel p-8 rounded-lg relative overflow-hidden group tech-border h-full">
              <div className="absolute top-0 right-0 p-4 text-primary/20 group-hover:text-primary/40 transition-colors">
                <Cpu className="size-16" />
              </div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="text-primary">02.</span> ARCHITECTURAL SOLUTIONS
              </h3>
              <ul className="space-y-4">
                {solutions.map((s: any, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="text-primary mt-1 size-4 shrink-0" />
                    <div>
                      <strong className="block text-foreground">{s.title}</strong>
                      <span className="text-sm text-muted-foreground">{s.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>

        {/* ===== ARCHITECTURE DIAGRAM ===== */}
        <section id="architecture" className="px-6 md:px-10 py-12">
          <Reveal>
            <div className="border border-border bg-surface-light/50 rounded-xl p-1 relative overflow-hidden min-h-[600px]">
              <div className="absolute top-6 left-8 z-20">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-1">INFRASTRUCTURE ARCHITECTURE</h3>
                <p className="text-[10px] text-muted-foreground font-mono">Hybrid Storage Engine & Serverless Edge</p>
              </div>
              <div className="relative w-full h-[600px] md:h-[650px] flex items-center justify-center bg-background/80 rounded-lg overflow-hidden">
                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-50" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="gradientLine" x1="0%" x2="100%" y1="0%" y2="0%">
                      <stop offset="0%" style={{ stopColor: "#10b981", stopOpacity: 0 }} />
                      <stop offset="50%" style={{ stopColor: "#10b981", stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: "#10b981", stopOpacity: 0 }} />
                    </linearGradient>
                  </defs>
                  {[
                    { x2: "20%", y2: "25%", delay: "0s" },
                    { x2: "80%", y2: "25%", delay: "0.5s" },
                    { x2: "20%", y2: "75%", delay: "1s" },
                    { x2: "80%", y2: "75%", delay: "1.5s" },
                  ].map((line, i) => (
                    <g key={i}>
                      <line stroke="#1f2937" strokeWidth="1" x1="50%" y1="50%" x2={line.x2} y2={line.y2} />
                      <line className="connection-line opacity-60" stroke="url(#gradientLine)" strokeWidth="1" strokeDasharray="10" x1="50%" y1="50%" x2={line.x2} y2={line.y2}>
                        <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" begin={line.delay} repeatCount="indefinite" />
                      </line>
                    </g>
                  ))}
                </svg>

                {/* Center Node */}
                <div className="absolute z-20 flex flex-col items-center justify-center group cursor-pointer transform hover:scale-105 transition-transform duration-300">
                  <div className="relative size-32 rounded-full border border-primary/30 bg-background flex items-center justify-center glow-box">
                    <div className="absolute inset-0 rounded-full border border-primary opacity-20 animate-ping" />
                    <div className="absolute inset-2 rounded-full border border-dashed border-primary/50 animate-[spin_10s_linear_infinite]" />
                    <div className="flex flex-col items-center z-10 text-center">
                      <Cpu className="size-8 text-foreground mb-2" />
                      <div className="text-sm font-bold tracking-widest text-primary">NEXT.JS 16</div>
                      <div className="text-[9px] font-mono text-muted-foreground mt-1">APP ROUTER</div>
                    </div>
                  </div>
                  <div className="absolute -bottom-12 bg-surface-dark border border-primary/30 px-3 py-1 rounded text-center">
                    <div className="text-[9px] text-muted-foreground uppercase font-mono">RESPONSE TIME</div>
                    <div className="text-xs font-bold text-primary">0.1s (Cached)</div>
                  </div>
                </div>

                {/* Corner Nodes */}
                {archNodes.map((node: any, i: number) => (
                  <div key={i} className={`absolute ${nodePositions[i]} z-10 w-64 hidden md:block`}>
                    <div className="bg-surface-dark border border-border p-4 rounded hover:border-primary/50 transition-colors tech-border group">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="size-10 bg-foreground/5 rounded flex items-center justify-center border border-foreground/10">
                          {nodeIcons[node.title] || <Cpu className="size-5 text-foreground" />}
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">{node.title}</h3>
                          <p className={`text-[9px] font-mono ${nodeColorMap[node.color] || "text-primary"}`}>{node.sub}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-[10px] font-mono text-muted-foreground">
                        {(node.stats || []).map((s: any, si: number) => (
                          <div key={si} className={`flex justify-between ${si === 0 ? "border-b border-foreground/5 pb-2" : "pt-1"}`}>
                            <span>{s.l}</span>
                            <span className="text-foreground">{s.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Mobile Stack */}
                <div className="md:hidden absolute bottom-4 w-full px-4 flex gap-2 overflow-x-auto snap-x">
                  {archNodes.map((node: any, i: number) => (
                    <div key={i} className="snap-center shrink-0 w-4/5 bg-surface-dark border border-border p-3 rounded">
                      <h3 className="text-xs font-bold text-foreground">{node.title}</h3>
                      <p className={`text-[9px] ${nodeColorMap[node.color] || "text-primary"}`}>{node.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ===== CODE TERMINAL + SYSTEM REPORT ===== */}
        <section id="outcomes" className="px-6 md:px-10 py-8 grid lg:grid-cols-2 gap-8 items-start">
          {/* Code Terminal */}
          <Reveal>
            <div className="bg-black rounded-xl border border-border font-mono text-xs overflow-hidden shadow-2xl relative flex flex-col animate-border-glow transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent pointer-events-none z-10" />
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
              {/* Title bar */}
              <div className="bg-surface-light/80 backdrop-blur-md px-4 py-3 border-b border-border flex items-center justify-between relative z-20">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <div className="size-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
                    <div className="size-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
                    <div className="size-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
                  </div>
                  <span className="text-muted-foreground font-mono text-[10px] md:text-xs">~/project_root/technical_dna.json</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] text-primary/70 font-bold tracking-wider">BASH</span>
                </div>
              </div>
              {/* Code content with line numbers */}
              <div className="p-6 md:p-8 text-gray-300 leading-loose relative z-20 bg-black/60 backdrop-blur-sm flex">
                <div className="pr-4 border-r border-foreground/5 text-muted-foreground/30 select-none flex flex-col text-right text-[10px] leading-loose">
                  {Array.from({ length: 15 }, (_, i) => (<span key={i}>{i + 1}</span>))}
                </div>
                <div className="pl-4">
                  <pre className="text-xs"><span className="text-primary">{"{"}</span>{"\n"}{"  "}<span className="text-blue-400">{'"project_codename"'}</span>: <span className="text-emerald-400">{`"${cs.title?.toUpperCase().replace(/ /g, "_")}"`}</span>,{"\n"}{"  "}<span className="text-blue-400">{'"stack_config"'}</span>: <span className="text-primary">{"{"}</span>{"\n"}{"    "}<span className="text-blue-400">{'"framework"'}</span>: <span className="text-emerald-400">{'"Next.js 16 (App Router)"'}</span>,{"\n"}{"    "}<span className="text-blue-400">{'"database"'}</span>: <span className="text-emerald-400">{'"Supabase (PostgreSQL)"'}</span>,{"\n"}{"    "}<span className="text-blue-400">{'"frontend"'}</span>: <span className="text-emerald-400">{'"React 19 + Tailwind"'}</span>,{"\n"}{"    "}<span className="text-blue-400">{'"infra"'}</span>: <span className="text-emerald-400">{'"Vercel Edge Functions"'}</span>{"\n"}{"  "}<span className="text-primary">{"}"}</span>,{"\n"}{"  "}<span className="text-blue-400">{'"tech_stack"'}</span>: <span className="text-primary">[</span>{"\n"}{"    "}{techStack.map((t: string, i: number) => (<span key={i}><span className="text-emerald-400">{`"${t}"`}</span>{i < techStack.length - 1 ? ", " : ""}</span>))}{"\n"}{"  "}<span className="text-primary">]</span>,{"\n"}{"  "}<span className="text-blue-400">{'"security"'}</span>: <span className="text-emerald-400">{'"100% RLS Coverage"'}</span>{"\n"}<span className="text-primary">{"}"}</span></pre>
                </div>
              </div>
            </div>
          </Reveal>

          {/* System Integrity Report */}
          <Reveal delay={200}>
            <div className="h-full flex flex-col bg-surface-dark/40 backdrop-blur-xl border border-border rounded-xl overflow-hidden relative group hover:border-primary/30 transition-all duration-500">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(31,41,55,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(31,41,55,0.3)_1px,transparent_1px)] bg-[size:40px_40px] opacity-50" />
              <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              {/* Report header */}
              <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-foreground/5 bg-foreground/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="size-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                  <h3 className="text-xs font-mono font-bold tracking-[0.2em] text-foreground">SYSTEM_INTEGRITY_REPORT</h3>
                </div>
                <span className="text-[10px] font-mono text-primary/50">V.2.0.4 // LIVE</span>
              </div>
              {/* Report body */}
              <div className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-foreground/5">
                {/* RLS Coverage */}
                <div className="p-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-20">
                    <Shield className="size-10 text-primary" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">Row Level Security</span>
                    <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-primary/10 border border-primary/20">
                      <span className="size-1.5 bg-primary rounded-full animate-pulse" />
                      <span className="text-[10px] font-bold text-primary tracking-wide">ENFORCED</span>
                    </div>
                  </div>
                  <div className="flex items-end gap-4 mt-6">
                    <div className="relative size-20">
                      <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" fill="none" r="42" stroke="hsl(var(--border))" strokeWidth="8" />
                        <circle className="drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-circle-full" cx="50" cy="50" fill="none" r="42" stroke="#10b981" strokeLinecap="round" strokeWidth="8" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="size-5 text-primary" />
                      </div>
                    </div>
                    <div className="mb-1">
                      <span className="text-5xl font-black text-foreground glow-text tracking-tighter block leading-[0.8]">100%</span>
                      <span className="text-[9px] text-muted-foreground font-mono uppercase">Coverage</span>
                    </div>
                  </div>
                </div>
                {/* Backend Scale */}
                <div className="p-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-20">
                    <Network className="size-10 text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">Backend Scale</span>
                    <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/20">
                      <span className="size-1.5 bg-indigo-400 rounded-full animate-pulse" />
                      <span className="text-[10px] font-bold text-indigo-400 tracking-wide">MICRO-SERVICES</span>
                    </div>
                  </div>
                  <div className="mt-4 relative h-20 w-full">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="glowGradient" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path className="drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" d="M0,50 Q20,45 40,55 T80,30 T120,45 T160,20 T200,40" fill="none" stroke="#10b981" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                      <path d="M0,50 Q20,45 40,55 T80,30 T120,45 T160,20 T200,40 V80 H0 Z" fill="url(#glowGradient)" stroke="none" />
                      <circle className="animate-ping" cx="200" cy="40" fill="#10b981" r="3" />
                      <circle cx="200" cy="40" fill="#10b981" r="3" />
                    </svg>
                    <div className="absolute bottom-0 right-0 text-right bg-surface-dark/80 px-2 py-1 backdrop-blur-sm rounded border border-foreground/5">
                      <span className="text-3xl font-black text-foreground glow-text tracking-tighter leading-none">29</span>
                      <span className="text-[9px] text-muted-foreground font-mono uppercase block">Endpoints</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Segment bar */}
              <div className="h-1 w-full bg-black flex gap-px opacity-30">
                <div className="h-full w-1/4 bg-primary/20" />
                <div className="h-full w-1/4 bg-transparent" />
                <div className="h-full w-1/4 bg-primary/20" />
                <div className="h-full w-1/4 bg-transparent" />
              </div>
            </div>
          </Reveal>
        </section>

        {/* Back link */}
        <section className="px-6 md:px-10 py-8">
          <Link href="/case-studies" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-mono uppercase tracking-wider transition-colors">
            <ArrowLeft className="size-4" />
            Back to Mission Archive
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border bg-surface-dark py-8">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground font-mono">
          <div className="flex items-center gap-2">
            <span className="size-2 bg-green-500 rounded-full animate-pulse" />
            SYSTEM STATUS: OPTIMAL
          </div>
          <div className="mt-4 md:mt-0">
            {"© 2024 SAYED ELSHAZLY // MISSION CONTROL"}
          </div>
        </div>
      </footer>
    </div>
  )
}

/* Corner accent marks for cards */
function CornerAccents() {
  return (
    <>
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/50" />
    </>
  )
}
