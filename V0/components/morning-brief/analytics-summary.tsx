'use client';

import { motion } from 'framer-motion';
import {
  Users,
  Eye,
  MousePointer,
  TrendingUp,
  Calendar,
} from 'lucide-react';

export interface AnalyticsData {
  visits: number;
  visitsChange: number;
  visitors: number;
  visitorsChange: number;
  clicks: number;
  clicksChange: number;
  conversionRate: string;
  conversionChange: number;
  topSource: string;
  lastUpdated: string;
}

export function AnalyticsSummary({ data }: { data: AnalyticsData }) {
  const metrics = [
    {
      label: 'Total Visits',
      value: data.visits.toLocaleString(),
      change: data.visitsChange,
      icon: Eye,
      color: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
    },
    {
      label: 'Unique Visitors',
      value: data.visitors.toLocaleString(),
      change: data.visitorsChange,
      icon: Users,
      color: 'from-emerald-500/20 to-emerald-600/20',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
    },
    {
      label: 'Total Clicks',
      value: data.clicks.toLocaleString(),
      change: data.clicksChange,
      icon: MousePointer,
      color: 'from-purple-500/20 to-purple-600/20',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
    },
    {
      label: 'Conversion Rate',
      value: data.conversionRate,
      change: data.conversionChange,
      icon: TrendingUp,
      color: 'from-orange-500/20 to-orange-600/20',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-400',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="space-y-6">
      {/* Header with last updated */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#e5e7eb]">Analytics Overview</h2>
        <div className="flex items-center gap-2 text-sm text-[#9ca3af]">
          <Calendar className="h-4 w-4" />
          Updated: {data.lastUpdated}
        </div>
      </div>

      {/* Metrics Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const isPositive = metric.change >= 0;

          return (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`rounded-lg border ${metric.borderColor} bg-gradient-to-br ${metric.color} p-6 backdrop-blur-sm`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`rounded-lg bg-[#1f2937] p-3`}>
                  <Icon className={`h-6 w-6 ${metric.textColor}`} />
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                    isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {isPositive ? '↑' : '↓'} {Math.abs(metric.change)}%
                </motion.div>
              </div>

              <div>
                <p className="text-sm font-medium text-[#9ca3af]">{metric.label}</p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-2 text-3xl font-bold text-[#e5e7eb]"
                >
                  {metric.value}
                </motion.p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Top Source */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-lg border border-[#10b981]/30 bg-gradient-to-br from-[#050505] via-[#050505] to-[#0f2318] p-6"
      >
        <h3 className="font-semibold text-[#e5e7eb] mb-4">Top Traffic Source</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-[#10b981]">{data.topSource}</p>
            <p className="text-sm text-[#9ca3af] mt-1">Primary source of visits today</p>
          </div>
          <div className="text-right">
            <div className="h-2 w-24 rounded-full bg-[#1f2937] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#10b981] to-[#059669]"
              />
            </div>
            <p className="text-sm text-[#9ca3af] mt-2">65% of traffic</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
