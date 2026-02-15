"use client"

interface TechStackData {
  title?: string
  technologies?: Array<{ name: string; category: string; color?: string }>
}

export function TechStack({ data }: { data: TechStackData }) {
  const techs = data.technologies || []
  
  return (
    <div className="glass-panel border border-border p-8 rounded-lg space-y-6 card-glow">
      <h3 className="text-xs text-primary uppercase tracking-widest flex items-center gap-2">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
        {data.title || "TECH STACK"}
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {techs.map((tech, i) => (
          <div key={i} className="bg-background border border-border rounded p-3 hover:border-primary/30 transition-colors group">
            <div className="text-xs font-bold text-foreground mb-1">{tech.name}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{tech.category}</div>
            <div className={`h-1 w-full rounded-full mt-2 ${tech.color || 'bg-primary'} opacity-50 group-hover:opacity-100 transition-opacity`} />
          </div>
        ))}
      </div>
    </div>
  )
}
