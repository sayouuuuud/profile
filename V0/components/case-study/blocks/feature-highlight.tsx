"use client"

interface FeatureHighlightData {
  icon?: string
  title?: string
  description?: string
  metrics?: Array<{ label: string; value: string }>
  badge?: string
}

export function FeatureHighlight({ data }: { data: FeatureHighlightData }) {
  return (
    <div className="glass-panel border border-[#1f2937] p-8 rounded-sm hover:border-[#10b981]/30 transition-all duration-300 group">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-sm bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              {data.icon || "⚡"}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{data.title || "Feature"}</h3>
              {data.badge && (
                <span className="text-[10px] font-mono text-[#10b981] uppercase tracking-wider">{data.badge}</span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[#6b7280] leading-relaxed">
          {data.description || "Feature description goes here."}
        </p>

        {/* Metrics */}
        {data.metrics && data.metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#1f2937]">
            {data.metrics.map((metric, i) => (
              <div key={i}>
                <div className="text-2xl font-light text-[#10b981]">{metric.value}</div>
                <div className="text-[10px] font-mono text-[#6b7280] uppercase tracking-wider">{metric.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
