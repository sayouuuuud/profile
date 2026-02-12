"use client";

import Link from "next/link";
import { Terminal, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "#brief", label: "Brief" },
    { href: "#capabilities", label: "Skills" },
    { href: "#operations", label: "Timeline" },
    { href: "#validations", label: "Certifications" },
    { href: "#education", label: "Education" },
    { href: "#arsenal", label: "Arsenal" },
  ];

  return (
    <header className="relative z-50 flex items-center justify-between whitespace-nowrap border-b border-border px-6 md:px-12 py-6 glass-panel sticky top-0">
      <div className="flex items-center gap-4 text-foreground">
        <Terminal className="h-5 w-5 text-emerald animate-pulse" />
        <h2 className="text-foreground text-lg font-bold leading-tight tracking-[0.1em]">
          SAYED ELSHAZLY
        </h2>
        <span className="hidden md:block h-4 w-px bg-border mx-2" />
        <span className="hidden md:block text-xs font-mono text-emerald/80">
          ONLINE
        </span>
      </div>
      <div className="flex items-center gap-8">
        <nav className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <a
              key={link.href}
              className="text-foreground/70 hover:text-foreground transition-colors text-xs font-mono uppercase tracking-[0.2em]"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <Link
          href="/case-studies"
          className="hidden md:flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-sm bg-foreground hover:bg-foreground/80 transition-colors text-background text-xs font-bold h-9 px-5 tracking-widest uppercase"
        >
          Projects
        </Link>
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#050505] border-b border-border p-6 flex flex-col gap-4 md:hidden z-50">
          {links.map((link) => (
            <a
              key={link.href}
              className="text-foreground/70 hover:text-foreground transition-colors text-xs font-mono uppercase tracking-[0.2em] py-2"
              href={link.href}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/case-studies"
            className="flex items-center justify-center rounded-sm bg-foreground text-background text-xs font-bold h-9 px-5 tracking-widest uppercase mt-2"
            onClick={() => setMobileOpen(false)}
          >
            Projects
          </Link>
        </div>
      )}
    </header>
  );
}
