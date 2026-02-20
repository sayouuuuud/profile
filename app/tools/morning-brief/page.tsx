'use client';

import { motion } from 'framer-motion';
import { AnalyticsSummary } from '@/components/morning-brief/analytics-summary';
import { InsightsDashboard, type Insight } from '@/components/morning-brief/insights-dashboard';
import { ActionRecommendations, type ActionItem } from '@/components/morning-brief/action-recommendations';
import { Sun, RefreshCw, Download } from 'lucide-react';
import { useState } from 'react';

export default function MorningBriefPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock analytics data
  const analyticsData = {
    visits: 1243,
    visitsChange: 18,
    visitors: 856,
    visitorsChange: 12,
    clicks: 3847,
    clicksChange: 25,
    conversionRate: '3.2%',
    conversionChange: 5,
    topSource: 'LinkedIn',
    lastUpdated: 'Today, 6:42 AM',
  };

  // Mock insights
  const insights: Insight[] = [
    {
      id: '1',
      type: 'trend',
      title: 'Upward Traffic Momentum',
      description:
        'Your traffic has been trending upward for the past 4 days with a 18% increase. This aligns with the technical blog post you published yesterday.',
      metric: { value: '+18%', change: 18, label: 'vs yesterday' },
    },
    {
      id: '2',
      type: 'anomaly',
      title: 'Unusual Bounce Rate',
      description:
        'Bounce rate on the case studies page increased to 42% (normally 28%). Users might be having trouble finding navigation.',
      metric: { value: '42%', change: 50, label: 'bounce rate' },
    },
    {
      id: '3',
      type: 'opportunity',
      title: 'Scalability Post Trending',
      description:
        'Your "Database Scalability" article has been viewed 312 times today with a 8.5 minute average read time. Strong engagement signal.',
      metric: { value: '312', change: 120, label: 'views' },
    },
    {
      id: '4',
      type: 'recommendation',
      title: 'Expand Case Study Content',
      description:
        'Based on visit patterns, your portfolio case studies drive 35% of conversions. Consider adding 2-3 more detailed studies.',
      action: { label: 'View Analytics', href: '#' },
    },
    {
      id: '5',
      type: 'recommendation',
      title: 'Follow Up with 3 Warm Leads',
      description:
        'Three leads from Acme Corp, TechStart Inc, and CloudFlow have been on your site for 15+ minutes. High intent signal.',
      action: { label: 'View Leads', href: '#' },
    },
    {
      id: '6',
      type: 'opportunity',
      title: 'Mobile Traffic Opportunity',
      description:
        'Mobile users represent 62% of your traffic but only 18% of conversions. Optimizing mobile UX could unlock significant growth.',
      metric: { value: '62%', change: 8, label: 'mobile traffic' },
    },
  ];

  // Mock action items
  const actionItems: ActionItem[] = [
    {
      id: '1',
      priority: 'high',
      title: 'Create a Case Study for Scalability Simulator',
      description:
        'The Scalability Simulator project has high engagement. Creating a comprehensive case study could drive more interest.',
      impact: 'High (40% expected conversion boost)',
      actionLabel: 'Start Generator',
      actionHref: '/tools/case-study-generator',
    },
    {
      id: '2',
      priority: 'high',
      title: 'Fix Navigation Issue on Case Studies',
      description:
        'High bounce rate detected. Review and improve navigation to keep visitors engaged longer.',
      impact: 'High (reduce bounce rate by 15%)',
      actionLabel: 'Review Design',
      actionHref: '#',
    },
    {
      id: '3',
      priority: 'medium',
      title: 'Respond to Warm Leads from Acme Corp',
      description:
        'Three representatives spent 15+ minutes on your portfolio. Send personalized follow-up message.',
      impact: 'Medium (20% probability of booking)',
      actionLabel: 'Send Email',
      actionHref: '#',
    },
    {
      id: '4',
      priority: 'medium',
      title: 'Optimize Mobile Landing Page',
      description:
        'Mobile users make up 62% of traffic but only 18% convert. A/B test mobile-optimized landing page.',
      impact: 'Medium (expected +8% mobile conversion)',
      actionLabel: 'View Mobile Stats',
      actionHref: '#',
    },
    {
      id: '5',
      priority: 'low',
      title: 'Update Tech Stack Filters',
      description:
        'Portfolio visitors are searching for "Machine Learning" projects 23 times. Consider adding this filter.',
      impact: 'Low (improves UX)',
      actionLabel: 'Manage Filters',
      actionHref: '#',
    },
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  return (
    <main className="min-h-screen bg-[#050505] py-12">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#10b981]/20 px-4 py-2 text-sm font-semibold text-[#10b981]">
                <Sun className="h-4 w-4" />
                Good Morning
              </div>
              <h1 className="text-4xl font-bold text-[#e5e7eb]">
                Daily Brief
              </h1>
              <p className="mt-2 text-[#9ca3af]">
                Your personalized analytics & AI-powered insights for today
              </p>
            </div>
            <motion.button
              onClick={handleRefresh}
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              disabled={isRefreshing}
              className="flex items-center gap-2 rounded-lg border border-[#10b981]/30 px-4 py-3 font-medium text-[#10b981] transition-all hover:bg-[#10b981]/10 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              Refresh
            </motion.button>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="space-y-12">
          {/* Analytics Summary */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-lg border border-[#10b981]/20 bg-gradient-to-br from-[#050505] via-[#050505] to-[#0f2318] p-8"
          >
            <AnalyticsSummary data={analyticsData} />
          </motion.section>

          {/* Insights Dashboard */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-lg border border-[#10b981]/20 bg-gradient-to-br from-[#050505] via-[#050505] to-[#0f2318] p-8"
          >
            <InsightsDashboard insights={insights} />
          </motion.section>

          {/* Action Items */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-lg border border-[#10b981]/20 bg-gradient-to-br from-[#050505] via-[#050505] to-[#0f2318] p-8"
          >
            <ActionRecommendations actions={actionItems} />
          </motion.section>

          {/* Export Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between rounded-lg border border-[#10b981]/30 bg-[#0f2318] p-6"
          >
            <div>
              <h3 className="font-bold text-[#e5e7eb]">Export Daily Report</h3>
              <p className="mt-1 text-sm text-[#9ca3af]">
                Download a PDF summary of today's insights and metrics
              </p>
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-[#10b981] px-6 py-3 font-bold text-[#050505] transition-all hover:bg-[#059669]">
              <Download className="h-4 w-4" />
              Export PDF
            </button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
