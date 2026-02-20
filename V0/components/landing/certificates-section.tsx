"use client"

import { useRef } from "react"
import { Award, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"

interface Certificate {
  id: string;
  title: string;
  issuer: string | null;
  issue_date: string | null;
  credential_id: string | null;
  category: string | null;
}

export function CertificatesSection({ certificates }: { certificates: Certificate[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: number) => {
    scrollRef.current?.scrollBy({ left: direction * 650, behavior: "smooth" });
  };

  return (
    <section className="px-6 md:px-12 py-24 bg-[#02040a] border-y border-border relative overflow-hidden" id="validations">
      <div className="absolute inset-0 bg-parchment-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <ScrollReveal className="relative z-10">
        <div className="flex flex-col mb-16">
          <div className="flex items-center gap-6 mb-2">
            <h2 className="text-4xl font-black text-foreground tracking-[0.05em] uppercase glow-text">
              SYSTEM_VALIDATIONS
            </h2>
          <div className="h-px bg-border flex-1" />
          <div className="hidden md:flex items-center gap-3">
            <span className="text-xs font-mono text-gold tracking-widest uppercase">
              {"// ARCHITECTURAL_PARCHMENT_EDITION"}
            </span>
            <div className="flex items-center gap-2 text-[10px] text-emerald-light font-mono">
              <span className="w-1 h-1 bg-emerald-light rounded-full" />
              VERIFIED
            </div>
          </div>
        </div>
          <div className="text-text-dim font-mono text-xs tracking-[0.2em] uppercase">
            {"// High-Fidelity Credentials Database"}
          </div>
        </div>
      </ScrollReveal>

      <div className="relative w-full">
        <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-[#02040a] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-[#02040a] to-transparent z-20 pointer-events-none" />

        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-8 pb-12 pt-4 px-6 md:px-12 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {certificates.map((cert) => (
            <div key={cert.id} className="flex-none w-[85vw] md:w-[650px] snap-center">
              <div className="relative bg-[#060b14] border border-gold/30 rounded-sm p-1 shadow-[0_0_40px_rgba(0,0,0,0.6)] group h-full">
                {/* Gold corner markers */}
                <div className="absolute -top-px -left-px w-5 h-5 border-t border-l border-gold" />
                <div className="absolute -top-px -right-px w-5 h-5 border-t border-r border-gold" />
                <div className="absolute -bottom-px -left-px w-5 h-5 border-b border-l border-gold" />
                <div className="absolute -bottom-px -right-px w-5 h-5 border-b border-r border-gold" />

                <div className="relative h-full bg-surface-dark border border-foreground/5 p-6 md:p-10 flex flex-col md:flex-row gap-8 items-center md:items-stretch overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-[#02040a] opacity-50 pointer-events-none" />

                  {/* Icon + serial */}
                  <div className="flex-shrink-0 flex flex-col items-center justify-center gap-6 md:border-r border-foreground/10 md:pr-10 relative z-10">
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border border-gold/40 flex items-center justify-center bg-[#02040a] shadow-[0_0_20px_rgba(212,175,55,0.15)] group-hover:shadow-[0_0_35px_rgba(212,175,55,0.3)] transition-all duration-700">
                      <Award className="h-12 w-12 md:h-14 md:w-14 text-gold-dim" />
                    </div>
                    <div className="text-[10px] font-mono text-gold tracking-[0.3em] uppercase text-center leading-relaxed">
                      Serial No.<br />
                      <span className="text-foreground">{cert.credential_id || `CERT-${cert.id.slice(0, 8).toUpperCase()}`}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between w-full relative z-10 text-center md:text-left">
                    <div>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-6">
                        <span className="text-[10px] font-mono text-emerald-light tracking-[0.25em] uppercase flex items-center justify-center md:justify-start gap-2">
                          <ShieldCheck className="h-3.5 w-3.5" /> AUTHENTICATED
                        </span>
                        <span className="text-[10px] font-mono text-text-dim uppercase tracking-widest">
                          {"ISSUED: " + (cert.issue_date || "N/A")}
                        </span>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-serif-display text-foreground mb-3 leading-tight glow-gold">
                        {cert.title}
                      </h3>
                      <p className="text-sm font-light text-gray-400 font-mono tracking-[0.15em] uppercase mb-8">
                        {"FIELD: " + (cert.category || "PROFESSIONAL")}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-8 border-t border-foreground/10 pt-6 mt-auto">
                      <div>
                        <span className="block text-[9px] text-text-dim uppercase tracking-widest mb-1 font-mono">VALIDATED BY</span>
                        <span className="block text-sm text-foreground font-serif-display tracking-widest uppercase">
                          {cert.issuer || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[9px] text-text-dim uppercase tracking-widest mb-1 font-mono">STATUS</span>
                        <span className="block text-sm text-emerald-light font-bold tracking-[0.2em] uppercase">ACTIVE</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-6 mt-8 relative z-20">
        <button
          onClick={() => scroll(-1)}
          className="w-14 h-14 rounded-full border border-gold/30 bg-[#060b14] flex items-center justify-center text-gold hover:text-foreground hover:border-emerald hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-300"
          aria-label="Previous certificate"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => scroll(1)}
          className="w-14 h-14 rounded-full border border-gold/30 bg-[#060b14] flex items-center justify-center text-gold hover:text-foreground hover:border-emerald hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-300"
          aria-label="Next certificate"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
