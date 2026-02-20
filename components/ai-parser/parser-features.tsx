"use client"

import { motion } from "framer-motion"
import {
  MessageSquare,
  Github,
  Mic,
  Shield,
  Clock,
  Brain,
} from "lucide-react"

const features = [
  {
    icon: MessageSquare,
    title: "Natural Language Input",
    description:
      "Describe your project in plain text - Arabic or English. The AI understands context and extracts structured data.",
  },
  {
    icon: Github,
    title: "GitHub Auto-Analysis",
    description:
      "Paste a repo URL and the parser reads package.json, README, and project structure to identify the full tech stack.",
  },
  {
    icon: Mic,
    title: "Voice-to-Project",
    description:
      "Record a voice note describing your project. Speech-to-text plus AI parsing creates a complete project entry.",
  },
  {
    icon: Brain,
    title: "Smart Confidence Scoring",
    description:
      "Each parse includes a confidence score. Low confidence triggers follow-up questions to fill gaps.",
  },
  {
    icon: Shield,
    title: "Draft & Approve Flow",
    description:
      "Projects are saved as drafts first. Review, edit, and approve before publishing to your portfolio.",
  },
  {
    icon: Clock,
    title: "2-Minute Workflow",
    description:
      "What used to take 10+ minutes of manual entry now takes under 2 minutes with AI-powered extraction.",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export function ParserFeatures() {
  return (
    <section className="py-12">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 max-w-[40px] bg-emerald/40" />
        <span className="text-xs text-emerald tracking-widest uppercase">How it works</span>
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-12">
        Three inputs, one output
      </h2>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {features.map((f) => {
          const Icon = f.icon
          return (
            <motion.div
              key={f.title}
              variants={item}
              className="glass-panel rounded-xl p-6 card-glow group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald/10 border border-emerald/20 flex items-center justify-center mb-4 group-hover:bg-emerald/15 transition-colors">
                <Icon className="h-5 w-5 text-emerald" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
