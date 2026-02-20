/**
 * Telegram Bot Integration Utilities
 * 
 * This module handles:
 * - Sending daily morning briefs
 * - Interactive button callbacks
 * - Lead notifications
 * - Case study generation updates
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_API = 'https://api.telegram.org';

interface TelegramButton {
  text: string;
  callback_data?: string;
  url?: string;
}

interface TelegramMessage {
  chat_id: string | number;
  text: string;
  parse_mode?: 'HTML' | 'Markdown';
  reply_markup?: {
    inline_keyboard?: TelegramButton[][];
  };
}

/**
 * Send a message to Telegram
 */
export async function sendTelegramMessage(message: TelegramMessage) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram credentials not configured');
    return null;
  }

  try {
    const response = await fetch(
      `${TELEGRAM_API}/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...message,
          chat_id: message.chat_id || TELEGRAM_CHAT_ID,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
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
}) {
  const text = `
📊 <b>Morning Brief - Daily Analytics</b>

<b>📈 Key Metrics:</b>
• Visits: <code>${briefData.analytics.visits}</code> (${
    briefData.analytics.visitsChange > 0 ? '↑' : '↓'
  } ${Math.abs(briefData.analytics.visitsChange)}%)
• Visitors: <code>${briefData.analytics.visitors}</code>
• Conversion: <code>${briefData.analytics.conversionRate}</code>

<b>🎯 Insights Generated:</b> ${briefData.insightCount}
<b>📋 Action Items:</b> ${briefData.actionCount}

<i>Generated at ${new Date().toLocaleTimeString()}</i>
  `.trim();

  return sendTelegramMessage({
    text,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '📊 View Full Brief', url: `${process.env.NEXT_PUBLIC_SITE_URL}/tools/morning-brief` },
          { text: '📈 Analytics', url: `${process.env.NEXT_PUBLIC_SITE_URL}/tools/morning-brief` },
        ],
        [
          { text: '✅ Mark Complete', callback_data: 'mark_brief_complete' },
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
