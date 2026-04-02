"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    Brain, RefreshCw, TrendingUp, Globe,
    Eye, ChevronDown, ChevronUp, Zap,
    MessageSquare, Calendar, Activity, AlertCircle,
    Lightbulb, Search, BarChart2, Send, Sparkles, User, Bot
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

type AiMemory = {
    id: string;
    type: "observation" | "weekly_report" | "pattern" | "insight";
    title: string;
    content: string;
    data: any;
    week_start: string;
    week_end: string;
    created_at: string;
};

type LiveStats = {
    today_visits: number;
    today_visitors: number;
    top_page_today: string;
    active_now: number;
};

type ChatMessage = {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
};

function HealthBar({ score }: { score: number }) {
    const color = score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-red-500";
    return (
        <div className="w-full bg-border/40 rounded-full h-2 overflow-hidden">
            <div className={`h-2 rounded-full transition-all duration-1000 ${color}`} style={{ width: `${score}%` }} />
        </div>
    );
}

function MemoryCard({ item, isExpanded, onToggle }: { item: AiMemory; isExpanded: boolean; onToggle: () => void }) {
    const typeConfig = {
        weekly_report: { label: "تقرير أسبوعي", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5", icon: BarChart2 },
        observation: { label: "ملاحظة", color: "text-blue-400 border-blue-500/30 bg-blue-500/5", icon: Eye },
        pattern: { label: "نمط", color: "text-purple-400 border-purple-500/30 bg-purple-500/5", icon: Activity },
        insight: { label: "رؤية", color: "text-amber-400 border-amber-500/30 bg-amber-500/5", icon: Lightbulb },
    };
    const cfg = typeConfig[item.type] || typeConfig.observation;
    const Icon = cfg.icon;
    const report = item.type === "weekly_report" ? item.data : null;

    return (
        <div className={`border rounded-xl transition-all ${cfg.color} ${isExpanded ? "shadow-lg" : ""}`}>
            <button onClick={onToggle} className="w-full flex items-start gap-4 p-5 text-right">
                <div className={`p-2 rounded-lg border mt-0.5 ${cfg.color}`}><Icon className="size-4" /></div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${cfg.color}`}>{cfg.label}</span>
                        {item.week_start && (
                            <span className="text-[10px] text-muted-foreground">
                                {new Date(item.week_start).toLocaleDateString("ar-EG")} → {new Date(item.week_end).toLocaleDateString("ar-EG")}
                            </span>
                        )}
                    </div>
                    <h3 className="text-sm font-bold text-foreground mt-2 leading-snug text-right">{item.title || "بدون عنوان"}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 text-right leading-relaxed">{item.content}</p>
                </div>
                <div className="shrink-0 text-muted-foreground mt-1">
                    {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                </div>
            </button>

            {isExpanded && (
                <div className="px-5 pb-5 space-y-4 border-t border-current/10 pt-4">
                    <p className="text-sm text-foreground/80 leading-relaxed text-right">{item.content}</p>
                    {report && (
                        <>
                            {report.health_score !== undefined && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">صحة الموقع</span>
                                        <span className="text-sm font-bold text-foreground">{report.health_score}/100</span>
                                    </div>
                                    <HealthBar score={report.health_score} />
                                    {report.health_note && <p className="text-xs text-muted-foreground text-right">{report.health_note}</p>}
                                </div>
                            )}
                            {report.observations?.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5"><Eye className="size-3" /> الملاحظات</h4>
                                    <ul className="space-y-2">
                                        {report.observations.map((obs: string, i: number) => (
                                            <li key={i} className="text-xs text-foreground/80 bg-background/50 rounded-md p-2.5 border border-border/50 text-right leading-relaxed">{obs}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {report.interests_detected?.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5"><Search className="size-3" /> ما اهتم به الزوار</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {report.interests_detected.map((interest: string, i: number) => (
                                            <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{interest}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {report.recommended_actions?.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5"><AlertCircle className="size-3" /> توصيات للمراجعة فقط</h4>
                                    <ul className="space-y-1.5">
                                        {report.recommended_actions.map((action: string, i: number) => (
                                            <li key={i} className="text-xs text-foreground/70 flex gap-2 items-start text-right">
                                                <span className="text-amber-500 shrink-0 mt-0.5">•</span>{action}
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="text-[10px] text-muted-foreground/60 italic text-right">⚠️ هذه اقتراحات للمراجعة فقط — الذكاء الاصطناعي لا يتخذ أي قرار</p>
                                </div>
                            )}
                            {report.raw_analytics && (
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5"><BarChart2 className="size-3" /> الإحصائيات الخام</h4>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { label: "زيارة", val: report.raw_analytics.overview?.totalVisits ?? 0 },
                                            { label: "زائر فريد", val: report.raw_analytics.overview?.uniqueVisitors ?? 0 },
                                            { label: "رسالة", val: report.raw_analytics.overview?.newMessages ?? 0 },
                                        ].map((s, i) => (
                                            <div key={i} className="text-center p-2 bg-background/50 rounded border border-border/50">
                                                <p className="text-lg font-bold text-foreground">{s.val}</p>
                                                <p className="text-[10px] text-muted-foreground">{s.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {report.raw_analytics.topPages?.length > 0 && (
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-muted-foreground">أكثر الصفحات زيارة:</p>
                                            {report.raw_analytics.topPages.slice(0, 5).map((p: any, i: number) => (
                                                <div key={i} className="flex items-center justify-between text-xs py-1">
                                                    <span className="text-muted-foreground font-mono truncate max-w-[70%]">{p.path}</span>
                                                    <span className="text-foreground font-bold">{p.visits}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                    <p className="text-[10px] text-muted-foreground text-right pt-2 border-t border-current/10">
                        {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: ar })}
                    </p>
                </div>
            )}
        </div>
    );
}

const SUGGESTED_QUESTIONS = [
    "ما الصفحة الأكثر زيارة هذا الأسبوع؟",
    "من أين يأتي معظم الزوار؟",
    "كيف صحة الموقع الآن؟",
    "ما الذي يهتم به الزوار أكثر؟",
    "هل هناك نشاط غير عادي؟",
    "ما أوقات الذروة في الزيارات؟",
];

function ChatPanel() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "أهلاً بك! أنا AI Brain، أسكن في موقعك وأرى كل ما يحدث. اسألني أي شيء عن الموقع والزوار والإحصائيات. 🧠",
            timestamp: new Date(),
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || loading) return;
        const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: text.trim(), timestamp: new Date() };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);
        try {
            const history = messages.filter((m) => m.id !== "welcome").map((m) => ({ role: m.role, content: m.content }));
            const res = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text.trim(), history }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed");
            setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: data.reply, timestamp: new Date() }]);
        } catch (e: any) {
            setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: `❌ حدث خطأ: ${e.message}`, timestamp: new Date() }]);
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
    };

    return (
        <div className="flex flex-col h-[600px] border border-border rounded-xl overflow-hidden bg-card/30">
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                        <div className={`shrink-0 size-8 rounded-full flex items-center justify-center border ${msg.role === "user" ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted border-border text-muted-foreground"}`}>
                            {msg.role === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
                        </div>
                        <div className={`max-w-[80%] space-y-1 ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
                            <div
                                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-primary text-background rounded-tr-sm" : "bg-muted/50 border border-border/50 text-foreground rounded-tl-sm"}`}
                                style={{ direction: "rtl", textAlign: "right" }}
                            >
                                {msg.content}
                            </div>
                            <span className="text-[10px] text-muted-foreground/60 px-1">
                                {msg.timestamp.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex gap-3 flex-row">
                        <div className="shrink-0 size-8 rounded-full flex items-center justify-center border bg-muted border-border text-muted-foreground">
                            <Bot className="size-4" />
                        </div>
                        <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-muted/50 border border-border/50">
                            <div className="flex gap-1 items-center h-4">
                                <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {messages.length <= 1 && (
                <div className="px-4 pb-3 flex gap-2 flex-wrap justify-end" dir="rtl">
                    {SUGGESTED_QUESTIONS.map((q, i) => (
                        <button key={i} onClick={() => sendMessage(q)} className="text-[11px] px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors">
                            {q}
                        </button>
                    ))}
                </div>
            )}

            <div className="shrink-0 border-t border-border p-4" dir="rtl">
                <div className="flex gap-3 items-end">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="اسأل عن الزوار، الصفحات، الإحصائيات..."
                        rows={1}
                        className="flex-1 resize-none bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                        style={{ direction: "rtl", maxHeight: "120px" }}
                        onInput={(e) => {
                            const el = e.currentTarget;
                            el.style.height = "auto";
                            el.style.height = Math.min(el.scrollHeight, 120) + "px";
                        }}
                        disabled={loading}
                    />
                    <button
                        onClick={() => sendMessage(input)}
                        disabled={!input.trim() || loading}
                        className="shrink-0 size-11 flex items-center justify-center rounded-xl bg-primary text-background hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {loading ? <RefreshCw className="size-4 animate-spin" /> : <Send className="size-4" />}
                    </button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 text-right">Enter للإرسال • Shift+Enter لسطر جديد</p>
            </div>
        </div>
    );
}

export default function AIBrainPage() {
    const supabase = createClient();
    const [memories, setMemories] = useState<AiMemory[]>([]);
    const [liveStats, setLiveStats] = useState<LiveStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [activeTab, setActiveTab] = useState<"chat" | "all" | "reports" | "observations">("chat");
    const [lastAnalyzed, setLastAnalyzed] = useState<string | null>(null);

    const loadMemories = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase.from("ai_memory").select("*").order("created_at", { ascending: false }).limit(50);
        setMemories(data || []);
        const latestReport = data?.find((m) => m.type === "weekly_report");
        if (latestReport) { setLastAnalyzed(latestReport.created_at); setExpandedIds(new Set([latestReport.id])); }
        setLoading(false);
    }, []);

    const loadLiveStats = useCallback(async () => {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
        const todayISO = today.toISOString();
        const [{ count: todayVisits }, { data: visitorsRaw }, { data: pagesRaw }, { data: recentRaw }] = await Promise.all([
            supabase.from("analytics_events").select("id", { count: "exact", head: true }).gte("created_at", todayISO),
            supabase.from("analytics_events").select("visitor_id").gte("created_at", todayISO),
            supabase.from("analytics_events").select("page_path").gte("created_at", todayISO),
            supabase.from("analytics_events").select("visitor_id").gte("created_at", fiveMinAgo),
        ]);
        const uniqueToday = new Set(visitorsRaw?.map((v) => v.visitor_id)).size;
        const pageCounts: Record<string, number> = {};
        pagesRaw?.forEach((e) => { pageCounts[e.page_path] = (pageCounts[e.page_path] || 0) + 1; });
        const topPageToday = Object.entries(pageCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "/";
        const activeNow = new Set(recentRaw?.map((v) => v.visitor_id)).size;
        setLiveStats({ today_visits: todayVisits || 0, today_visitors: uniqueToday, top_page_today: topPageToday, active_now: activeNow });
    }, []);

    const triggerAnalysis = async () => {
        setAnalyzing(true);
        try {
            const res = await fetch("/api/ai/analyze-site", { method: "POST" });
            if (!res.ok) throw new Error("Analysis failed");
            await loadMemories();
        } catch (e) { console.error(e); }
        finally { setAnalyzing(false); }
    };

    useEffect(() => {
        loadMemories(); loadLiveStats();
        const interval = setInterval(loadLiveStats, 60000);
        return () => clearInterval(interval);
    }, [loadMemories, loadLiveStats]);

    const reportsCount = memories.filter((m) => m.type === "weekly_report").length;
    const filteredMemories = memories.filter((m) => {
        if (activeTab === "reports") return m.type === "weekly_report";
        if (activeTab === "observations") return m.type === "observation";
        return true;
    });

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8" dir="rtl">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20"><Brain className="size-6 text-primary" /></div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">AI Brain</h1>
                            <p className="text-sm text-muted-foreground">دماغ الموقع — يراقب، يحلل، ويبلغ</p>
                        </div>
                    </div>
                    {lastAnalyzed && <p className="text-xs text-muted-foreground pr-1">آخر تحليل: {formatDistanceToNow(new Date(lastAnalyzed), { addSuffix: true, locale: ar })}</p>}
                </div>
                <button onClick={triggerAnalysis} disabled={analyzing} className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-background font-bold text-sm rounded-lg transition-colors disabled:opacity-60">
                    {analyzing ? <><RefreshCw className="size-4 animate-spin" /> جاري التحليل...</> : <><Zap className="size-4" /> ابدأ تحليل الآن</>}
                </button>
            </div>

            {/* إحصائيات حية */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: "زيارات اليوم", value: liveStats?.today_visits ?? "…", icon: TrendingUp, color: "text-emerald-400" },
                    { label: "زوار فريدون", value: liveStats?.today_visitors ?? "…", icon: Globe, color: "text-blue-400" },
                    { label: "نشط الآن", value: liveStats?.active_now ?? "…", icon: Activity, color: "text-green-400", pulse: (liveStats?.active_now ?? 0) > 0 },
                    { label: "تقارير محفوظة", value: reportsCount, icon: Calendar, color: "text-purple-400" },
                ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="p-4 rounded-xl border border-border bg-card/50 space-y-2">
                            <div className="flex items-center justify-between">
                                <Icon className={`size-4 ${stat.color}`} />
                                {(stat as any).pulse && <span className="relative flex size-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex rounded-full size-2 bg-green-500" /></span>}
                            </div>
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* الصفحة النشطة */}
            {liveStats?.top_page_today && (
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-3">
                    <Eye className="size-4 text-emerald-400 shrink-0" />
                    <div>
                        <p className="text-xs text-muted-foreground">أكثر صفحة زيارة اليوم</p>
                        <p className="text-sm font-bold text-foreground font-mono">{liveStats.top_page_today}</p>
                    </div>
                    <div className="mr-auto text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">صفحة نشطة</div>
                </div>
            )}

            {/* التبويبات */}
            <div>
                <div className="flex gap-1 border-b border-border mb-6">
                    {[
                        { id: "chat", label: "💬 شات مباشر" },
                        { id: "all", label: `الكل (${memories.length})` },
                        { id: "reports", label: `التقارير (${reportsCount})` },
                        { id: "observations", label: `الملاحظات (${memories.filter(m => m.type === "observation").length})` },
                    ].map((tab) => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === "chat" && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Sparkles className="size-4 text-primary" />
                            <span>الذكاء الاصطناعي يعرف بيانات موقعك الحالية ويرد بالعربي</span>
                        </div>
                        <ChatPanel />
                        <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 flex gap-2 items-start">
                            <AlertCircle className="size-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-muted-foreground">الذكاء الاصطناعي يراقب ويحلل فقط — لا يتخذ أي قرار ولا يعدل أي بيانات</p>
                        </div>
                    </div>
                )}

                {activeTab !== "chat" && (
                    <>
                        {loading && <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-24 bg-muted/20 rounded-xl border border-border animate-pulse" />)}</div>}
                        {!loading && filteredMemories.length === 0 && (
                            <div className="text-center py-16 space-y-3">
                                <Brain className="size-12 text-muted-foreground/20 mx-auto" />
                                <p className="text-muted-foreground text-sm">الذاكرة فارغة</p>
                                <p className="text-xs text-muted-foreground/60">اضغط "ابدأ تحليل الآن" لإنشاء أول تقرير</p>
                            </div>
                        )}
                        <div className="space-y-3">
                            {filteredMemories.map((item) => (
                                <MemoryCard key={item.id} item={item} isExpanded={expandedIds.has(item.id)}
                                    onToggle={() => setExpandedIds((prev) => {
                                        const next = new Set(prev);
                                        if (next.has(item.id)) next.delete(item.id); else next.add(item.id);
                                        return next;
                                    })} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
