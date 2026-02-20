"use client"

interface ProcessStepsData {
  title?: string
  steps?: Array<{ number: string; title: string; description: string }>
}

export function ProcessSteps({ data }: { data: ProcessStepsData }) {
  const steps = data.steps || []

  return (
    <div className="glass-panel border border-border p-8 rounded-lg space-y-6 h-full flex flex-col card-glow">
      <h3 className="text-xs text-primary uppercase tracking-widest">
        {data.title || "PROCESS"}
      </h3>
      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-4 group">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-xl font-bold text-primary group-hover:scale-110 transition-transform">
              {step.number || (i + 1)}
            </div>
            <div className="flex-1 pt-1">
              <h4 className="text-sm font-bold text-foreground mb-2">{step.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
