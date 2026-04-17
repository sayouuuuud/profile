"use client";

import Link from "next/link";
import { Menu, X, Sparkles } from "lucide-react";
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
          ? "glass-panel border-b border-emerald/10 backdrop-blur-md"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <Link href="/" className="flex items-center gap-3 text-foreground hover:text-emerald transition-colors duration-300 group">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald/20 to-emerald/5 border border-emerald/30 flex items-center justify-center group-hover:border-emerald/60 transition-colors duration-300">
          <span className="text-emerald font-bold text-xs font-cinzel">SE</span>
        </div>
        <span className="text-foreground text-sm font-semibold tracking-wide font-space-grotesk hidden sm:inline">
          Sayed Elshazly
        </span>
      </Link>

      <div className="flex items-center gap-8">
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link, i) => (
            <a
              key={link.href}
              className="relative text-muted-foreground hover:text-foreground transition-colors text-sm font-space-grotesk font-medium group"
              href={link.href}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-emerald to-emerald/0 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>
        <Link
          href="/case-studies"
          className="button-premium hidden md:flex items-center justify-center rounded-lg bg-emerald hover:bg-emerald/90 text-background text-sm font-medium h-10 px-6 gap-2 shadow-lg shadow-emerald/20 hover:shadow-emerald/40 transition-all duration-300 group font-space-grotesk"
        >
          <span>Case Studies</span>
          <Sparkles className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
        </Link>
        <button
          className="md:hidden text-foreground hover:text-emerald transition-colors"
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
        <div className="absolute top-full left-0 right-0 glass-panel border-b border-emerald/10 p-6 flex flex-col gap-4 md:hidden z-50 animate-slide-up">
          {links.map((link, i) => (
            <a
              key={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm py-2 font-space-grotesk hover:translate-x-1 transition-transform duration-300"
              style={{ animationDelay: `${i * 50}ms` }}
              href={link.href}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/case-studies"
            className="button-premium flex items-center justify-center rounded-lg bg-emerald text-background text-sm font-medium h-10 px-5 mt-2 gap-2 font-space-grotesk"
            onClick={() => setMobileOpen(false)}
          >
            Case Studies
            <Sparkles className="h-4 w-4" />
          </Link>
        </div>
      )}
    </header>
  );
}
