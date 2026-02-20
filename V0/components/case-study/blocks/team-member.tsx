"use client"

interface TeamMemberData {
  name?: string
  role?: string
  avatar_url?: string
  bio?: string
  skills?: string[]
}

export function TeamMember({ data }: { data: TeamMemberData }) {
  return (
    <div className="glass-panel border border-border p-6 rounded-lg hover:border-primary/30 transition-all group card-glow">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          {data.avatar_url ? (
            <img src={data.avatar_url} alt={data.name} className="w-16 h-16 rounded-lg border-2 border-primary object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-2xl text-primary">
              {data.name?.charAt(0) || "?"}
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <div>
            <h4 className="text-sm font-bold text-foreground">{data.name || "Team Member"}</h4>
            <div className="text-xs text-primary uppercase tracking-wider">{data.role || "Role"}</div>
          </div>
          {data.bio && (
            <p className="text-xs text-muted-foreground leading-relaxed">{data.bio}</p>
          )}
          {data.skills && data.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="px-2 py-1 bg-primary/10 border border-primary/30 rounded text-[10px] text-primary">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
