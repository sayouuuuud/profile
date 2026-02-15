import { createClient } from "@/lib/supabase/server";
import { Target, Mail, Award, Briefcase, Activity, Calendar, Database, LayoutTemplate, Link2, Plus, Terminal, Eye, Zap, Bug, GitPullRequest } from "lucide-react";
import { DashboardStatCard } from "@/components/admin/dashboard-stat-card";
import { DashboardChart } from "@/components/admin/dashboard-chart";
import { CloudDiagnosticWidget } from "@/components/admin/cloud-diagnostic-widget";
import { AnalyticsSection } from "@/components/admin/analytics-section";
import { Suspense } from "react";
import Link from "next/link";

export default async function AdminDashboard() {
  let caseStudyCount = 0;
  let messageCount = 0;
  let unreadMessageCount = 0;
  let certCount = 0;
  let opsCount = 0;
  let linkCount = 0;
  let recentMessages: any[] = [];
  let recentActivity: any[] = [];

  try {
    const supabase = await createClient();
    const [
      r1, r2, r3, r4, r5, r6, r7, r8
    ] = await Promise.all([
      supabase.from("case_studies").select("*", { count: "exact", head: true }),
      supabase.from("messages").select("*", { count: "exact", head: true }),
      supabase.from("messages").select("*", { count: "exact", head: true }).eq("status", "unread"),
      supabase.from("certificates").select("*", { count: "exact", head: true }),
      supabase.from("operations").select("*", { count: "exact", head: true }),
      supabase.from("social_links").select("*", { count: "exact", head: true }),
      supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(5),
      supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(5)
    ]);

    caseStudyCount = r1.count || 0;
    messageCount = r2.count || 0;
    unreadMessageCount = r3.count || 0;
    certCount = r4.count || 0;
    opsCount = r5.count || 0;
    linkCount = r6.count || 0;
    recentMessages = r7.data || [];
    recentActivity = r8.error ? [] : (r8.data || []);

  } catch (error) {
    console.error("Dashboard fetch error:", error);
  }

  const contentData = [
    { label: "Case Studies", value: caseStudyCount, color: "var(--primary)" }, // neon-cyan
    { label: "Operations", value: opsCount, color: "#f59e0b" }, // amber-500
    { label: "Certificates", value: certCount, color: "#10b981" }, // emerald-500
    { label: "Social Links", value: linkCount, color: "#3b82f6" }, // blue-500
  ];

  return (
    <>
      {/* Status Bar */}
      <div className="h-14 border-b border-border flex items-center px-6 gap-8 overflow-x-auto shrink-0 bg-background/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="size-2 bg-primary rounded-full animate-pulse" />
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{"Status: Operational"}</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-xs text-muted-foreground uppercase tracking-widest">System Load:</span>
          <span className="text-sm text-foreground">12%</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Database:</span>
          <span className="text-sm text-emerald-500">Connected</span>
        </div>
        <div className="flex-1" />
        <div className="text-[10px] text-primary/50 whitespace-nowrap">{"LAST SYNC: JUST NOW"}</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6 pb-20">

        {/* Row 1: KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardStatCard
            label="Total Missions"
            value={caseStudyCount}
            icon={Target}
            trend="+1 this month"
            trendUp={true}
            description="Active case studies"
          />
          <DashboardStatCard
            label="Transmissions"
            value={unreadMessageCount}
            icon={Mail}
            trend={unreadMessageCount > 0 ? "Action Required" : "All clear"}
            trendUp={unreadMessageCount === 0}
            description="Unread messages"
          />
          <DashboardStatCard
            label="Credentials"
            value={certCount}
            icon={Award}
            description="Certificates & Awards"
          />
          <DashboardStatCard
            label="Experience"
            value={opsCount}
            icon={Briefcase}
            description="Timeline Entries"
          />
        </div>

        {/* Row 2: Analytics Section */}
        <Suspense fallback={<div className="h-[500px] w-full bg-surface-dark/50 rounded-xl animate-pulse border border-border" />}>
          <AnalyticsSection />
        </Suspense>

        {/* Row 3: Messages & System */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Messages */}
          <div className="rounded-xl border border-border bg-surface-dark/50 p-5 flex flex-col h-[400px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Intercepted Transmissions</h3>
              <Link href="/admin/messages" className="text-[10px] text-primary hover:underline uppercase tracking-widest flex items-center gap-1">
                View All <Eye className="size-3" />
              </Link>
            </div>

            <div className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
              {recentMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-xs border border-dashed border-border rounded-lg bg-surface/30">
                  <Mail className="size-8 mb-2 opacity-50" />
                  No messages intercepted
                </div>
              ) : (
                recentMessages.map((msg) => (
                  <div key={msg.id} className="group flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`size-2 rounded-full shrink-0 ${msg.status === "unread" ? "bg-primary" : "bg-muted-foreground/30"}`} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm truncate ${msg.status === "unread" ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                            {msg.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground/50 hidden sm:inline-block">
                            {new Date(msg.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{msg.subject || "No Subject"}</p>
                      </div>
                    </div>
                    <Link href="/admin/messages" className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-muted-foreground hover:text-primary">
                      <Eye className="size-4" />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* System Status */}
          <div className="h-[400px]">
            <CloudDiagnosticWidget />
          </div>
        </div>

        {/* Row 4: Recent Activity */}
        <div className="rounded-xl border border-border bg-black/40 backdrop-blur-md overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-white/5">
            <div className="flex items-center gap-2">
              <Terminal className="size-4 text-muted-foreground" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">System Audit Log</span>
            </div>
            <div className="flex gap-1.5">
              <div className="size-2 rounded-full bg-red-500/20 border border-red-500/50" />
              <div className="size-2 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
              <div className="size-2 rounded-full bg-green-500/20 border border-green-500/50" />
            </div>
          </div>
          <div className="p-4 font-mono text-xs space-y-1 h-40 overflow-y-auto">
            <div className="text-muted-foreground/50 mb-2">{"Last login: " + new Date().toDateString() + " as root"}</div>
            {recentActivity.length === 0 ? (
              <>
                <div className="flex gap-2 opacity-60">
                  <span className="text-muted-foreground">[{new Date().toLocaleTimeString()}]</span>
                  <span className="text-primary">INFO</span>
                  <span className="text-muted-foreground">System initialized. No recent audit events found.</span>
                </div>
                <div className="flex gap-2 opacity-60">
                  <span className="text-muted-foreground">[{new Date().toLocaleTimeString()}]</span>
                  <span className="text-emerald-500">READY</span>
                  <span className="text-muted-foreground">Monitoring active...</span>
                </div>
              </>
            ) : (
              recentActivity.map((log, i) => (
                <div key={i} className="flex gap-2 opacity-80">
                  <span className="text-muted-foreground">[{new Date(log.created_at).toLocaleTimeString()}]</span>
                  <span className={log.type === 'ERROR' ? "text-red-500" : log.type === 'WARN' ? "text-amber-500" : "text-emerald-500"}>
                    {log.type || "INFO"}
                  </span>
                  <span className="text-gray-300">{log.description || log.action}</span>
                </div>
              ))
            )}
            <div className="flex gap-2 mt-2">
              <span className="text-emerald-500">{">"}</span>
              <span className="text-blue-400">admin</span>
              <span className="text-foreground animate-pulse">_</span>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
