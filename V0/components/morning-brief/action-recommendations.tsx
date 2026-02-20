'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  Zap,
  MessageSquare,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

export interface ActionItem {
  id: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  actionLabel: string;
  actionHref: string;
  completed?: boolean;
}

export function ActionRecommendations({ actions }: { actions: ActionItem[] }) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  const toggleAction = (id: string) => {
    const newCompleted = new Set(completedIds);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompletedIds(newCompleted);
  };

  const sortedActions = [...actions].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const priorityConfig = {
    high: {
      color: 'border-red-500/30 bg-red-500/10',
      badge: 'bg-red-500/20 text-red-400',
      icon: Zap,
      label: 'High Priority',
    },
    medium: {
      color: 'border-orange-500/30 bg-orange-500/10',
      badge: 'bg-orange-500/20 text-orange-400',
      icon: TrendingUp,
      label: 'Medium Priority',
    },
    low: {
      color: 'border-blue-500/30 bg-blue-500/10',
      badge: 'bg-blue-500/20 text-blue-400',
      icon: MessageSquare,
      label: 'Low Priority',
    },
  };

  const completedCount = completedIds.size;
  const totalCount = actions.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#e5e7eb] mb-2">Today's Action Items</h2>
          <p className="text-[#9ca3af]">
            Complete these tasks to maximize impact
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-right"
        >
          <p className="text-3xl font-bold text-[#10b981]">{completedCount}/{totalCount}</p>
          <p className="text-sm text-[#9ca3af]">Completed</p>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 rounded-full bg-[#1f2937] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-[#10b981] to-[#059669]"
        />
      </div>

      {/* Actions List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-3"
      >
        {sortedActions.map((action, index) => {
          const config = priorityConfig[action.priority];
          const IconComponent = config.icon;
          const isCompleted = completedIds.has(action.id);

          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div
                className={`rounded-lg border ${config.color} p-4 transition-all ${
                  isCompleted ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <motion.button
                    onClick={() => toggleAction(action.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-1 flex-shrink-0"
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                      >
                        <CheckCircle2 className="h-6 w-6 text-[#10b981]" />
                      </motion.div>
                    ) : (
                      <Circle className="h-6 w-6 text-[#6b7280] hover:text-[#10b981] transition-colors" />
                    )}
                  </motion.button>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${config.badge}`}
                        >
                          {config.label}
                        </span>
                        <IconComponent className="h-4 w-4 text-[#9ca3af]" />
                      </div>
                    </div>

                    <h3
                      className={`font-semibold ${
                        isCompleted
                          ? 'text-[#9ca3af] line-through'
                          : 'text-[#e5e7eb]'
                      }`}
                    >
                      {action.title}
                    </h3>

                    {!isCompleted && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 space-y-2"
                      >
                        <p className="text-sm text-[#d1d5db]">{action.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="inline-block rounded-full bg-[#374151] px-2 py-1 text-xs text-[#9ca3af]">
                            Impact: {action.impact}
                          </span>
                          <a
                            href={action.actionHref}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-[#10b981] hover:gap-2 transition-all"
                          >
                            {action.actionLabel}
                            <ArrowRight className="h-3 w-3" />
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Motivational message when all complete */}
      {completedCount === totalCount && completedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-lg border border-[#10b981]/30 bg-[#0f2318] p-6 text-center"
        >
          <p className="text-lg font-bold text-[#10b981]">
            All caught up! 🎉
          </p>
          <p className="mt-2 text-sm text-[#9ca3af]">
            Great work! Check back tomorrow for more insights
          </p>
        </motion.div>
      )}
    </div>
  );
}
