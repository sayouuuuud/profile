"use client";

import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
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
    { href: "#work", label: "Work" },
    { href: "#experience", label: "Experience" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header
      className={`relative z-50 flex items-center justify-between px-6 md:px-12 py-6 sticky top-0 transition-all duration-500 border-b ${
        scrolled
          ? "bg-background/95 backdrop-blur-sm border-emerald/10"
          : "bg-transparent border-transparent"
      }`}
    >
      {/* Logo/Brand */}
      <Link href="/" className="text-foreground hover:text-emerald transition-colors font-cinzel font-bold text-sm uppercase tracking-[0.15em]">
        SE / TPM
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-10">
        {links.map((link) => (
          <a
            key={link.href}
            className="text-sm uppercase tracking-[0.1em] font-space-grotesk text-foreground/60 hover:text-emerald transition-colors"
            href={link.href}
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* CTA */}
      <Link
        href="/case-studies"
        className="hidden md:inline-flex items-center gap-2 px-4 py-2 border border-foreground/20 hover:border-emerald text-foreground/60 hover:text-emerald text-xs uppercase tracking-[0.1em] font-space-grotesk transition-all duration-300"
      >
        Portfolio
        <ArrowUpRight className="h-3 w-3" />
      </Link>

      {/* Mobile menu button */}
      <button
        className="md:hidden text-foreground/60 hover:text-emerald transition-colors"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-background border-b border-emerald/10 p-6 flex flex-col gap-4 md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              className="text-sm uppercase tracking-[0.1em] font-space-grotesk text-foreground/60 hover:text-emerald transition-colors"
              href={link.href}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 px-4 py-2 border border-foreground/20 hover:border-emerald text-foreground/60 hover:text-emerald text-xs uppercase tracking-[0.1em] font-space-grotesk transition-all"
            onClick={() => setMobileOpen(false)}
          >
            Portfolio
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </header>
  );
}
