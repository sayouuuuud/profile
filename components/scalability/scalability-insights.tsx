"use client"

import { motion } from "framer-motion"
import {
  TrendingUp,
  Server,
  DollarSign,
  Shield,
  Gauge,
  Users,
} from "lucide-react"

const insights = [
  {
    icon: TrendingUp,
    title: "Scaling is Non-Linear",
    description:
      "Going from 10K to 100K users requires 10x the infrastructure investment but only costs ~13x more. Efficiency improves at scale.",
    stat: "13x",
    statLabel: "cost per 10x users",
  },
  {
    icon: Server,
    title: "Architecture Dictates Cost",
    description:
      "The move from monolith to microservices is the single biggest cost driver. Plan your decomposition strategy early.",
    stat: "74%",
    statLabel: "of cost is compute",
  },
  {
    icon: DollarSign,
    title: "Premature Scaling is Expensive",
    description:
      "Running enterprise infrastructure at startup stage wastes $4,995/mo. Scale when metrics demand it, not when ego does.",
    stat: "$4.9K",
    statLabel: "wasted per month",
  },
  {
    icon: Shield,
    title: "Security Costs Scale Late",
    description:
      "Security spending only becomes significant at enterprise scale - but technical debt from ignoring it early is much more expensive.",
    stat: "10%",
    statLabel: "of enterprise budget",
  },
  {
    icon: Gauge,
    title: "Performance Improves with Scale",
    description:
      "Ironically, larger architectures serve faster responses. CDN coverage, caching layers, and optimized databases all contribute.",
    stat: "10x",
    statLabel: "faster at 1M vs 1K",
  },
  {
    icon: Users,
    title: "Team Size Matters Most",
    description:
      "The biggest hidden cost at enterprise scale is not infrastructure - it is the dedicated DevOps and SRE team required to manage it.",
    stat: "3-5",
    statLabel: "engineers needed",
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

export function ScalabilityInsights() {
  return (
    <section className="py-12">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 max-w-[40px] bg-emerald/40" />
        <span className="text-xs text-emerald tracking-widest uppercase">Key Insights</span>
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
        What the data tells us
      </h2>
      <p className="text-muted-foreground text-base max-w-lg mb-12">
        Real patterns from analyzing infrastructure scaling across dozens of production systems.
      </p>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {insights.map((insight) => {
          const Icon = insight.icon
          return (
            <motion.div
              key={insight.title}
              variants={item}
              className="glass-panel rounded-xl p-6 card-glow group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald/10 border border-emerald/20 flex items-center justify-center group-hover:bg-emerald/15 transition-colors">
                  <Icon className="h-5 w-5 text-emerald" />
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-foreground font-mono">{insight.stat}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {insight.statLabel}
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2">{insight.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {insight.description}
              </p>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
