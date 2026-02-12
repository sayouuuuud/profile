"use client"
import { Database, Network, Upload, Cpu, Code, Rocket } from "lucide-react"

function NodeIcon({ type }: { type: string }) {
  switch (type) {
    case "vercel": return <svg className="size-5 text-white" fill="white" viewBox="0 0 24 24"><path d="M24 22.525H0l12-21.05 12 21.05z" /></svg>
    case "database": return <Database className="size-5 text-emerald-500" />
    case "streaming": return <Network className="size-5 text-indigo-400" />
    case "upload": return <Upload className="size-5 text-rose-400" />
    case "code": return <Code className="size-5 text-white" />
    case "rocket": return <Rocket className="size-5 text-white" />
    default: return <Cpu className="size-5 text-white" />
  }
}

const nodePositions = [
  "top-[10%] left-[5%] md:left-[10%] md:top-[15%]",
  "top-[10%] right-[5%] md:right-[10%] md:top-[15%]",
  "bottom-[10%] left-[5%] md:left-[10%] md:bottom-[15%]",
  "bottom-[10%] right-[5%] md:right-[10%] md:bottom-[15%]",
]

const colorMap: Record<string, string> = {
  emerald: "text-emerald-500", indigo: "text-indigo-400", rose: "text-rose-400",
  red: "text-red-400", blue: "text-blue-400", yellow: "text-yellow-400", orange: "text-orange-400",
}

export function ArchitectureDiagramBlock({ data }: { data: any }) {
  const nodes = data.nodes || []
  return (
    <div className="border border-[#1f2937] bg-[#121212]/50 rounded-xl p-1 relative overflow-hidden min-h-[600px]">
      <div className="absolute top-6 left-8 z-20">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">INFRASTRUCTURE ARCHITECTURE</h3>
        <p className="text-[10px] text-[#6b7280] font-mono">Hybrid Storage Engine & Serverless Edge</p>
      </div>
      <div className="relative w-full h-[600px] md:h-[650px] flex items-center justify-center bg-[#050505]/80 rounded-lg overflow-hidden">
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-50" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gradLine" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" style={{ stopColor: "#10b981", stopOpacity: 0 }} />
              <stop offset="50%" style={{ stopColor: "#10b981", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#10b981", stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          {[
            { x2: "20%", y2: "25%", delay: "0s" }, { x2: "80%", y2: "25%", delay: "0.5s" },
            { x2: "20%", y2: "75%", delay: "1s" }, { x2: "80%", y2: "75%", delay: "1.5s" },
          ].map((line, i) => (
            <g key={i}>
              <line stroke="#1f2937" strokeWidth="1" x1="50%" y1="50%" x2={line.x2} y2={line.y2} />
              <line className="opacity-60" stroke="url(#gradLine)" strokeWidth="1" strokeDasharray="10" x1="50%" y1="50%" x2={line.x2} y2={line.y2}>
                <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" begin={line.delay} repeatCount="indefinite" />
              </line>
            </g>
          ))}
        </svg>

        {/* Center Node */}
        <div className="absolute z-20 flex flex-col items-center justify-center group cursor-pointer transform hover:scale-105 transition-transform duration-300">
          <div className="relative size-32 rounded-full border border-[#10b981]/30 bg-[#050505] flex items-center justify-center" style={{ boxShadow: "0 0 15px rgba(16,185,129,0.15)" }}>
            <div className="absolute inset-0 rounded-full border border-[#10b981] opacity-20 animate-ping" />
            <div className="absolute inset-2 rounded-full border border-dashed border-[#10b981]/50 animate-[spin_10s_linear_infinite]" />
            <div className="flex flex-col items-center z-10 text-center">
              <svg className="size-8 text-white mb-2" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="nmask" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180"><circle cx="90" cy="90" r="90" fill="white" /></mask>
                <g mask="url(#nmask)"><circle cx="90" cy="90" r="90" fill="black" /><path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="white" /><rect x="115" y="54" width="12" height="72" fill="white" /></g>
              </svg>
              <div className="text-sm font-bold tracking-widest text-[#10b981]">NEXT.JS 16</div>
              <div className="text-[9px] font-mono text-[#6b7280] mt-1">APP ROUTER</div>
            </div>
          </div>
        </div>

        {/* Corner Nodes */}
        {nodes.map((node: any, i: number) => (
          <div key={i} className={`absolute ${nodePositions[i] || ""} z-10 w-64 hidden md:block`}>
            <div className="bg-[#0a0a0a] border border-[#1f2937] p-4 rounded hover:border-[#10b981]/50 transition-colors relative group">
              <div className="absolute -top-px -left-px w-2 h-2 border-t border-l border-[#10b981]" />
              <div className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-[#10b981]" />
              <div className="flex items-center gap-4 mb-4">
                <div className="size-10 bg-white/5 rounded flex items-center justify-center border border-white/10">
                  <NodeIcon type={node.icon_type || "code"} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">{node.title}</h3>
                  <p className={`text-[9px] font-mono ${colorMap[node.color] || "text-[#10b981]"}`}>{node.sub}</p>
                </div>
              </div>
              <div className="space-y-2 text-[10px] font-mono text-gray-500">
                {(node.stats || []).map((s: any, si: number) => (
                  <div key={si} className={`flex justify-between ${si === 0 ? "border-b border-white/5 pb-2" : "pt-1"}`}>
                    <span>{s.l}</span>
                    <span className={s.v_color === "emerald-500" ? "text-emerald-500" : s.v_color === "rose-400" ? "text-rose-400 font-bold" : "text-gray-300"}>{s.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Mobile */}
        <div className="md:hidden absolute bottom-4 w-full px-4 flex gap-2 overflow-x-auto snap-x">
          {nodes.map((node: any, i: number) => (
            <div key={i} className="snap-center shrink-0 w-4/5 bg-[#0a0a0a] border border-[#1f2937] p-3 rounded">
              <h3 className="text-xs font-bold text-white">{node.title}</h3>
              <p className={`text-[9px] ${colorMap[node.color] || "text-[#10b981]"}`}>{node.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
