"use client"
import { Upload, Cpu, Shield, Rocket, Database, Network, Code, Zap } from "lucide-react"

const icons: Record<string, any> = { Upload, Cpu, Shield, Rocket, Database, Network, Code, Zap }

export function FlowDiagramBlock({ data }: { data: any }) {
  const steps = data.steps || []
  return (
    <div className="glass-panel p-8 rounded-lg border border-[#1f2937] relative h-full">
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#10b981]/50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#10b981]/50" />
      <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-8 flex items-center gap-2">
        <span className="size-1.5 bg-[#10b981] rounded-full" />
        {data.title || "PROCESS FLOW"}
      </h3>
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
        {steps.map((step: any, i: number) => {
          const Icon = icons[step.icon] || Zap
          return (
            <div key={i} className="flex items-center gap-2 shrink-0">
              <div className="flex flex-col items-center gap-3 min-w-[120px]">
                <div className="size-16 rounded-lg border border-[#1f2937] bg-[#0a0a0a] flex items-center justify-center hover:border-[#10b981]/50 transition-colors group">
                  <Icon className="size-6 text-[#10b981] group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-white uppercase tracking-wider">{step.label}</div>
                  <div className="text-[10px] text-[#6b7280] font-mono mt-0.5">{step.description}</div>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="flex items-center gap-1 self-start mt-6">
                  <div className="w-8 h-px bg-gradient-to-r from-[#10b981]/50 to-[#10b981]/10" />
                  <svg className="size-3 text-[#10b981]/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
