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
      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-1 w-10 bg-gradient-to-r from-emerald/0 to-emerald rounded-full" />
              <span className="text-xs text-emerald tracking-widest uppercase font-space-grotesk font-medium">Let's Connect</span>
              <div className="h-1 w-10 bg-gradient-to-l from-emerald/0 to-emerald rounded-full" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-cinzel">
              Ready to Collaborate
            </h2>
            <p className="text-muted-foreground text-base max-w-lg mx-auto leading-relaxed font-light">
              Interested in working together? I'd love to hear about your product challenges and how I can help drive impact.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="glass-panel rounded-xl p-6 md:p-10 card-glow relative overflow-hidden">
            {/* Premium background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald/5 via-transparent to-emerald/5 pointer-events-none" />
            
            {sent ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 relative z-10">
                <div className="h-14 w-14 rounded-full bg-emerald/10 border border-emerald/30 flex items-center justify-center animate-fade-scale">
                  <CheckCircle className="h-7 w-7 text-emerald" />
                </div>
                <h4 className="text-xl font-semibold text-foreground font-cinzel">Message Sent</h4>
                <p className="text-sm text-muted-foreground text-center max-w-xs">
                  Thanks for reaching out. I'll get back to you within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-6 px-6 py-2.5 border border-emerald/30 text-foreground text-sm rounded-lg hover:border-emerald/60 hover:bg-emerald/5 transition-all font-space-grotesk font-medium"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-muted-foreground font-space-grotesk font-medium uppercase tracking-wide">Name</label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="Your name"
                      className="bg-background/50 border border-emerald/20 rounded-lg px-4 py-3 text-sm text-foreground focus:border-emerald/50 focus:outline-none focus:ring-1 focus:ring-emerald/20 transition-all placeholder:text-muted-foreground/40 font-light"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-muted-foreground font-space-grotesk font-medium uppercase tracking-wide">Email</label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="you@example.com"
                      className="bg-background/50 border border-emerald/20 rounded-lg px-4 py-3 text-sm text-foreground focus:border-emerald/50 focus:outline-none focus:ring-1 focus:ring-emerald/20 transition-all placeholder:text-muted-foreground/40 font-light"
                      suppressHydrationWarning
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs text-muted-foreground font-space-grotesk font-medium uppercase tracking-wide">Subject</label>
                  <input
                    type="text"
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    placeholder="What's this about?"
                    className="bg-background/50 border border-emerald/20 rounded-lg px-4 py-3 text-sm text-foreground focus:border-emerald/50 focus:outline-none focus:ring-1 focus:ring-emerald/20 transition-all placeholder:text-muted-foreground/40 font-light"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs text-muted-foreground font-space-grotesk font-medium uppercase tracking-wide">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Tell me about your project or opportunity..."
                    className="bg-background/50 border border-emerald/20 rounded-lg px-4 py-3 text-sm text-foreground focus:border-emerald/50 focus:outline-none focus:ring-1 focus:ring-emerald/20 transition-all resize-none placeholder:text-muted-foreground/40 font-light leading-relaxed"
                  />
                </div>

                {error && (
                  <div className="px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs font-light animate-slide-up">
                    {error}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <button
                    type="submit"
                    disabled={sending}
                    className="button-premium flex-1 flex items-center justify-center gap-2 bg-emerald hover:bg-emerald/90 text-background font-medium py-3 px-6 rounded-lg transition-all text-sm disabled:opacity-50 font-space-grotesk group"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>

                {/* Social links */}
                {socials.length > 0 && (
                  <div className="flex items-center gap-4 pt-6 border-t border-emerald/10">
                    <span className="text-xs text-muted-foreground font-light">Or connect on</span>
                    <div className="flex gap-3">
                      {socials.map((s) => {
                        const Icon = getSocialIcon(s.platform)
                        return (
                          <a
                            key={s.id}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-9 w-9 rounded-lg border border-emerald/20 flex items-center justify-center hover:border-emerald/60 hover:bg-emerald/10 transition-all duration-300 group"
                            aria-label={s.platform}
                          >
                            <Icon className="h-4 w-4 text-muted-foreground group-hover:text-emerald transition-colors" />
                          </a>
                        )
                      })}
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="w-full border-t border-emerald/10 py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-emerald/20 to-emerald/5 border border-emerald/30 flex items-center justify-center">
                <span className="text-emerald font-bold text-xs font-cinzel">SE</span>
              </div>
              <span className="font-semibold text-foreground font-space-grotesk">Sayed Elshazly</span>
            </div>
            <p className="text-xs text-muted-foreground font-light">
              Technical Product Manager | Strategy & Execution
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs text-foreground font-space-grotesk font-medium uppercase tracking-wide mb-4">Navigation</h4>
            <ul className="space-y-2">
              {[
                { href: "#about", label: "About" },
                { href: "#work", label: "Work" },
                { href: "#process", label: "Process" },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-xs text-muted-foreground hover:text-foreground transition-colors font-light">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs text-foreground font-space-grotesk font-medium uppercase tracking-wide mb-4">Get In Touch</h4>
            <a href="#contact" className="inline-flex items-center gap-2 text-xs text-emerald hover:text-emerald/80 transition-colors font-light">
              Start a conversation
              <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="border-t border-emerald/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground font-light">
          <span>
            {"© 2025 Sayed Elshazly. All rights reserved."}
          </span>
          <span className="flex items-center gap-4">
            <span>Technical Product Manager</span>
            <span>•</span>
            <span>Product Strategy & Execution</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
