"use client"
import { X, Cpu } from "lucide-react"

export function ChallengesListBlock({ data }: { data: any }) {
  const items = data.items || []
  return (
    <div className="glass-panel p-8 rounded-lg relative overflow-hidden group h-full">
      <div className="absolute top-0 right-0 p-4 text-red-500/20 group-hover:text-red-500/40 transition-colors">
        <X className="size-16" />
      </div>
      <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
        <span className="text-red-500">01.</span> CHALLENGES & LIMITS
      </h3>
      <ul className="space-y-4">
        {items.map((c: any, i: number) => (
          <li key={i} className="flex items-start gap-3">
            <X className="text-red-400 mt-1 size-4 shrink-0" />
            <div>
              <strong className="block text-red-100">{c.title}</strong>
              <span className="text-sm text-[#6b7280]">{c.desc}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SolutionsListBlock({ data }: { data: any }) {
  const items = data.items || []
  return (
    <div className="glass-panel p-8 rounded-lg relative overflow-hidden group h-full tech-border">
      <div className="absolute top-0 right-0 p-4 text-[#10b981]/20 group-hover:text-[#10b981]/40 transition-colors">
        <Cpu className="size-16" />
      </div>
      <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
        <span className="text-[#10b981]">02.</span> ARCHITECTURAL SOLUTIONS
      </h3>
      <ul className="space-y-4">
        {items.map((s: any, i: number) => (
          <li key={i} className="flex items-start gap-3">
            <svg className="text-[#10b981] mt-1 size-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <div>
              <strong className="block text-white">{s.title}</strong>
              <span className="text-sm text-[#6b7280]">{s.desc}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
