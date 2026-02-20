"use client"

interface DataVisualData {
  title?: string
  chart_type?: "line" | "area" | "sparkline"
  data_points?: number[]
  label?: string
  summary?: string
}

export function DataVisual({ data }: { data: DataVisualData }) {
  const points = data.data_points || [20, 45, 35, 60, 55, 75, 65, 85, 80, 95]
  const max = Math.max(...points)
  const normalized = points.map(p => (p / max) * 100)
  
  return (
    <div className="glass-panel border border-border p-8 rounded-lg card-glow space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono text-primary uppercase tracking-[0.2em]">
          {data.title || "DATA VISUALIZATION"}
        </h3>
        {data.label && (
          <span className="text-xs text-muted-foreground font-mono">{data.label}</span>
        )}
      </div>

      {/* Chart */}
      <div className="relative h-32 bg-card border border-border rounded p-4">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox={`0 0 ${points.length * 10} 100`}>
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line key={y} x1="0" y1={y} x2={points.length * 10} y2={y} stroke="#1f2937" strokeWidth="0.5" />
          ))}
          
          {/* Area fill */}
          {data.chart_type === "area" && (
            <path
              d={`M 0 100 ${normalized.map((p, i) => `L ${i * 10} ${100 - p}`).join(' ')} L ${(points.length - 1) * 10} 100 Z`}
              fill="url(#gradient)"
              opacity="0.3"
            />
          )}
          
          {/* Line */}
          <path
            d={normalized.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * 10} ${100 - p}`).join(' ')}
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Summary */}
      {data.summary && (
        <p className="text-xs text-muted-foreground font-mono">{data.summary}</p>
      )}
    </div>
  )
}
