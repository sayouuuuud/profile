"use client"

export function CodeTerminalBlock({ data }: { data: any }) {
  const lines = data.content || []
  return (
    <div className="bg-black rounded-xl border border-border font-mono text-xs overflow-hidden shadow-2xl relative flex flex-col h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#10b981]/50 to-transparent opacity-50" />
      {/* Title bar */}
      <div className="bg-[#121212]/80 backdrop-blur-md px-4 py-3 border-b border-border flex items-center justify-between relative z-20">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <div className="size-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
            <div className="size-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
            <div className="size-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
          </div>
          <span className="text-[#6b7280] font-mono text-[10px] md:text-xs">{data.filename}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-[#10b981] animate-pulse" />
          <span className="text-[10px] text-[#10b981]/70 font-bold tracking-wider">{data.lang}</span>
        </div>
      </div>
      {/* Code body */}
      <div className="p-6 md:p-8 text-gray-300 leading-loose relative z-20 bg-black/60 backdrop-blur-sm flex overflow-x-auto flex-1">
        <div className="pr-4 border-r border-white/5 text-[#6b7280]/30 select-none flex flex-col text-right text-[10px] leading-loose shrink-0">
          {Array.from({ length: 15 }, (_, i) => (<span key={i}>{i + 1}</span>))}
        </div>
        <div className="pl-4">
          <pre className="text-xs">{lines.map((line: any, i: number) => {
            switch (line.type) {
              case "bracket": return <span key={i}><span className="text-[#10b981]">{line.text}</span>{"\n"}</span>
              case "line": return <span key={i}>{"  "}<span className="text-blue-400">{`"${line.key}"`}</span>: <span className="text-emerald-400">{`"${line.value}"`}</span>{i < lines.length - 2 ? "," : ""}{"\n"}</span>
              case "object_start": return <span key={i}>{"  "}<span className="text-blue-400">{`"${line.key}"`}</span>: <span className="text-[#10b981]">{"{"}</span>{"\n"}</span>
              case "kv": return <span key={i}>{"    "}<span className="text-blue-400">{`"${line.key}"`}</span>: <span className="text-emerald-400">{`"${line.value}"`}</span>,{"\n"}</span>
              case "object_end": return <span key={i}>{"  "}<span className="text-[#10b981]">{"}"}</span>,{"\n"}</span>
              case "array_start": return <span key={i}>{"  "}<span className="text-blue-400">{`"${line.key}"`}</span>: <span className="text-[#10b981]">[</span>{"\n"}</span>
              case "array_item": return <span key={i}>{"    "}<span className="text-emerald-400">{`"${line.value}"`}</span>,{"\n"}</span>
              case "array_end": return <span key={i}>{"  "}<span className="text-[#10b981]">]</span>,{"\n"}</span>
              default: return null
            }
          })}</pre>
        </div>
      </div>
    </div>
  )
}
