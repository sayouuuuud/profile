export type BlockWidth = "1/3" | "1/2" | "2/3" | "full"

export interface BlockDef {
  type: string
  label: string
  icon: string          // Lucide icon name
  category: "Charts" | "Data" | "Layout" | "Product"
  description: string
  widths: BlockWidth[]
  defaultWidth: BlockWidth
  defaultData: Record<string, any>
}

export const BLOCK_REGISTRY: BlockDef[] = [
  // ── Charts ──
  {
    type: "stat-donut",
    label: "Donut Chart",
    icon: "PieChart",
    category: "Charts",
    description: "Donut ring with center metric, tag, and description",
    widths: ["1/3", "1/2", "2/3"],
    defaultWidth: "1/3",
    defaultData: {
      tag: "METRIC_TAG",
      type: "donut",
      title: "Metric Title",
      description: "Description of this metric and what it measures.",
      center_label: "LABEL",
      center_value: "0$",
      fill_percent: 75,
    },
  },
  {
    type: "stat-progress",
    label: "Comparison Bars",
    icon: "BarChart3",
    category: "Charts",
    description: "Progress bars comparing two or more values with labels",
    widths: ["1/3", "1/2", "2/3"],
    defaultWidth: "1/3",
    defaultData: {
      tag: "SYSTEM_CAPACITY",
      tag_color: "orange",
      type: "progress",
      title: "128MB Limit",
      badge: "BROKEN",
      description: "Comparison between baseline and achieved metrics.",
      bars: [
        { label: "STANDARD", value: "4MB", percent: 3, color: "slate" },
        { label: "PROJECT", value: "128MB", percent: 100, color: "orange" },
      ],
    },
  },
  {
    type: "stat-bars",
    label: "Bar Chart",
    icon: "BarChart",
    category: "Charts",
    description: "Vertical bars with before/after load time comparison",
    widths: ["1/3", "1/2", "2/3"],
    defaultWidth: "1/3",
    defaultData: {
      tag: "TECHNICAL_EXECUTION",
      type: "bars",
      title: "Performance",
      bar_heights: [30, 50, 40, 70, 100, 60, 45, 25],
      load_before: "5.0s",
      load_after: "< 1s",
    },
  },
  {
    type: "metric-gauge",
    label: "Metric Gauge",
    icon: "Gauge",
    category: "Charts",
    description: "Semi-circular gauge showing percentage with label",
    widths: ["1/3", "1/2"],
    defaultWidth: "1/3",
    defaultData: {
      tag: "PERFORMANCE",
      title: "Uptime",
      value: 99.9,
      max: 100,
      suffix: "%",
      color: "emerald",
    },
  },
  {
    type: "kpi-card",
    label: "KPI Card",
    icon: "TrendingUp",
    category: "Charts",
    description: "Large metric number with sparkline trend and delta",
    widths: ["1/3", "1/2", "2/3"],
    defaultWidth: "1/3",
    defaultData: {
      tag: "MONTHLY_ACTIVE",
      title: "12.4k",
      subtitle: "Active Users",
      delta: "+12.5%",
      delta_direction: "up",
      sparkline: [20, 35, 28, 45, 60, 55, 70, 85],
    },
  },

  // ── Data ──
  {
    type: "challenges-list",
    label: "Challenges List",
    icon: "XCircle",
    category: "Data",
    description: "Red-accented list of challenges and limitations",
    widths: ["1/2", "full"],
    defaultWidth: "1/2",
    defaultData: {
      items: [
        { title: "Challenge Title", desc: "Description of the challenge." },
      ],
    },
  },
  {
    type: "solutions-list",
    label: "Solutions List",
    icon: "CheckCircle",
    category: "Data",
    description: "Green-accented list of architectural solutions",
    widths: ["1/2", "full"],
    defaultWidth: "1/2",
    defaultData: {
      items: [
        { title: "Solution Title", desc: "Description of the solution." },
      ],
    },
  },
  {
    type: "comparison-table",
    label: "Before/After Table",
    icon: "Columns",
    category: "Data",
    description: "Comparison table with Before/After columns and status",
    widths: ["1/2", "2/3", "full"],
    defaultWidth: "1/2",
    defaultData: {
      title: "System Comparison",
      rows: [
        { label: "Load Time", before: "5.2s", after: "0.8s", status: "improved" },
        { label: "Uptime", before: "95%", after: "99.9%", status: "improved" },
        { label: "Cost/mo", before: "$450", after: "$0", status: "improved" },
      ],
    },
  },
  {
    type: "status-panel",
    label: "Status Panel",
    icon: "Activity",
    category: "Data",
    description: "Multi-indicator status panel with color-coded badges",
    widths: ["1/3", "1/2", "2/3", "full"],
    defaultWidth: "1/2",
    defaultData: {
      title: "SYSTEM STATUS",
      indicators: [
        { label: "API", status: "operational", value: "99.9%" },
        { label: "Database", status: "operational", value: "Active" },
        { label: "CDN", status: "degraded", value: "87%" },
        { label: "Auth", status: "operational", value: "Active" },
      ],
    },
  },
  {
    type: "metric-highlight",
    label: "Metric Highlight",
    icon: "Zap",
    category: "Data",
    description: "Large highlighted metric with subtitle and optional comparison",
    widths: ["1/3", "1/2", "2/3"],
    defaultWidth: "1/2",
    defaultData: {
      tag: "KEY_RESULT",
      value: "128MB",
      label: "Upload Limit",
      description: "Shattered the standard 4MB limit for file uploads.",
      comparison: { before: "4MB", after: "128MB" },
    },
  },

  // ── Layout ──
  {
    type: "architecture-diagram",
    label: "Architecture Diagram",
    icon: "Network",
    category: "Layout",
    description: "Full architecture diagram with center node and corner tech nodes",
    widths: ["full"],
    defaultWidth: "full",
    defaultData: {
      nodes: [
        { title: "NODE 1", sub: "Service", color: "emerald", icon_type: "database", stats: [{ l: "Latency", v: "10ms", v_color: "emerald-500" }] },
        { title: "NODE 2", sub: "Service", color: "indigo", icon_type: "streaming", stats: [{ l: "Throughput", v: "1Gbps", v_color: "emerald-500" }] },
        { title: "NODE 3", sub: "Service", color: "rose", icon_type: "upload", stats: [{ l: "Files", v: "10k+", v_color: "emerald-500" }] },
        { title: "NODE 4", sub: "Service", color: "emerald", icon_type: "vercel", stats: [{ l: "Deploy", v: "< 30s", v_color: "emerald-500" }] },
      ],
    },
  },
  {
    type: "code-terminal",
    label: "Code Terminal",
    icon: "Terminal",
    category: "Layout",
    description: "Syntax-highlighted code terminal with filename and language",
    widths: ["1/2", "2/3", "full"],
    defaultWidth: "1/2",
    defaultData: {
      filename: "config.json",
      lang: "JSON",
      content: [
        { type: "bracket", text: "{" },
        { type: "line", key: "name", value: "my-project" },
        { type: "line", key: "version", value: "1.0.0" },
        { type: "bracket", text: "}" },
      ],
    },
  },
  {
    type: "system-report",
    label: "System Report",
    icon: "Shield",
    category: "Layout",
    description: "Split-panel system integrity report with gauges and charts",
    widths: ["1/2", "2/3", "full"],
    defaultWidth: "1/2",
    defaultData: {
      version: "v3.0.1_STABLE",
      left_panel: { label: "SECURITY LAYER", badge: "ACTIVE", badge_color: "primary", value: "A+", value_label: "Security Grade" },
      right_panel: { label: "NETWORK LATENCY", badge: "MONITORING", value: "42ms", value_label: "Avg Response" },
    },
  },
  {
    type: "text-block",
    label: "Text Block",
    icon: "AlignLeft",
    category: "Layout",
    description: "Rich text section with heading and body content",
    widths: ["1/3", "1/2", "2/3", "full"],
    defaultWidth: "full",
    defaultData: {
      heading: "Section Heading",
      body: "Add your narrative content here. This block supports longer text descriptions.",
      accent_color: "emerald",
    },
  },

  // ── Product ──
  {
    type: "timeline",
    label: "Timeline / Roadmap",
    icon: "GitBranch",
    category: "Product",
    description: "Vertical timeline with milestones, dates, and status",
    widths: ["1/2", "2/3", "full"],
    defaultWidth: "1/2",
    defaultData: {
      title: "PROJECT ROADMAP",
      milestones: [
        { title: "Discovery & Research", date: "Week 1-2", status: "completed", description: "User research and competitive analysis" },
        { title: "Architecture Design", date: "Week 3-4", status: "completed", description: "System design and tech stack selection" },
        { title: "MVP Development", date: "Week 5-8", status: "in-progress", description: "Core features implementation" },
        { title: "Launch & Scale", date: "Week 9-12", status: "pending", description: "Production deployment and monitoring" },
      ],
    },
  },
  {
    type: "flow-diagram",
    label: "Flow Diagram",
    icon: "Workflow",
    category: "Product",
    description: "Horizontal flow diagram with connected process steps",
    widths: ["2/3", "full"],
    defaultWidth: "full",
    defaultData: {
      title: "PROCESS FLOW",
      steps: [
        { label: "Input", description: "User request", icon: "Upload" },
        { label: "Process", description: "AI Analysis", icon: "Cpu" },
        { label: "Validate", description: "Quality check", icon: "Shield" },
        { label: "Output", description: "Delivery", icon: "Rocket" },
      ],
    },
  },
  {
    type: "impact-card",
    label: "Impact Card",
    icon: "TrendingUp",
    category: "Product",
    description: "Before/After comparison with improvement percentage and arrow",
    widths: ["1/3", "1/2", "2/3"],
    defaultWidth: "1/2",
    defaultData: {
      title: "IMPACT ANALYSIS",
      before_label: "BEFORE",
      before_value: "45%",
      after_label: "AFTER",
      after_value: "92%",
      improvement: "+104%",
      description: "Significant improvement in key performance metric.",
    },
  },
  {
    type: "tech-stack",
    label: "Tech Stack Grid",
    icon: "Blocks",
    category: "Product",
    description: "Grid of technologies with categories and color accents",
    widths: ["1/2", "2/3", "full"],
    defaultWidth: "1/2",
    defaultData: {
      title: "TECH STACK",
      technologies: [
        { name: "Next.js", category: "Framework", color: "bg-emerald-500" },
        { name: "Supabase", category: "Database", color: "bg-emerald-500" },
        { name: "TypeScript", category: "Language", color: "bg-blue-500" },
        { name: "Tailwind", category: "Styling", color: "bg-cyan-500" },
      ],
    },
  },
  {
    type: "quote-card",
    label: "Quote / Testimonial",
    icon: "MessageSquare",
    category: "Product",
    description: "Client quote with author details and optional avatar",
    widths: ["1/2", "2/3", "full"],
    defaultWidth: "1/2",
    defaultData: {
      quote: "This solution transformed our workflow completely.",
      author: "Client Name",
      role: "CEO",
      company: "Company Inc.",
      avatar_url: "",
    },
  },
  {
    type: "feature-highlight",
    label: "Feature Highlight",
    icon: "Star",
    category: "Product",
    description: "Feature card with icon, title, description, and metrics",
    widths: ["1/3", "1/2", "2/3"],
    defaultWidth: "1/2",
    defaultData: {
      icon: "⚡",
      title: "Real-time Sync",
      description: "Instant synchronization across all devices with zero latency.",
      badge: "NEW FEATURE",
      metrics: [
        { label: "Sync Speed", value: "< 100ms" },
        { label: "Reliability", value: "99.9%" },
      ],
    },
  },
  {
    type: "process-steps",
    label: "Process Steps",
    icon: "List",
    category: "Product",
    description: "Numbered step-by-step process with descriptions",
    widths: ["1/2", "2/3", "full"],
    defaultWidth: "1/2",
    defaultData: {
      title: "PROCESS",
      steps: [
        { number: "01", title: "Research", description: "Conduct user research and analyze requirements" },
        { number: "02", title: "Design", description: "Create wireframes and high-fidelity mockups" },
        { number: "03", title: "Develop", description: "Build and test the solution" },
        { number: "04", title: "Launch", description: "Deploy to production and monitor" },
      ],
    },
  },
  {
    type: "performance-metrics",
    label: "Performance Metrics",
    icon: "Activity",
    category: "Product",
    description: "Performance KPIs with trends and color-coded values",
    widths: ["1/2", "2/3", "full"],
    defaultWidth: "1/2",
    defaultData: {
      title: "PERFORMANCE METRICS",
      metrics: [
        { label: "Response Time", value: "42ms", trend: "-65%", color: "#10b981" },
        { label: "Error Rate", value: "0.02%", trend: "-98%", color: "#10b981" },
        { label: "Throughput", value: "12k/s", trend: "+350%", color: "#10b981" },
        { label: "CPU Usage", value: "15%", trend: "-40%", color: "#10b981" },
      ],
    },
  },
  {
    type: "team-member",
    label: "Team Member",
    icon: "User",
    category: "Product",
    description: "Team member profile with avatar, role, bio, and skills",
    widths: ["1/3", "1/2"],
    defaultWidth: "1/3",
    defaultData: {
      name: "John Doe",
      role: "Lead Engineer",
      avatar_url: "",
      bio: "10+ years of experience building scalable systems.",
      skills: ["React", "Node.js", "AWS"],
    },
  },
  {
    type: "challenge-badge",
    label: "Challenge Badge",
    icon: "AlertTriangle",
    category: "Product",
    description: "Challenge or issue badge with severity and status indicators",
    widths: ["1/3", "1/2", "2/3"],
    defaultWidth: "1/2",
    defaultData: {
      title: "Legacy System Integration",
      severity: "high",
      category: "Technical Debt",
      description: "Migrating from monolithic architecture to microservices.",
      status: "resolved",
    },
  },
  {
    type: "roi-display",
    label: "ROI Calculator",
    icon: "DollarSign",
    category: "Product",
    description: "ROI analysis with investment, returns, and breakdown",
    widths: ["1/2", "2/3"],
    defaultWidth: "1/2",
    defaultData: {
      title: "ROI ANALYSIS",
      investment: "$50K",
      returns: "$125K",
      roi_percentage: "+150%",
      timeframe: "6 MONTHS",
      breakdown: [
        { label: "Cost Savings", value: "$45K" },
        { label: "Revenue Growth", value: "$30K" },
      ],
    },
  },
  {
    type: "data-visual",
    label: "Data Visualization",
    icon: "LineChart",
    category: "Product",
    description: "Interactive line/area chart with data points and summary",
    widths: ["1/2", "2/3", "full"],
    defaultWidth: "1/2",
    defaultData: {
      title: "GROWTH TREND",
      chart_type: "area",
      data_points: [20, 45, 35, 60, 55, 75, 65, 85, 80, 95],
      label: "Monthly Growth",
      summary: "Consistent upward trend over the past 10 months.",
    },
  },
]

export function getBlockDef(type: string): BlockDef | undefined {
  return BLOCK_REGISTRY.find((b) => b.type === type)
}

export function getBlocksByCategory(): Record<string, BlockDef[]> {
  const map: Record<string, BlockDef[]> = {}
  for (const b of BLOCK_REGISTRY) {
    if (!map[b.category]) map[b.category] = []
    map[b.category].push(b)
  }
  return map
}

export const WIDTH_TO_COLS: Record<BlockWidth, string> = {
  "1/3": "col-span-12 md:col-span-4",
  "1/2": "col-span-12 md:col-span-6",
  "2/3": "col-span-12 md:col-span-8",
  "full": "col-span-12",
}
