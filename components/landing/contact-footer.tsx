"use client"

import { Mail, User, Code, Send, Loader2, CheckCircle } from "lucide-react"
import { useState } from "react"
import { ScrollReveal } from "@/components/scroll-reveal"

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export function ContactSection({ socials }: { socials: SocialLink[] }) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to send message.");
      } else {
        setSent(true);
        setFormState({ name: "", email: "", subject: "", message: "" });
      }
    } catch {
      setError("Network error. Please try again.");
    }

    setSending(false);
  }

  return (
    <section id="contact" className="px-6 md:px-12 py-16 grid lg:grid-cols-2 gap-12 items-start">
      {/* Code block */}
      <ScrollReveal>
      <div className="bg-black rounded-sm border border-border font-mono text-xs overflow-hidden shadow-2xl relative group h-full flex flex-col transition-all duration-300 hover:border-emerald/30">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent pointer-events-none z-10" />
        <div className="bg-surface-light/80 backdrop-blur-md px-4 py-3 border-b border-border flex items-center justify-between relative z-20">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <div className="size-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
              <div className="size-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
              <div className="size-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
            </div>
            <span className="text-text-dim font-mono text-[10px] md:text-xs">
              ~/root/professional_certifications.json
            </span>
          </div>
        </div>
        <div className="p-8 text-gray-300 leading-loose overflow-x-auto relative z-20 flex-1 bg-black/60 backdrop-blur-sm">
          <div className="absolute left-0 top-0 bottom-0 w-10 border-r border-foreground/5 bg-foreground/[0.02] flex flex-col items-end pt-8 pr-3 text-text-dim/30 select-none">
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>
          <div className="pl-8">
            <pre className="text-sm leading-loose">
              <span className="text-emerald">{"{"}</span>{"\n"}
              {"  "}<span className="text-blue-400">{'"certifications"'}</span>: <span className="text-emerald">{"["}</span>{"\n"}
              {"    "}<span className="text-emerald-light">{'"Agile Explorer (IBM)"'}</span>,{"\n"}
              {"    "}<span className="text-emerald-light">{'"Practical Product Owner"'}</span>,{"\n"}
              {"    "}<span className="text-emerald-light">{'"WE Professional Certificate"'}</span>{"\n"}
              {"  "}<span className="text-emerald">{"]"}</span>,{"\n"}
              {"  "}<span className="text-blue-400">{'"methodologies"'}</span>: <span className="text-emerald">{"["}</span>{"\n"}
              {"    "}<span className="text-emerald-light">{'"Agile/Scrum"'}</span>,{"\n"}
              {"    "}<span className="text-emerald-light">{'"Kanban"'}</span>,{"\n"}
              {"    "}<span className="text-emerald-light">{'"Lean Product Development"'}</span>{"\n"}
              {"  "}<span className="text-emerald">{"]"}</span>{"\n"}
              <span className="text-emerald">{"}"}</span>
            </pre>
          </div>
        </div>
      </div>
      </ScrollReveal>

      {/* Contact uplink with form */}
      <ScrollReveal delay={200}>
      <div className="h-full flex flex-col bg-surface-dark/40 backdrop-blur-xl border border-border rounded-sm overflow-hidden relative group hover:border-emerald/30 transition-all duration-500">
        <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-foreground/5 bg-foreground/[0.02]">
          <div className="flex items-center gap-3">
            <div className="size-2 bg-emerald rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
            <h3 className="text-xs font-mono font-bold tracking-[0.3em] text-foreground">
              CONTACT_UPLINK
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald/50 tracking-widest">DIRECT TRANSMISSION</span>
        </div>

        <div className="relative z-10 flex-1 p-6">
          {sent ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-12">
              <CheckCircle className="size-12 text-emerald" />
              <h4 className="text-lg font-bold text-foreground tracking-widest">TRANSMISSION SENT</h4>
              <p className="text-sm text-muted-foreground text-center font-mono">
                Message received. Response incoming within 24h.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-4 px-6 py-2 border border-border text-foreground text-xs font-mono uppercase tracking-widest rounded-sm hover:border-emerald/50 transition-colors"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Name</label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="Your name"
                    className="bg-background border border-border rounded-sm px-3 py-2.5 text-sm text-foreground font-mono focus:border-emerald focus:outline-none transition-colors placeholder:text-muted-foreground/40"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Email</label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="you@example.com"
                    className="bg-background border border-border rounded-sm px-3 py-2.5 text-sm text-foreground font-mono focus:border-emerald focus:outline-none transition-colors placeholder:text-muted-foreground/40"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Subject</label>
                <input
                  type="text"
                  value={formState.subject}
                  onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                  placeholder="Mission briefing topic"
                  className="bg-background border border-border rounded-sm px-3 py-2.5 text-sm text-foreground font-mono focus:border-emerald focus:outline-none transition-colors placeholder:text-muted-foreground/40"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Message</label>
                <textarea
                  required
                  rows={4}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="Your message..."
                  className="bg-background border border-border rounded-sm px-3 py-2.5 text-sm text-foreground font-mono focus:border-emerald focus:outline-none transition-colors resize-none placeholder:text-muted-foreground/40"
                />
              </div>

              {error && (
                <div className="px-3 py-2 rounded-sm bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background font-bold py-3 px-6 rounded-sm hover:bg-foreground/80 transition-colors uppercase tracking-widest text-xs disabled:opacity-50"
                >
                  {sending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                  {sending ? "Transmitting..." : "Send Transmission"}
                </button>
                <div className="flex gap-2">
                  {socials.slice(0, 2).map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-surface-dark border border-foreground/10 text-foreground py-3 px-4 rounded-sm hover:border-emerald/50 transition-colors uppercase tracking-widest text-xs text-center flex items-center justify-center gap-2 group"
                    >
                      {s.platform === "LinkedIn" ? <User className="h-3.5 w-3.5 group-hover:text-emerald" /> : <Code className="h-3.5 w-3.5 group-hover:text-emerald" />}
                      {s.platform}
                    </a>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
      </ScrollReveal>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-surface-dark py-12">
      <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-xs text-text-dim font-mono">
        <div className="flex items-center gap-3 tracking-[0.1em]">
          <span className="size-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
          SYSTEM STATUS: OPTIMAL
        </div>
        <div className="mt-4 md:mt-0 tracking-[0.2em]">
          {"© 2024 SAYED ELSHAZLY // ARCHITECT COMMAND CENTER"}
        </div>
      </div>
    </footer>
  );
}
