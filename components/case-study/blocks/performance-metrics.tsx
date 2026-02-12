"use client"

interface PerformanceMetricsData {
  title?: string
  metrics?: Array<{ label: string; value: string; trend: string; color?: string }>
}

export function PerformanceMetrics({ data }: { data: PerformanceMetricsData }) {
  const metrics = data.metrics || []
  
  return (
    <div className="glass-panel border border-[#1f2937] p-8 rounded-sm space-y-6">
      <h3 className="text-xs font-mono text-[#10b981] uppercase tracking-[0.2em] flex items-center gap-2">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3v18h18" />
          <path d="M18 17V9M13 17V5M8 17v-3" />
        </svg>
        {data.title || "PERFORMANCE METRICS"}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric, i) => {
          const isPositive = metric.trend?.startsWith('+')
          const color = metric.color || (isPositive ? '#10b981' : '#ef4444')
          
          return (
            <div key={i} className="bg-[#0a0a0a] border border-[#1f2937] rounded p-4 hover:border-[#10b981]/30 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="text-[10px] font-mono text-[#6b7280] uppercase tracking-wider">
                  {metric.label}
                </div>
                <div className="text-xs font-bold font-mono" style={{ color }}>
                  {metric.trend}
                </div>
              </div>
              <div className="text-3xl font-light text-white tracking-tight">
                {metric.value}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
