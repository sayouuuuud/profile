"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    LayoutDashboard, Rocket, BookOpen, GraduationCap, Award, Briefcase,
    Wrench, Mail, Palette, Shield, Link2, ExternalLink, Brain, MessageSquare
} from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/landing", label: "Landing Page", icon: Rocket },
    { href: "/admin/case-studies", label: "Case Studies", icon: BookOpen },
    { href: "/admin/operations", label: "Operations", icon: Briefcase },
    { href: "/admin/certificates", label: "Certificates", icon: Award },
    { href: "/admin/education", label: "Education", icon: GraduationCap },
];

const systemItems = [
    { href: "/admin/ai-brain", label: "AI Brain", icon: Brain, special: true },
    { href: "/admin/ai-feedback", label: "AI Feedback", icon: MessageSquare },
    { href: "/admin/messages", label: "Messages", icon: Mail },
    { href: "/admin/telegram", label: "Telegram Bot", icon: Rocket },
    { href: "/admin/theme", label: "Theme Control", icon: Palette },
    { href: "/admin/datalinks", label: "Social Links", icon: Link2 },
    { href: "/admin/security", label: "Security", icon: Shield },
    { href: "/admin/maintenance", label: "Maintenance", icon: Wrench },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const supabase = createClient();
    const [topPageToday, setTopPageToday] = useState<string | null>(null);

    // جلب الصفحة الأكثر زيارة اليوم لعرضها في السايدبار
    useEffect(() => {
        async function fetchTopPage() {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const { data } = await supabase
                .from("analytics_events")
                .select("page_path")
                .gte("created_at", today.toISOString());

            if (!data?.length) return;
            const counts: Record<string, number> = {};
            data.forEach((e) => { counts[e.page_path] = (counts[e.page_path] || 0) + 1; });
            const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
            if (top) setTopPageToday(top[0]);
        }
        fetchTopPage();
        const interval = setInterval(fetchTopPage, 5 * 60 * 1000); // كل 5 دقائق
        return () => clearInterval(interval);
    }, []);

    return (
        <aside className="w-16 md:w-64 border-r border-border bg-card flex flex-col hidden md:flex relative overflow-hidden h-full">
            <ScrollArea className="flex-1 relative z-10">
                <div className="flex flex-col gap-6 p-4">
                    {/* Navigation Group */}
                    <div className="space-y-2">
                        <div className="px-4 py-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dashboard</span>
                        </div>

                        <nav className="flex flex-col gap-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-colors group ${isActive
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            }`}
                                    >
                                        <Icon className={`size-4 shrink-0 transition-colors ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                                        <span className="tracking-wide hidden md:block">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* System Group */}
                    <div className="space-y-2">
                        <div className="px-4 py-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">System</span>
                        </div>

                        <nav className="flex flex-col gap-1">
                            {systemItems.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href);
                                const Icon = item.icon;
                                const isAIBrain = item.special;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-colors group relative ${isActive
                                            ? "bg-primary/10 text-primary font-medium"
                                            : isAIBrain
                                                ? "text-primary/80 hover:bg-primary/5 hover:text-primary"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            }`}
                                    >
                                        <div className="relative shrink-0">
                                            <Icon className={`size-4 transition-colors ${isActive ? "text-primary" : isAIBrain ? "text-primary/70" : "text-muted-foreground group-hover:text-foreground"}`} />
                                            {/* نقطة نبض للـ AI Brain */}
                                            {isAIBrain && (
                                                <span className="absolute -top-0.5 -right-0.5 flex size-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60"></span>
                                                    <span className="relative inline-flex rounded-full size-2 bg-primary"></span>
                                                </span>
                                            )}
                                        </div>
                                        <span className="hidden md:block flex-1">{item.label}</span>
                                        {/* شارة الصفحة النشطة بجوار AI Brain */}
                                        {isAIBrain && topPageToday && (
                                            <span className="hidden md:block text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-mono truncate max-w-[80px]" title={topPageToday}>
                                                {topPageToday.length > 10 ? topPageToday.slice(0, 10) + "…" : topPageToday}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </ScrollArea>

            {/* Footer */}
            <div className="p-4 border-t border-border mt-auto shrink-0">
                <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2 rounded-md bg-muted/50 border border-border hover:bg-muted transition-colors group">
                    <div className="size-6 flex items-center justify-center rounded-sm bg-background border border-border group-hover:bg-background transition-colors">
                        <ExternalLink className="size-3 text-muted-foreground group-hover:text-foreground" />
                    </div>
                    <div className="flex-col hidden md:flex">
                        <span className="text-xs font-medium text-foreground">View Website</span>
                        <span className="text-[10px] text-muted-foreground">Open Public Site</span>
                    </div>
                </Link>
            </div>
        </aside>
    );
}
