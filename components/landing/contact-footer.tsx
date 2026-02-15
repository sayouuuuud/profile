"use client"

import { Send, Loader2, CheckCircle, Linkedin, Github, Mail } from "lucide-react"
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
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-10 bg-emerald/40" />
              <span className="text-xs text-emerald tracking-widest uppercase">Contact</span>
              <div className="h-px w-10 bg-emerald/40" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Let's Talk
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Interested in working together? I'd love to hear about your product challenges and how I can help.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="glass-panel rounded-xl p-6 md:p-8 card-glow">
            {sent ? (
              <div className="flex flex-col items-center justify-center gap-4 py-12">
                <div className="h-12 w-12 rounded-full bg-emerald/10 border border-emerald/20 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-emerald" />
                </div>
                <h4 className="text-lg font-semibold text-foreground">Message Sent</h4>
                <p className="text-sm text-muted-foreground text-center">
                  Thanks for reaching out. I'll get back to you within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-4 px-5 py-2 border border-border text-foreground text-sm rounded-lg hover:border-emerald/30 transition-colors"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-muted-foreground font-medium">Name</label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="Your name"
                      className="bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:border-emerald/50 focus:outline-none focus:ring-1 focus:ring-emerald/20 transition-all placeholder:text-muted-foreground/40"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-muted-foreground font-medium">Email</label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="you@example.com"
                      className="bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:border-emerald/50 focus:outline-none focus:ring-1 focus:ring-emerald/20 transition-all placeholder:text-muted-foreground/40"
                      suppressHydrationWarning
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-muted-foreground font-medium">Subject</label>
                  <input
                    type="text"
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    placeholder="What's this about?"
                    className="bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:border-emerald/50 focus:outline-none focus:ring-1 focus:ring-emerald/20 transition-all placeholder:text-muted-foreground/40"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-muted-foreground font-medium">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Tell me about your project or opportunity..."
                    className="bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:border-emerald/50 focus:outline-none focus:ring-1 focus:ring-emerald/20 transition-all resize-none placeholder:text-muted-foreground/40"
                  />
                </div>

                {error && (
                  <div className="px-4 py-2.5 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs">
                    {error}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 mt-1">
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald hover:bg-emerald-dim text-background font-medium py-3 px-6 rounded-lg transition-colors text-sm disabled:opacity-50"
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {sending ? "Sending..." : "Send Message"}
                  </button>
                </div>

                {/* Social links */}
                {socials.length > 0 && (
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground">Or find me on</span>
                    <div className="flex gap-2">
                      {socials.map((s) => {
                        const Icon = getSocialIcon(s.platform)
                        return (
                          <a
                            key={s.id}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:border-emerald/30 hover:bg-emerald/5 transition-all group"
                            aria-label={s.platform}
                          >
                            <Icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-emerald transition-colors" />
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
    <footer className="w-full border-t border-border py-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
        <span>
          {"© 2025 Sayed Elshazly. All rights reserved."}
        </span>
        <span>
          Technical Product Manager
        </span>
      </div>
    </footer>
  )
}
