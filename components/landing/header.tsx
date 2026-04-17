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
          ? "bg-background/95 backdrop-blur-sm border-border"
          : "bg-transparent border-transparent"
      }`}
    >
      {/* Logo/Brand */}
      <Link href="/" className="text-foreground hover:text-accent transition-colors font-serif font-light text-sm uppercase tracking-label">
        SE / TPM
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-10">
        {links.map((link) => (
          <a
            key={link.href}
            className="text-sm uppercase tracking-label font-mono text-muted hover:text-accent transition-colors"
            href={link.href}
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* CTA */}
      <Link
        href="/case-studies"
        className="btn-secondary"
      >
        Portfolio
        <ArrowUpRight className="h-3 w-3" />
      </Link>

      {/* Mobile menu button */}
      <button
        className="md:hidden text-muted hover:text-accent transition-colors"
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
        <div className="absolute top-full left-0 right-0 bg-background border-b border-border p-6 flex flex-col gap-4 md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              className="text-sm uppercase tracking-label font-mono text-muted hover:text-accent transition-colors"
              href={link.href}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/case-studies"
            className="btn-secondary"
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
