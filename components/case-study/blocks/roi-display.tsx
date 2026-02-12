"use client"

interface ROIDisplayData {
  title?: string
  investment?: string
  returns?: string
  roi_percentage?: string
  timeframe?: string
  breakdown?: Array<{ label: string; value: string }>
}

export function ROIDisplay({ data }: { data: ROIDisplayData }) {
  return (
    <div className="glass-panel border border-[#10b981]/50 p-8 rounded-sm relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/10 via-transparent to-transparent" />
      
      <div className="relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono text-[#10b981] uppercase tracking-[0.2em]">
            {data.title || "ROI ANALYSIS"}
          </h3>
          {data.timeframe && (
            <span className="text-[10px] font-mono text-[#6b7280] uppercase tracking-wider">
              {data.timeframe}
            </span>
          )}
        </div>

        {/* Main ROI */}
        <div className="text-center py-6 bg-[#0a0a0a] border border-[#1f2937] rounded">
          <div className="text-5xl font-light text-[#10b981] tracking-tight mb-2">
            {data.roi_percentage || "+250%"}
          </div>
          <div className="text-xs font-mono text-[#6b7280] uppercase tracking-wider">
            Return on Investment
          </div>
        </div>

        {/* Investment vs Returns */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#0a0a0a] border border-[#1f2937] rounded p-4">
            <div className="text-[10px] font-mono text-[#6b7280] uppercase tracking-wider mb-2">
              Investment
            </div>
            <div className="text-2xl font-light text-white">
              {data.investment || "$50K"}
            </div>
          </div>
          
          <div className="bg-[#0a0a0a] border border-[#10b981]/30 rounded p-4">
            <div className="text-[10px] font-mono text-[#6b7280] uppercase tracking-wider mb-2">
              Returns
            </div>
            <div className="text-2xl font-light text-[#10b981]">
              {data.returns || "$125K"}
            </div>
          </div>
        </div>

        {/* Breakdown */}
        {data.breakdown && data.breakdown.length > 0 && (
          <div className="border-t border-[#1f2937] pt-4 space-y-2">
            {data.breakdown.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-[#6b7280] font-mono">{item.label}</span>
                <span className="text-white font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
