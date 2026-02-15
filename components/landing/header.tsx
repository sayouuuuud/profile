"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#about", label: "About" },
    { href: "#work", label: "Work" },
    { href: "#process", label: "Process" },
    { href: "#experience", label: "Experience" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header
      className={`relative z-50 flex items-center justify-between whitespace-nowrap px-6 md:px-12 py-5 sticky top-0 transition-all duration-500 ${
        scrolled
          ? "glass-panel border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <Link href="/" className="flex items-center gap-3 text-foreground">
        <div className="h-7 w-7 rounded-md bg-emerald/10 border border-emerald/20 flex items-center justify-center">
          <span className="text-emerald text-xs font-bold">SE</span>
        </div>
        <span className="text-foreground text-sm font-semibold tracking-wide">
          Sayed Elshazly
        </span>
      </Link>

      <div className="flex items-center gap-8">
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <Link
          href="/case-studies"
          className="hidden md:flex items-center justify-center rounded-lg bg-emerald hover:bg-emerald-dim transition-colors text-background text-sm font-medium h-9 px-5"
        >
          Case Studies
        </Link>
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 glass-panel border-b border-border p-6 flex flex-col gap-4 md:hidden z-50">
          {links.map((link) => (
            <a
              key={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm py-2"
              href={link.href}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/case-studies"
            className="flex items-center justify-center rounded-lg bg-emerald text-background text-sm font-medium h-9 px-5 mt-2"
            onClick={() => setMobileOpen(false)}
          >
            Case Studies
          </Link>
        </div>
      )}
    </header>
  );
}
