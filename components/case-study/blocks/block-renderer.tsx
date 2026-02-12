"use client"
import { useEffect, useRef, type ReactNode } from "react"
import { WIDTH_TO_COLS, type BlockWidth } from "@/lib/block-registry"

import { StatDonutBlock } from "./stat-donut"
import { StatProgressBlock } from "./stat-progress"
import { StatBarsBlock } from "./stat-bars"
import { ChallengesListBlock, SolutionsListBlock } from "./challenges-list"
import { ArchitectureDiagramBlock } from "./architecture-diagram"
import { CodeTerminalBlock } from "./code-terminal"
import { SystemReportBlock } from "./system-report"
import { KpiCardBlock } from "./kpi-card"
import { TimelineBlock } from "./timeline"
import { ComparisonTableBlock } from "./comparison-table"
import { FlowDiagramBlock } from "./flow-diagram"
import { MetricGaugeBlock } from "./metric-gauge"
import { StatusPanelBlock } from "./status-panel"
import { MetricHighlightBlock } from "./metric-highlight"
import { TextBlockComponent } from "./text-block"
import { ImpactCard } from "./impact-card"
import { TechStack } from "./tech-stack"
import { QuoteCard } from "./quote-card"
import { FeatureHighlight } from "./feature-highlight"
import { ProcessSteps } from "./process-steps"
import { PerformanceMetrics } from "./performance-metrics"
import { TeamMember } from "./team-member"
import { ChallengeBadge } from "./challenge-badge"
import { ROIDisplay } from "./roi-display"
import { DataVisual } from "./data-visual"

const BLOCK_COMPONENTS: Record<string, React.ComponentType<{ data: any }>> = {
  "stat-donut": StatDonutBlock,
  "stat-progress": StatProgressBlock,
  "stat-bars": StatBarsBlock,
  "challenges-list": ChallengesListBlock,
  "solutions-list": SolutionsListBlock,
  "architecture-diagram": ArchitectureDiagramBlock,
  "code-terminal": CodeTerminalBlock,
  "system-report": SystemReportBlock,
  "kpi-card": KpiCardBlock,
  "timeline": TimelineBlock,
  "comparison-table": ComparisonTableBlock,
  "flow-diagram": FlowDiagramBlock,
  "metric-gauge": MetricGaugeBlock,
  "status-panel": StatusPanelBlock,
  "metric-highlight": MetricHighlightBlock,
  "text-block": TextBlockComponent,
  "impact-card": ImpactCard,
  "tech-stack": TechStack,
  "quote-card": QuoteCard,
  "feature-highlight": FeatureHighlight,
  "process-steps": ProcessSteps,
  "performance-metrics": PerformanceMetrics,
  "team-member": TeamMember,
  "challenge-badge": ChallengeBadge,
  "roi-display": ROIDisplay,
  "data-visual": DataVisual,
}

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
    <div ref={ref} className={`reveal-on-scroll ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  )
}

export interface ContentBlock {
  id: string
  type: string
  width: BlockWidth
  sort_order: number
  data: any
}

export function BlockGrid({ blocks }: { blocks: ContentBlock[] }) {
  if (!blocks || blocks.length === 0) return null

  const sorted = [...blocks].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

  return (
    <div className="grid grid-cols-12 gap-6 w-full">
      {sorted.map((block, idx) => {
        const Component = BLOCK_COMPONENTS[block.type]
        if (!Component) return null
        const colClass = WIDTH_TO_COLS[block.width] || "col-span-12"
        return (
          <div key={block.id} className={colClass}>
            <Reveal delay={idx * 80}>
              <Component data={block.data} />
            </Reveal>
          </div>
        )
      })}
    </div>
  )
}
