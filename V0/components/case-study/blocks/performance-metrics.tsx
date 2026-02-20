"use client"

interface PerformanceMetricsData {
  title?: string
  metrics?: Array<{ label: string; value: string; trend: string; color?: string }>
}

export function PerformanceMetrics({ data }: { data: PerformanceMetricsData }) {
  const metrics = data.metrics || []
  
  return (
    <div className="glass-panel border border-border p-8 rounded-lg space-y-6 card-glow">
      <h3 className="text-xs text-primary uppercase tracking-widest flex items-center gap-2">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3v18h18" />
          <path d="M18 17V9M13 17V5M8 17v-3" />
        </svg>
        {data.title || "PERFORMANCE METRICS"}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric, i) => {
          const isPositive = metric.trend?.startsWith('+')
          const color = metric.color || (isPositive ? 'hsl(var(--primary))' : '#ef4444')
          
          return (
            <div key={i} className="bg-background border border-border rounded p-4 hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {metric.label}
                </div>
                <div className="text-xs font-bold" style={{ color }}>
                  {metric.trend}
                </div>
              </div>
              <div className="text-3xl font-light text-foreground tracking-tight">
                {metric.value}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
