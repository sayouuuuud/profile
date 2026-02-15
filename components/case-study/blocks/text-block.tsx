"use client"

const accentColors: Record<string, string> = {
  emerald: "border-primary/50", red: "border-red-500/50", orange: "border-orange-500/50", blue: "border-blue-500/50", indigo: "border-indigo-500/50",
}

export function TextBlockComponent({ data }: { data: any }) {
  const accent = accentColors[data.accent_color] || accentColors.emerald
  return (
    <div className="glass-panel p-8 rounded-lg border border-border relative h-full card-glow">
      {data.heading && (
        <h3 className="text-xl font-bold text-foreground mb-4">{data.heading}</h3>
      )}
      <div className={`border-l-2 ${accent} pl-6 py-1`}>
        <p className="text-sm text-muted-foreground leading-relaxed font-light">{data.body}</p>
      </div>
    </div>
  )
}
