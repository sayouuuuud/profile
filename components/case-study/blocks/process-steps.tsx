"use client"

interface ProcessStepsData {
  title?: string
  steps?: Array<{ number: string; title: string; description: string }>
}

export function ProcessSteps({ data }: { data: ProcessStepsData }) {
  const steps = data.steps || []
  
  return (
    <div className="glass-panel border border-[#1f2937] p-8 rounded-sm space-y-6">
      <h3 className="text-xs font-mono text-[#10b981] uppercase tracking-[0.2em]">
        {data.title || "PROCESS"}
      </h3>
      
      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-4 group">
            {/* Step number */}
            <div className="flex-shrink-0 w-12 h-12 rounded-sm bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center text-xl font-bold text-[#10b981] group-hover:scale-110 transition-transform">
              {step.number || (i + 1)}
            </div>
            
            {/* Content */}
            <div className="flex-1 pt-1">
              <h4 className="text-sm font-bold text-white mb-2">{step.title}</h4>
              <p className="text-xs text-[#6b7280] leading-relaxed">{step.description}</p>
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="absolute left-14 mt-12 w-0.5 h-8 bg-[#1f2937]" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
