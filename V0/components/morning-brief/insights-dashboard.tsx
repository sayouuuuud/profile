'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  AlertCircle,
  Lightbulb,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Zap,
} from 'lucide-react';

export interface Insight {
  id: string;
  type: 'trend' | 'anomaly' | 'opportunity' | 'recommendation';
  title: string;
  description: string;
  metric?: {
    value: string;
    change: number;
    label: string;
  };
  action?: {
    label: string;
    href: string;
  };
}

export function InsightsDashboard({ insights }: { insights: Insight[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const typeConfig = {
    trend: {
      icon: TrendingUp,
      color: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      badge: 'Trend',
    },
    anomaly: {
      icon: AlertCircle,
      color: 'from-orange-500/20 to-orange-600/20',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      badge: 'Alert',
    },
    opportunity: {
      icon: Lightbulb,
      color: 'from-green-500/20 to-green-600/20',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
      bgColor: 'bg-green-500/10',
      badge: 'Opportunity',
    },
    recommendation: {
      icon: Target,
      color: 'from-purple-500/20 to-purple-600/20',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      badge: 'Action',
    },
  };

  const groupedInsights = {
    trend: insights.filter((i) => i.type === 'trend'),
    anomaly: insights.filter((i) => i.type === 'anomaly'),
    opportunity: insights.filter((i) => i.type === 'opportunity'),
    recommendation: insights.filter((i) => i.type === 'recommendation'),
  };

  const renderInsightSection = (
    type: keyof typeof groupedInsights,
    title: string,
    icon: React.ComponentType<{ className?: string }>
  ) => {
    const sectionInsights = groupedInsights[type];
    if (sectionInsights.length === 0) return null;

    const Icon = icon;
    const config = typeConfig[type];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 mb-4">
          <Icon className={`h-5 w-5 ${config.textColor}`} />
          <h3 className="font-semibold text-[#e5e7eb]">{title}</h3>
          <span className="ml-auto text-xs font-medium text-[#9ca3af]">
            {sectionInsights.length} {sectionInsights.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="space-y-2">
          {sectionInsights.map((insight) => (
            <motion.button
              key={insight.id}
              onClick={() =>
                setExpandedId(expandedId === insight.id ? null : insight.id)
              }
              className="w-full text-left"
              whileHover={{ x: 4 }}
            >
              <div
                className={`rounded-lg border ${config.borderColor} bg-gradient-to-br ${config.color} p-4 transition-all hover:border-opacity-50`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${config.bgColor} ${config.textColor}`}
                      >
                        {config.badge}
                      </span>
                      {insight.metric && (
                        <span
                          className={`text-sm font-bold ${
                            insight.metric.change > 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {insight.metric.change > 0 ? '+' : ''}
                          {insight.metric.change}%
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-[#e5e7eb]">{insight.title}</p>
                    {expandedId === insight.id && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-3 text-sm text-[#d1d5db] leading-relaxed"
                      >
                        {insight.description}
                      </motion.p>
                    )}
                  </div>
                  {insight.metric && (
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#e5e7eb]">
                        {insight.metric.value}
                      </p>
                      <p className="text-xs text-[#9ca3af]">{insight.metric.label}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      {renderInsightSection(
        'trend',
        'Trends',
        TrendingUp
      )}
      {renderInsightSection(
        'anomaly',
        'Anomalies Detected',
        AlertCircle
      )}
      {renderInsightSection(
        'opportunity',
        'Opportunities',
        Lightbulb
      )}
      {renderInsightSection(
        'recommendation',
        'Recommended Actions',
        Target
      )}
    </div>
  );
}
