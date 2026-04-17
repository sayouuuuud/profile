"use client"

import { Send, Loader2, CheckCircle, Linkedin, Github, Mail, ArrowRight } from "lucide-react"
import { useState } from "react"
import { ScrollReveal } from "@/components/scroll-reveal"

interface SocialLink {
  id: string
  platform: string
  url: string
}

function getSocialIcon(platform: string) {
  const p = platform.toLowerCase()
  if (p.includes("linkedin")) return Linkedin
  if (p.includes("github")) return Github
  return Mail
}

export function ContactSection({ socials }: { socials: SocialLink[] }) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setError("")

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to send message.")
      } else {
        setSent(true)
        setFormState({ name: "", email: "", subject: "", message: "" })
      }
    } catch {
      setError("Network error. Please try again.")
    }

    setSending(false)
  }

  return (
    <section id="contact" className="px-6 md:px-12 py-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <ScrollReveal>
          <div className="mb-20">
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-xs tracking-[0.2em] uppercase font-space-grotesk text-emerald/50">04 / CONTACT</span>
              <div className="flex-1 h-px bg-emerald/10" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-cinzel text-foreground mb-6">
              Let's work together
            </h2>
            <p className="text-lg text-foreground/60 max-w-2xl leading-relaxed font-light">
              Interested in discussing product strategy, building scalable systems, or exploring new opportunities? Get in touch.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          {sent ? (
            <div className="flex flex-col items-center justify-center py-20 border border-emerald/20">
              <div className="mb-4">
                <CheckCircle className="h-12 w-12 text-emerald" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2 font-cinzel">Message received</h3>
              <p className="text-foreground/60 text-center max-w-sm">
                Thanks for reaching out. I'll review your message and get back to you soon.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-8 text-sm uppercase tracking-[0.1em] font-space-grotesk text-foreground/60 hover:text-emerald transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs uppercase tracking-[0.15em] font-space-grotesk text-foreground/60 block mb-3">Name</label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full border-b border-foreground/20 bg-transparent py-3 text-foreground focus:border-emerald focus:outline-none transition-colors placeholder:text-foreground/30 font-light"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.15em] font-space-grotesk text-foreground/60 block mb-3">Email</label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full border-b border-foreground/20 bg-transparent py-3 text-foreground focus:border-emerald focus:outline-none transition-colors placeholder:text-foreground/30 font-light"
                    placeholder="you@example.com"
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.15em] font-space-grotesk text-foreground/60 block mb-3">Subject</label>
                <input
                  type="text"
                  value={formState.subject}
                  onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                  className="w-full border-b border-foreground/20 bg-transparent py-3 text-foreground focus:border-emerald focus:outline-none transition-colors placeholder:text-foreground/30 font-light"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.15em] font-space-grotesk text-foreground/60 block mb-3">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full border-b border-foreground/20 bg-transparent py-3 text-foreground focus:border-emerald focus:outline-none transition-colors resize-none placeholder:text-foreground/30 font-light"
                  placeholder="Tell me about your project or opportunity..."
                />
              </div>

              {error && (
                <div className="text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between pt-6 border-t border-foreground/10">
                <div className="flex gap-3">
                  {socials.map((s) => {
                    const Icon = getSocialIcon(s.platform)
                    return (
                      <a
                        key={s.id}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground/40 hover:text-emerald transition-colors"
                        aria-label={s.platform}
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    )
                  })}
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="text-sm uppercase tracking-[0.1em] font-space-grotesk text-foreground hover:text-emerald disabled:opacity-50 transition-colors"
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          )}
        </ScrollReveal>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="w-full border-t border-emerald/10 mt-24 py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          {/* Brand statement */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-space-grotesk text-emerald/60">Sayed Elshazly</h4>
            <p className="text-sm text-foreground/70 leading-relaxed font-light max-w-xs">
              Technical Product Manager. Building products that bridge strategy and execution.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-space-grotesk text-emerald/60">Navigation</h4>
            <ul className="space-y-2">
              {[
                { href: "#work", label: "Work" },
                { href: "#experience", label: "Experience" },
                { href: "#contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-foreground/60 hover:text-emerald transition-colors font-light">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-space-grotesk text-emerald/60">Connect</h4>
            <div className="flex gap-3">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground/60 hover:text-emerald transition-colors">LinkedIn</a>
              <span className="text-foreground/20">·</span>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground/60 hover:text-emerald transition-colors">GitHub</a>
              <span className="text-foreground/20">·</span>
              <a href="mailto:hello@example.com" className="text-sm text-foreground/60 hover:text-emerald transition-colors">Email</a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-emerald/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-foreground/40 font-mono">
          <span>© 2025 Sayed Elshazly</span>
          <span>TPM • Product Strategy • Execution</span>
        </div>
      </div>
    </footer>
  )
}
