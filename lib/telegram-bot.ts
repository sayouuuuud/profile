/**
 * Telegram Bot Integration Utilities
 * 
 * This module handles:
 * - Sending daily morning briefs
 * - Interactive button callbacks
 * - Lead notifications
 * - Case study generation updates
 */

import { createClient } from "@/lib/supabase/service";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_API = 'https://api.telegram.org';

interface TelegramButton {
  text: string;
  callback_data?: string;
  url?: string;
}

interface TelegramMessage {
  chat_id?: string | number;
  text: string;
  parse_mode?: 'HTML' | 'Markdown';
  reply_markup?: {
    inline_keyboard?: TelegramButton[][];
  };
}

async function getTelegramConfig(key: string, defaultValue: any) {
  try {
    const supabase = createClient();
    const { data } = await supabase.from("system_config").select("value").eq("category", "telegram").eq("key", key).single();
    return data?.value ?? defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

async function logTelegramUsage(metric: string, value: number, metadata: any = {}) {
  try {
    const supabase = createClient();
    await supabase.from("usage_stats").insert({
      category: "telegram",
      metric,
      value,
      metadata
    });
  } catch (e) {
    console.error("Failed to log Telegram usage:", e);
  }
}

async function logActivity(level: string, action: string, message: string) {
  try {
    const supabase = createClient();
    await supabase.from("activity_logs").insert({
      level,
      category: "telegram",
      action,
      message
    });
  } catch (e) {
    console.error("Failed to log Telegram activity:", e);
  }
}

/**
 * Send a message to Telegram
 */
export async function sendTelegramMessage(message: TelegramMessage) {
  // Check master switch
  const enabled = await getTelegramConfig("notifications_enabled", true);
  if (!enabled) {
    console.log("Telegram notifications disabled by config.");
    return null;
  }

  // Check quiet hours (simplified implementation)
  const quietEnabled = await getTelegramConfig("quiet_hours_enabled", false);
  if (quietEnabled) {
    const start = await getTelegramConfig("quiet_hours_start", "22:00");
    const end = await getTelegramConfig("quiet_hours_end", "08:00");
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const isQuietTime = (start <= end)
      ? (timeStr >= start && timeStr < end)
      : (timeStr >= start || timeStr < end); // Spans midnight

    if (isQuietTime) {
      console.log("Telegram silent due to quiet hours.");
      // Ideally queue it, but for now just skip or log
      return null; // or maybe send silently?
    }
  }

  if (!TELEGRAM_BOT_TOKEN || (!TELEGRAM_CHAT_ID && !message.chat_id)) {
    console.warn('Telegram credentials not configured');
    return null;
  }

  try {
    const payload = {
      ...message,
      chat_id: message.chat_id || TELEGRAM_CHAT_ID,
    };

    // Telegram API rejects 'localhost' in inline keyboard URLs
    if (payload.reply_markup?.inline_keyboard) {
      payload.reply_markup.inline_keyboard = payload.reply_markup.inline_keyboard.map(row =>
        row.map(btn => {
          if (btn.url && btn.url.includes('localhost')) {
            return { ...btn, url: btn.url.replace('localhost', '127.0.0.1') };
          }
          return btn;
        })
      );
    }

    const response = await fetch(
      `${TELEGRAM_API}/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.statusText}`);
    }

    const result = await response.json();

    // Log success
    await logTelegramUsage("messages_sent", 1, { type: "generic" });

    return result;
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    await logActivity("error", "send_message", String(error));
    throw error;
  }
}

/**
 * Send morning brief to Telegram
 */
export async function sendMorningBrief(briefData: {
  analytics: {
    visits: number;
    visitsChange: number;
    visitors: number;
    conversionRate: string;
  };
  insightCount: number;
  actionCount: number;
  summary?: string;
  insights?: string[];
}) {
  const text = `
📊 <b>Morning Brief - Daily Analytics</b>

<b>📈 Key Metrics:</b>
• Visits: <code>${briefData.analytics.visits}</code> (${briefData.analytics.visitsChange > 0 ? '↑' : '↓'
    } ${Math.abs(briefData.analytics.visitsChange)}%)
• Visitors: <code>${briefData.analytics.visitors}</code>
• Conversion: <code>${briefData.analytics.conversionRate}</code>

<b>📝 Executive Summary:</b>
${briefData.summary || 'No summary generated.'}

<b>🎯 Top Insights:</b>
${briefData.insights?.map(i => `• ${i}`).join('\n') || 'No insights generated.'}

<b>📋 Action Items:</b> ${briefData.actionCount} detected.

<i>Generated at ${new Date().toLocaleTimeString()}</i>
  `.trim();

  return sendTelegramMessage({
    text,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '📊 View Full Brief', url: `${process.env.NEXT_PUBLIC_SITE_URL}/tools/morning-brief` },
          { text: '🔍 Analyze Trends', callback_data: 'analyze_trends' },
        ],
        [
          { text: '📝 Draft Post', callback_data: 'draft_post' },
          { text: '🔄 Refresh', callback_data: 'refresh_brief' },
        ],
      ],
    },
  });
}

/**
 * Notify about new case study
 */
export async function notifyCaseStudyGenerated(data: {
  projectName: string;
  slug: string;
}) {
  const text = `
✅ <b>Case Study Generated!</b>

<b>${data.projectName}</b>

Your AI-powered case study has been created and is ready to share.
  `.trim();

  return sendTelegramMessage({
    text,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '👁️ View', url: `${process.env.NEXT_PUBLIC_SITE_URL}/case-studies/${data.slug}` },
          { text: '✏️ Edit', url: `${process.env.NEXT_PUBLIC_SITE_URL}/tools/case-study-generator` },
        ],
        [
          { text: '📤 Share', callback_data: `share_case_study_${data.slug}` },
        ],
      ],
    },
  });
}

/**
 * Notify about warm leads
 */
export async function notifyWarmLeads(leads: Array<{
  companyName: string;
  contactName: string;
  engagementScore: number;
}>) {
  const leadsList = leads
    .map(
      (l) =>
        `• <b>${l.companyName}</b> (${l.contactName}) - Score: ${l.engagementScore}/100`
    )
    .join('\n');

  const text = `
🔥 <b>Warm Leads Detected!</b>

${leadsList}

These visitors spent significant time on your portfolio. High conversion potential!
  `.trim();

  return sendTelegramMessage({
    text,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '📧 Send Email', callback_data: 'send_lead_email' },
          { text: '📞 Details', url: `${process.env.NEXT_PUBLIC_SITE_URL}/tools/morning-brief` },
        ],
      ],
    },
  });
}

/**
 * Send cron job notification
 */
export async function notifyCronJob(jobName: string, status: 'success' | 'error', details?: string) {
  const emoji = status === 'success' ? '✅' : '❌';
  const text = `
${emoji} <b>Cron Job: ${jobName}</b>

Status: <code>${status.toUpperCase()}</code>
${details ? `Details: <code>${details}</code>` : ''}
Time: ${new Date().toLocaleString()}
  `.trim();

  return sendTelegramMessage({
    text,
    parse_mode: 'HTML',
  });
}
