import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/cron/morning-brief
 * 
 * Weekly comprehensive report sent to Telegram.
 * Scheduled via Vercel Cron: Sunday 5 AM UTC (7 AM Cairo)
 * 
 * RESILIENT: All data queries are individually wrapped so
 * a missing table never crashes the entire report.
 */
export async function GET(request: NextRequest) {
  const log: string[] = [];

  try {
    // Auth check
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET;
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { createClient } = await import('@/lib/supabase/service');
    const supabase = createClient();

    // ── Check config ──
    let weeklyEnabled = true;
    try {
      const { data } = await supabase
        .from("system_config")
        .select("value")
        .eq("category", "reports")
        .eq("key", "weekly_enabled")
        .single();
      if (data?.value === false) {
        return NextResponse.json({ message: "Weekly reports disabled in config" });
      }
    } catch { log.push('config: using default (enabled)'); }

    // ── Time Range ──
    const now = new Date();
    const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);
    const twoWeeksAgo = new Date(now); twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const weekAgoStr = weekAgo.toISOString();
    const twoWeeksAgoStr = twoWeeksAgo.toISOString();

    // ── 1. VISITS & VIEWS (from analytics_events if exists) ──
    let visits = 0, prevVisits = 0, totalVisits = 0, thisWeekVisitors = 0;
    try {
      const { count: w, error: ew } = await supabase.from('analytics_events').select('id', { count: 'exact', head: true }).gte('timestamp', weekAgoStr);
      if (ew) throw ew;
      const { count: p, error: ep } = await supabase.from('analytics_events').select('id', { count: 'exact', head: true }).gte('timestamp', twoWeeksAgoStr).lt('timestamp', weekAgoStr);
      if (ep) throw ep;
      const { count: t, error: et } = await supabase.from('analytics_events').select('id', { count: 'exact', head: true });
      if (et) throw et;
      const { count: v, error: ev } = await supabase.from('analytics_events').select('visitor_id', { count: 'exact', head: true }).gte('timestamp', weekAgoStr);
      if (ev) throw ev;
      visits = w || 0; prevVisits = p || 0; totalVisits = t || 0; thisWeekVisitors = v || 0;
      log.push(`analytics: ${visits} visits`);
    } catch (e: any) { log.push(`analytics_events error: ${JSON.stringify(e)}`); }

    const changePercent = prevVisits > 0 ? Math.round(((visits - prevVisits) / prevVisits) * 100) : 0;
    const changeEmoji = changePercent >= 0 ? '📈' : '📉';

    // ── 2. TOP PAGES ──
    let topPagesText = '<i>No page data available</i>';
    let topProjectsText = '<i>No project data available</i>';
    try {
      const { data: pageViews } = await supabase.from('analytics_events').select('page_path').gte('timestamp', weekAgoStr);
      const pageCounts: Record<string, number> = {};
      pageViews?.forEach((e: any) => { if (e.page_path) pageCounts[e.page_path] = (pageCounts[e.page_path] || 0) + 1; });

      const topPages = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
      const projectPages = Object.entries(pageCounts)
        .filter(([p]) => p.startsWith('/case-studies/') && p !== '/case-studies')
        .sort((a, b) => b[1] - a[1]).slice(0, 5);

      if (topPages.length > 0) topPagesText = topPages.map(([path, count], i) => `${i + 1}. <code>${path}</code> — ${count}`).join('\n');
      if (projectPages.length > 0) topProjectsText = projectPages.map(([path, count], i) => `${i + 1}. <code>${path.replace('/case-studies/', '')}</code> — ${count}`).join('\n');
    } catch { }

    // ── 3. VISITOR BEHAVIOR ──
    let devicesText = 'N/A', countriesText = 'N/A', sourcesText = 'Direct';
    try {
      const { data: vdata } = await supabase.from('analytics_events').select('device_type, country, referrer').gte('timestamp', weekAgoStr);
      const deviceCounts: Record<string, number> = {};
      const countryCounts: Record<string, number> = {};
      const referrerCounts: Record<string, number> = {};
      vdata?.forEach((v: any) => {
        if (v.device_type) deviceCounts[v.device_type] = (deviceCounts[v.device_type] || 0) + 1;
        if (v.country) countryCounts[v.country] = (countryCounts[v.country] || 0) + 1;
        if (v.referrer) referrerCounts[v.referrer] = (referrerCounts[v.referrer] || 0) + 1;
      });
      const td = Object.entries(deviceCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
      const tc = Object.entries(countryCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
      const tr = Object.entries(referrerCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
      if (td.length) devicesText = td.map(([d, c]) => `${d}(${c})`).join(' · ');
      if (tc.length) countriesText = tc.map(([c, n]) => `${c}(${n})`).join(' · ');
      if (tr.length) sourcesText = tr.map(([r, c]) => `${r}(${c})`).join(' · ');
    } catch { }

    // ── 4. SYSTEM HEALTH ──
    let dbStatus = '✅';
    try { const { error } = await supabase.from('system_config').select('id').limit(1); if (error) dbStatus = '❌'; } catch { dbStatus = '❌'; }

    let telegramStatus = '✅';
    try {
      const token = process.env.TELEGRAM_BOT_TOKEN;
      if (!token) { telegramStatus = '⚠️ No token'; }
      else { const r = await fetch(`https://api.telegram.org/bot${token}/getMe`); if (!r.ok) telegramStatus = '❌'; }
    } catch { telegramStatus = '❌'; }

    const aiStatus = process.env.GEMINI_API_KEY ? '✅' : '⚠️ No key';

    // ── 5. AI COST ──
    let totalInputTokens = 0, totalOutputTokens = 0, aiRequests = 0;
    try {
      const { data: aiUsage } = await supabase.from('usage_stats').select('metric, value').eq('category', 'ai').gte('date', weekAgo.toISOString().split('T')[0]);
      aiUsage?.forEach((r: any) => {
        if (r.metric === 'tokens_input') totalInputTokens += r.value;
        if (r.metric === 'tokens_output') totalOutputTokens += r.value;
        if (r.metric === 'requests_success') aiRequests += r.value;
      });
    } catch { }
    const estimatedCost = (totalInputTokens * 0.000075 / 1000) + (totalOutputTokens * 0.0003 / 1000);

    // ── 6. MESSAGES ──
    let newMessages = 0;
    try { const { count } = await supabase.from('messages').select('id', { count: 'exact', head: true }).gte('created_at', weekAgoStr); newMessages = count || 0; } catch { }

    // ── 7. LOGIN ACTIVITY ──
    let loginAttempts = 0, failedLogins = 0;
    try {
      const { count: la } = await supabase.from('login_events').select('id', { count: 'exact', head: true }).gte('created_at', weekAgoStr);
      const { count: fl } = await supabase.from('login_events').select('id', { count: 'exact', head: true }).gte('created_at', weekAgoStr).eq('status', 'failure');
      loginAttempts = la || 0; failedLogins = fl || 0;
    } catch { }

    // ── BUILD REPORT ──
    const report = `
📊 <b>Weekly Report — Portfolio Analytics</b>
<i>${weekAgo.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} → ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</i>

━━━━━━━━━━━━━━━━━━━━

${changeEmoji} <b>Traffic Overview</b>
• This Week: <code>${visits}</code> visits${prevVisits > 0 ? ` (${changePercent >= 0 ? '+' : ''}${changePercent}%)` : ''}
• Unique Visitors: <code>${thisWeekVisitors}</code>
• All-Time Total: <code>${totalVisits}</code>

━━━━━━━━━━━━━━━━━━━━

📄 <b>Top Pages</b>
${topPagesText}

━━━━━━━━━━━━━━━━━━━━

🗂️ <b>Popular Projects</b>
${topProjectsText}

━━━━━━━━━━━━━━━━━━━━

👥 <b>Visitor Analysis</b>
<b>Devices:</b> ${devicesText}
<b>Countries:</b> ${countriesText}
<b>Sources:</b> ${sourcesText}

━━━━━━━━━━━━━━━━━━━━

⚡ <b>System Health</b>
• Database: ${dbStatus}
• AI Service: ${aiStatus}
• Telegram Bot: ${telegramStatus}

━━━━━━━━━━━━━━━━━━━━

💰 <b>AI Usage</b>
• Tokens: <code>${(totalInputTokens + totalOutputTokens).toLocaleString()}</code>
• Requests: <code>${aiRequests}</code>
• Est. Cost: <code>$${estimatedCost.toFixed(4)}</code>

━━━━━━━━━━━━━━━━━━━━

📬 <b>Activity</b>
• New Messages: <code>${newMessages}</code>
• Logins: <code>${loginAttempts}</code> (${failedLogins} failed)

<i>Generated ${now.toLocaleString('en-US', { timeZone: 'Africa/Cairo' })}</i>
    `.trim();

    // ── SEND TO TELEGRAM ──
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return NextResponse.json({
        success: false,
        error: 'Telegram credentials not configured (TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID missing)',
        report_preview: report.substring(0, 200),
        log
      }, { status: 500 });
    }

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || '').replace('localhost', '127.0.0.1');

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: report,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [[
              { text: '📊 Dashboard', url: `${siteUrl}/admin` },
              { text: '💬 Messages', url: `${siteUrl}/admin/messages` },
            ]],
          },
        }),
      }
    );

    if (!telegramRes.ok) {
      const errText = await telegramRes.text();
      return NextResponse.json({
        success: false,
        error: `Telegram API error: ${telegramRes.statusText}`,
        details: errText,
        log
      }, { status: 500 });
    }

    // ── LOG SUCCESS ──
    try {
      await supabase.from("usage_stats").insert({ category: "reports", metric: "generated", value: 1 });
      await supabase.from("activity_logs").insert({
        level: "success", category: "reports", action: "weekly_report",
        message: `Weekly report sent (${visits} visits, ${newMessages} messages)`
      });
    } catch { }

    return NextResponse.json({
      success: true,
      message: 'Weekly report generated and sent to Telegram',
      stats: { visits, changePercent, visitors: thisWeekVisitors, totalVisits, newMessages, loginAttempts },
      log
    });

  } catch (error: any) {
    console.error('[CRON] Fatal error:', error);
    return NextResponse.json({
      success: false,
      error: error?.message || 'Unknown fatal error',
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
      log
    }, { status: 500 });
  }
}

/**
 * POST — For manual triggering from admin page
 */
export async function POST(request: NextRequest) {
  return GET(request);
}
