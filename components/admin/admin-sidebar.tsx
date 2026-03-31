"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard, Rocket, BookOpen, GraduationCap, Award, Briefcase,
  Wrench, Mail, Palette, Shield, Link2, ExternalLink, Bot
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/landing", label: "Landing Page", icon: Rocket },
  { href: "/admin/case-studies", label: "Case Studies", icon: BookOpen },
  { href: "/admin/operations", label: "Operations", icon: Briefcase },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
];

const systemItems = [
  { href: "/admin/ai-feedback", label: "AI Feedback", icon: Bot },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/telegram", label: "Telegram Bot", icon: Rocket },
  { href: "/admin/theme", label: "Theme Control", icon: Palette },
  { href: "/admin/datalinks", label: "Social Links", icon: Link2 },
  { href: "/admin/security", label: "Security", icon: Shield },
  { href: "/admin/maintenance", label: "Maintenance", icon: Wrench },
];

export function AdminSidebar() {
  const pathname = usePathname();

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
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-colors group relative ${isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                  >
                    <Icon className={`size-4 shrink-0 transition-colors ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                    <span className="hidden md:block">{item.label}</span>
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
