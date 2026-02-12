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
    <div className="glass-panel border border-[#1f2937] p-6 rounded-sm hover:border-[#10b981]/30 transition-all group">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {data.avatar_url ? (
            <img src={data.avatar_url} alt={data.name} className="w-16 h-16 rounded-sm border-2 border-[#10b981] object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-sm bg-[#10b981]/10 border-2 border-[#10b981]/30 flex items-center justify-center text-2xl text-[#10b981]">
              {data.name?.charAt(0) || "?"}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-2">
          <div>
            <h4 className="text-sm font-bold text-white">{data.name || "Team Member"}</h4>
            <div className="text-xs font-mono text-[#10b981] uppercase tracking-wider">{data.role || "Role"}</div>
          </div>
          
          {data.bio && (
            <p className="text-xs text-[#6b7280] leading-relaxed">{data.bio}</p>
          )}
          
          {data.skills && data.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="px-2 py-1 bg-[#10b981]/10 border border-[#10b981]/30 rounded text-[10px] font-mono text-[#10b981]">
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
