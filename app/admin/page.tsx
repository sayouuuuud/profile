import { createClient } from "@/lib/supabase/server";
import { Target, BarChart3, Bug, GitPullRequest, Zap, Terminal } from "lucide-react";

export default async function AdminDashboard() {
  let caseStudyCount = 0;
  let messageCount = 0;
  let caseStudies: any[] = [];
  let recentMessages: any[] = [];

  try {
    const supabase = await createClient();
    const [r1, r2, r3, r4] = await Promise.all([
      supabase.from("case_studies").select("*", { count: "exact", head: true }),
      supabase.from("messages").select("*", { count: "exact", head: true }).eq("status", "unread"),
      supabase.from("case_studies").select("*").order("sort_order").limit(4),
      supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(3),
    ]);
    caseStudyCount = r1.count || 0;
    messageCount = r2.count || 0;
    caseStudies = r3.data || [];
    recentMessages = r4.data || [];
  } catch {
    // DB not ready yet
  }

  return (
    <>
      {/* Status Bar */}
      <div className="h-14 border-b border-border flex items-center px-6 gap-8 overflow-x-auto shrink-0">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="size-2 bg-primary rounded-full animate-pulse" />
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">{"Status: Operational"}</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Active Projects:</span>
          <span className="text-sm font-mono text-foreground">{String(caseStudyCount || 0).padStart(2, "0")}</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Unread Messages:</span>
          <span className="text-sm font-mono text-amber-500">{messageCount || 0}</span>
        </div>
        <div className="flex-1" />
        <div className="text-[10px] font-mono text-primary/50 whitespace-nowrap">{"LAST SYNC: 240ms AGO"}</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-20">
          {/* Left Column - Missions */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground tracking-widest flex items-center gap-2">
                <Target className="size-5 text-primary" />
                ONGOING MISSIONS
              </h3>
            </div>
            <div className="flex-1 space-y-4">
              {(caseStudies || []).map((cs: any, i: number) => (
                <div key={cs.id} className="group relative p-5 rounded-sm border border-border hover:bg-foreground/[0.02] transition-all" style={{ background: "rgba(10,10,10,0.7)", backdropFilter: "blur(12px)" }}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="size-12 rounded bg-background border border-border flex items-center justify-center shrink-0">
                        <Target className={`size-6 ${i === 0 ? "text-primary" : i === 1 ? "text-amber-500" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-foreground tracking-wide">{cs.title.toUpperCase().replace(/ /g, "_")}</h4>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase ${
                            cs.status === "COMPLETED"
                              ? "bg-primary/20 text-primary border border-primary/30"
                              : "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                          }`}>
                            {cs.status === "COMPLETED" ? "Live" : "Dev"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground font-mono max-w-md truncate">{cs.summary}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 md:gap-8 border-t md:border-t-0 border-foreground/5 pt-3 md:pt-0 pl-0 md:pl-4 md:border-l md:border-foreground/5">
                      {cs.metrics?.slice(0, 2).map((m: any, mi: number) => (
                        <div key={mi} className="text-center">
                          <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-1">{m.label}</div>
                          <div className={`text-sm font-bold ${mi === 0 ? "text-primary" : "text-foreground"}`}>{m.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 w-full h-1 bg-surface-light rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-amber-500 relative" style={{ width: `${85 - i * 20}%` }}>
                      <div className="absolute right-0 top-0 bottom-0 w-px bg-foreground" style={{ boxShadow: "0 0 10px white" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Resources */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground tracking-widest flex items-center gap-2">
                <BarChart3 className="size-5 text-amber-500" />
                RESOURCES
              </h3>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">REAL-TIME</span>
            </div>

            {/* Resource Cards */}
            <div className="p-6 rounded-sm border border-border relative flex flex-col gap-6" style={{ background: "rgba(10,10,10,0.7)", backdropFilter: "blur(12px)" }}>
              {/* Supabase */}
              <div className="flex items-center gap-4">
                <div className="relative size-20">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path className="fill-none stroke-border" strokeWidth="2.5" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="fill-none stroke-primary" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="65, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <text x="18" y="20.35" className="fill-foreground text-[8px] font-bold" textAnchor="middle" dominantBaseline="middle">65%</text>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-sm text-foreground tracking-wide">SUPABASE</h4>
                    <span className="text-xs text-primary font-mono">{"2.4GB / 4GB"}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono mb-2">Database Storage Allocation</p>
                  <div className="flex gap-1">
                    <span className="h-1.5 w-full bg-primary rounded-sm opacity-100" />
                    <span className="h-1.5 w-full bg-primary rounded-sm opacity-100" />
                    <span className="h-1.5 w-full bg-primary rounded-sm opacity-60" />
                    <span className="h-1.5 w-full bg-surface-light rounded-sm border border-foreground/5" />
                  </div>
                </div>
              </div>

              <div className="h-px bg-foreground/5 w-full" />

              {/* Cloudinary */}
              <div className="flex items-center gap-4">
                <div className="relative size-20">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path className="fill-none stroke-border" strokeWidth="2.5" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="fill-none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="32, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <text x="18" y="20.35" className="fill-foreground text-[8px] font-bold" textAnchor="middle" dominantBaseline="middle">32%</text>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-sm text-foreground tracking-wide">CLOUDINARY</h4>
                    <span className="text-xs text-amber-500 font-mono">Bandwidth</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono mb-2">Media Delivery Network</p>
                  <div className="flex gap-1">
                    <span className="h-1.5 w-full bg-amber-500 rounded-sm opacity-100" />
                    <span className="h-1.5 w-full bg-surface-light rounded-sm border border-foreground/5" />
                    <span className="h-1.5 w-full bg-surface-light rounded-sm border border-foreground/5" />
                    <span className="h-1.5 w-full bg-surface-light rounded-sm border border-foreground/5" />
                  </div>
                </div>
              </div>

              <div className="h-px bg-foreground/5 w-full" />

              {/* Vercel Edge */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-foreground tracking-wide flex items-center gap-2">
                    <Zap className="size-3.5" /> VERCEL EDGE
                  </h4>
                  <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">OPTIMAL</span>
                </div>
                <div className="w-full bg-surface-light h-2 rounded-full overflow-hidden border border-foreground/5">
                  <div className="h-full bg-foreground w-[12%] animate-pulse" />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-muted-foreground uppercase">
                  <span>Function Invocations</span>
                  <span>{"12k / 100k"}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-sm border border-border flex flex-col items-center justify-center gap-1 hover:border-primary/50 transition-colors cursor-pointer group" style={{ background: "rgba(10,10,10,0.7)", backdropFilter: "blur(12px)" }}>
                <Bug className="size-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-2xl font-light text-foreground">0</span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Critical Bugs</span>
              </div>
              <div className="p-4 rounded-sm border border-border flex flex-col items-center justify-center gap-1 hover:border-amber-500/50 transition-colors cursor-pointer group" style={{ background: "rgba(10,10,10,0.7)", backdropFilter: "blur(12px)" }}>
                <GitPullRequest className="size-5 text-amber-500 group-hover:scale-110 transition-transform" />
                <span className="text-2xl font-light text-foreground">{messageCount || 0}</span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Unread Messages</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Log */}
      <div className="h-48 border-t border-border flex flex-col relative z-20 shrink-0" style={{ background: "rgba(10,10,10,0.7)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-foreground/5" style={{ backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-2">
            <Terminal className="size-3.5 text-muted-foreground" />
            <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">System Log</span>
          </div>
          <div className="flex gap-2">
            <div className="size-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
            <div className="size-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
            <div className="size-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
          </div>
        </div>
        <div className="flex-1 p-4 font-mono text-xs overflow-y-auto bg-black/80">
          <div className="text-muted-foreground/50 mb-1">{"Last login: Tue Oct 24 14:03:22 on ttys002"}</div>
          <div className="flex gap-2 mb-0.5">
            <span className="text-green-500">{">"}</span>
            <span className="text-blue-400">admin</span>
            <span className="text-foreground">init_dashboard_v2</span>
          </div>
          <div className="text-muted-foreground mb-2">{"Loading mission control modules... Done (0.42s)"}</div>
          <div className="flex gap-2 mb-0.5 opacity-60">
            <span className="text-muted-foreground">{"[14:05:01]"}</span>
            <span className="text-primary">INFO</span>
            <span className="text-gray-300">{"Fetching project states from Supabase..."}</span>
          </div>
          <div className="flex gap-2 mb-0.5 opacity-60">
            <span className="text-muted-foreground">{"[14:05:02]"}</span>
            <span className="text-primary">INFO</span>
            <span className="text-gray-300">{"All systems "}<span className="text-green-400">ACTIVE</span></span>
          </div>
          {(recentMessages || []).map((msg: any, i: number) => (
            <div key={msg.id} className="flex gap-2 mb-0.5 opacity-60">
              <span className="text-muted-foreground">{`[${new Date(msg.created_at).toLocaleTimeString().slice(0, 5)}]`}</span>
              <span className="text-amber-500">MSG</span>
              <span className="text-gray-300">{`New message from ${msg.name}: "${msg.subject || "No subject"}"`}</span>
            </div>
          ))}
          <div className="flex gap-2 mt-2">
            <span className="text-green-500">{">"}</span>
            <span className="text-blue-400">admin</span>
            <span className="text-foreground animate-pulse">_</span>
          </div>
        </div>
      </div>
    </>
  );
}
