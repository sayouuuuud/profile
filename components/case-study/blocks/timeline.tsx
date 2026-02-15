"use client"

const statusStyles: Record<string, { dot: string; badge: string; text: string }> = {
  completed: { dot: "bg-primary shadow-[0_0_8px_hsl(var(--primary))]", badge: "text-primary border-primary/30 bg-primary/10", text: "DONE" },
  "in-progress": { dot: "bg-amber-400 shadow-[0_0_8px_#fbbf24] animate-pulse", badge: "text-amber-400 border-amber-400/30 bg-amber-400/10", text: "ACTIVE" },
  pending: { dot: "bg-muted-foreground", badge: "text-muted-foreground border-muted-foreground/30 bg-muted/50", text: "PENDING" },
}

export function TimelineBlock({ data }: { data: any }) {
  const milestones = data.milestones || []
  return (
    <div className="glass-panel p-8 rounded-lg border border-border relative h-full card-glow">
      <h3 className="text-sm font-bold text-foreground uppercase tracking-widest mb-8 flex items-center gap-3">
        <span className="size-1.5 bg-primary rounded-full" />
        {data.title || "ROADMAP"}
      </h3>
      <div className="relative">
        <div className="absolute left-[11px] top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-border to-transparent" />
        <div className="space-y-8">
          {milestones.map((m: any, i: number) => {
            const style = statusStyles[m.status] || statusStyles.pending
            return (
              <div key={i} className="relative flex items-start gap-6 pl-8">
                <div className={`absolute left-[7px] top-1.5 size-2.5 rounded-full ${style.dot} z-10`} />
                <div className="flex-1 bg-background/50 border border-border rounded p-4 hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-foreground">{m.title}</h4>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${style.badge}`}>{style.text}</span>
                  </div>
                  <div className="text-[10px] text-primary/60 mb-1">{m.date}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{m.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
