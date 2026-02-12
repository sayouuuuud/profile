"use client"

interface ChallengeBadgeData {
  title?: string
  severity?: "low" | "medium" | "high" | "critical"
  category?: string
  description?: string
  status?: "resolved" | "in-progress" | "pending"
}

export function ChallengeBadge({ data }: { data: ChallengeBadgeData }) {
  const severityColors = {
    low: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400" },
    medium: { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-400" },
    high: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400" },
    critical: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400" }
  }
  
  const statusColors = {
    resolved: { bg: "bg-[#10b981]/10", border: "border-[#10b981]/30", text: "text-[#10b981]" },
    "in-progress": { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-400" },
    pending: { bg: "bg-[#6b7280]/10", border: "border-[#6b7280]/30", text: "text-[#6b7280]" }
  }
  
  const severity = data.severity || "medium"
  const status = data.status || "resolved"
  
  return (
    <div className={`glass-panel border rounded-sm p-6 ${severityColors[severity].border} hover:scale-105 transition-transform`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${severityColors[severity].text.replace('text-', 'bg-')} animate-pulse`} />
              <span className={`text-[10px] font-mono uppercase tracking-wider ${severityColors[severity].text}`}>
                {data.category || "Challenge"}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">{data.title || "Challenge Title"}</h4>
          </div>
          
          <div className={`px-3 py-1 rounded text-[10px] font-bold font-mono uppercase tracking-wider ${statusColors[status].bg} ${statusColors[status].border} ${statusColors[status].text} border`}>
            {status.replace('-', ' ')}
          </div>
        </div>

        {/* Description */}
        {data.description && (
          <p className="text-xs text-[#6b7280] leading-relaxed border-t border-[#1f2937] pt-4">
            {data.description}
          </p>
        )}
      </div>
    </div>
  )
}
