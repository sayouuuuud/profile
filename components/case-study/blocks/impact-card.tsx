"use client"

interface ImpactCardData {
  title?: string
  before_label?: string
  before_value?: string
  after_label?: string
  after_value?: string
  description?: string
  improvement?: string
}

export function ImpactCard({ data }: { data: ImpactCardData }) {
  return (
    <div className="glass-panel border border-[#1f2937] p-8 rounded-sm relative overflow-hidden group h-full flex flex-col justify-between">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 space-y-6">
        {/* Title */}
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono text-[#10b981] uppercase tracking-[0.2em]">
            {data.title || "IMPACT ANALYSIS"}
          </h3>
          {data.improvement && (
            <div className="px-3 py-1 bg-[#10b981]/10 border border-[#10b981]/30 rounded text-[#10b981] text-xs font-bold font-mono">
              {data.improvement}
            </div>
          )}
        </div>

        {/* Before/After Comparison */}
        <div className="grid grid-cols-2 gap-6">
          {/* Before */}
          <div className="space-y-2">
            <div className="text-[10px] font-mono text-[#6b7280] uppercase tracking-wider">
              {data.before_label || "BEFORE"}
            </div>
            <div className="text-4xl font-light text-red-400 tracking-tight">
              {data.before_value || "0"}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <svg className="w-12 h-12 text-[#10b981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* After */}
          <div className="space-y-2 col-start-2">
            <div className="text-[10px] font-mono text-[#6b7280] uppercase tracking-wider">
              {data.after_label || "AFTER"}
            </div>
            <div className="text-4xl font-light text-[#10b981] tracking-tight">
              {data.after_value || "100%"}
            </div>
          </div>
        </div>

        {/* Description */}
        {data.description && (
          <p className="text-xs text-[#6b7280] leading-relaxed font-mono border-t border-[#1f2937] pt-4">
            {data.description}
          </p>
        )}
      </div>
    </div>
  )
}
