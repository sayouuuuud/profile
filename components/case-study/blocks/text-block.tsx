"use client"

const accentColors: Record<string, string> = {
  emerald: "border-[#10b981]/50", red: "border-red-500/50", orange: "border-orange-500/50", blue: "border-blue-500/50", indigo: "border-indigo-500/50",
}

export function TextBlockComponent({ data }: { data: any }) {
  const accent = accentColors[data.accent_color] || accentColors.emerald
  return (
    <div className="glass-panel p-8 rounded-lg border border-[#1f2937] relative h-full">
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#10b981]/50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#10b981]/50" />
      {data.heading && (
        <h3 className="text-xl font-bold text-white uppercase tracking-wide mb-4">{data.heading}</h3>
      )}
      <div className={`border-l-2 ${accent} pl-6 py-1`}>
        <p className="text-sm text-[#6b7280] leading-relaxed font-light">{data.body}</p>
      </div>
    </div>
  )
}
