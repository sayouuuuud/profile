"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Rocket, BookOpen, GraduationCap, Award, Briefcase,
  Wrench, Mail, Palette, Shield, Link2, Settings
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
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/theme", label: "Theme Control", icon: Palette },
  { href: "/admin/datalinks", label: "Social Links", icon: Link2 },
  { href: "/admin/security", label: "Security", icon: Shield },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-16 md:w-64 border-r border-border bg-black/95 flex flex-col justify-between hidden md:flex relative overflow-hidden">
      {/* Tech background accents */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_2px,transparent_2px),linear-gradient(90deg,rgba(18,18,18,0)_2px,transparent_2px)] bg-[size:20px_20px] opacity-20 pointer-events-none" />

      <div className="flex flex-col gap-6 p-4 relative z-10">
        {/* Navigation Group */}
        <div className="space-y-1">
          <div className="px-4 py-2 mb-2 flex items-center gap-2">
            <div className="h-1 w-1 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] text-emerald-500/70 uppercase tracking-[0.2em] font-mono">Operations</span>
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm transition-all group relative overflow-hidden ${isActive
                    ? "text-emerald-400 bg-emerald-950/20"
                    : "text-muted-foreground hover:text-emerald-100 hover:bg-emerald-950/10"
                    }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  )}
                  <Icon className={`size-4 shrink-0 transition-colors ${isActive ? "text-emerald-400" : "text-muted-foreground/70 group-hover:text-emerald-300"}`} />
                  <span className={`tracking-wide ${isActive ? "font-semibold" : "font-medium"}`}>{item.label}</span>
                  {isActive && (
                    <div className="absolute right-2 size-1.5 rounded-full bg-emerald-500/50 blur-[2px]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* System Group */}
        <div className="space-y-1">
          <div className="px-4 py-2 mb-2 flex items-center gap-2">
            <div className="h-px w-3 bg-emerald-500/30" />
            <span className="text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em] font-mono">System</span>
            <div className="h-px w-full bg-emerald-500/10" />
          </div>

          <nav className="flex flex-col gap-1">
            {systemItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 text-xs transition-all group relative ${isActive
                    ? "text-emerald-400 bg-emerald-950/20"
                    : "text-muted-foreground/70 hover:text-emerald-200 hover:bg-emerald-950/10"
                    }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-emerald-500/50" />
                  )}
                  <Icon className={`size-3.5 shrink-0 transition-colors ${isActive ? "text-emerald-400" : "text-muted-foreground/60 group-hover:text-emerald-300"}`} />
                  <span className="uppercase tracking-wider">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/5 relative z-10 bg-black/40">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground/50 font-mono">
            <span>VERSION 2.4.0</span>
            <span>SECURE</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded bg-emerald-950/10 border border-emerald-500/10">
            <div className="relative">
              <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
              <div className="absolute inset-0 bg-emerald-500/50 rounded-full blur-[4px] animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-emerald-500 tracking-wider">SYSTEM ONLINE</span>
              <span className="text-[9px] text-emerald-500/50 tracking-tight">LATENCY: 12ms</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
