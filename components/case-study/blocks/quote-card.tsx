"use client"

interface QuoteCardData {
  quote?: string
  author?: string
  role?: string
  company?: string
  avatar_url?: string
}

export function QuoteCard({ data }: { data: QuoteCardData }) {
  return (
    <div className="glass-panel border-l-4 border-[#10b981] bg-[#0a0a0a]/50 p-8 rounded-sm relative">
      {/* Quote icon */}
      <svg className="absolute top-4 right-4 w-12 h-12 text-[#10b981] opacity-10" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>

      <div className="relative space-y-6">
        <p className="text-base text-white leading-relaxed font-light italic">
          "{data.quote || "This solution transformed our workflow completely."}"
        </p>
        
        <div className="flex items-center gap-4 pt-4 border-t border-[#1f2937]">
          {data.avatar_url && (
            <img src={data.avatar_url} alt={data.author} className="w-12 h-12 rounded-full border-2 border-[#10b981]" />
          )}
          <div>
            <div className="text-sm font-bold text-white">{data.author || "Client Name"}</div>
            <div className="text-xs text-[#6b7280] font-mono">
              {data.role || "Role"} {data.company && `• ${data.company}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
