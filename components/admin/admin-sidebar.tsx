"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Rocket, BookOpen, GraduationCap, Award, Briefcase,
  Wrench, Mail, Palette, Shield, Link2, Settings, LogOut
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/landing", label: "Landing Page", icon: Rocket },
  { href: "/admin/case-studies", label: "Case Studies", icon: BookOpen },
  { href: "/admin/skills", label: "Skills", icon: Wrench },
  { href: "/admin/operations", label: "Operations", icon: Briefcase },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
];

const systemItems = [
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/theme", label: "Theme Control", icon: Palette },
  { href: "/admin/datalinks", label: "Datalinks", icon: Link2 },
  { href: "/admin/security", label: "Security", icon: Shield },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-16 md:w-64 border-r border-border bg-surface-dark/50 flex-col justify-between hidden md:flex" style={{ background: "rgba(10,10,10,0.7)", backdropFilter: "blur(12px)" }}>
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-r-sm transition-all group ${
                isActive
                  ? "bg-primary/10 text-primary border-l-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5 border-l-2 border-transparent hover:border-foreground/20"
              }`}
            >
              <Icon className="size-5 shrink-0" />
              <span className="text-xs font-bold tracking-widest uppercase hidden md:block">{item.label}</span>
            </Link>
          );
        })}

        <div className="my-4 h-px bg-border w-full" />
        <div className="px-4 py-2 hidden md:block">
          <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">System</span>
        </div>

        {systemItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-r-sm transition-all group ${
                isActive
                  ? "bg-primary/10 text-primary border-l-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5 border-l-2 border-transparent"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              <span className="text-[10px] font-mono uppercase tracking-wider hidden md:block">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
          <Settings className="size-4" />
          <span className="hidden md:block">{"SETTINGS_V.2.0"}</span>
        </div>
      </div>
    </aside>
  );
}
