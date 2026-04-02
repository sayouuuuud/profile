import { NextRequest, NextResponse } from "next/server";

// ══════════════════════════════════════════════════════════
// Cron Job أسبوعي — يشغّل التحليل ويبعت التقرير على تيليجرام
// ══════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
    // حماية: يقبل فقط من Vercel Cron أو مع token سري
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "sayed-ai-brain-cron";
    if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sayed.bio";

        // 1. تشغيل التحليل
        const analyzeRes = await fetch(`${baseUrl}/api/ai/analyze-site`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cronSecret}`,
            },
        });

        if (!analyzeRes.ok) {
            throw new Error(`Analysis failed: ${analyzeRes.statusText}`);
        }

        const { report, analyticsSnapshot } = await analyzeRes.json();

        // 2. تجهيز رسالة تيليجرام بالعربي
        const topPage = analyticsSnapshot?.topPages?.[0];
        const topCountry = analyticsSnapshot?.topCountries?.[0];

        const telegramMessage = `
🧠 <b>التقرير الأسبوعي — AI Brain</b>

📅 <b>${analyticsSnapshot?.period?.from} → ${analyticsSnapshot?.period?.to}</b>

📊 <b>نظرة عامة:</b>
• الزيارات: <code>${analyticsSnapshot?.overview?.totalVisits}</code>
• الزوار الفريدون: <code>${analyticsSnapshot?.overview?.uniqueVisitors}</code>
• رسائل جديدة: <code>${analyticsSnapshot?.overview?.newMessages}</code>

🏆 <b>الصفحة الأكثر زيارة:</b>
<code>${topPage?.path || "/"}</code> — ${topPage?.visits || 0} زيارة
⏱ وقت التركيز: ${topPage?.avgTimeSeconds || 0}s | 📜 التمرير: ${topPage?.avgScrollDepth || 0}%

🌍 <b>أكثر الدول زيارة:</b>
${analyticsSnapshot?.topCountries?.slice(0, 3).map((c: any) => `• ${c.country}: ${c.count} زيارة`).join("\n") || "غير محدد"}

🎯 <b>ما اهتم به الزوار:</b>
${report?.interests_detected?.map((i: string) => `• ${i}`).join("\n") || "لا توجد بيانات كافية"}

📝 <b>ملاحظة الأسبوع:</b>
${report?.executive_summary || "لا توجد ملاحظات"}

💡 <b>توصيات للمراجعة:</b>
${report?.recommended_actions?.map((a: string) => `• ${a}`).join("\n") || "لا توجد توصيات"}

❤️ <b>صحة الموقع:</b> ${report?.health_score || "??"}/100
<i>${report?.health_note || ""}</i>

<i>🤖 تم التحليل تلقائياً بواسطة AI Brain</i>
        `.trim();

        // 3. إرسال على تيليجرام
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (botToken && chatId) {
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: telegramMessage,
                    parse_mode: "HTML",
                }),
            });
        }

        // 4. تسجيل في activity_logs
        const { createClient } = await import("@/lib/supabase/service");
        const supabase = createClient();
        await supabase.from("activity_logs").insert({
            level: "success",
            category: "ai",
            action: "weekly_report_sent",
            message: `تم إرسال التقرير الأسبوعي — ${analyticsSnapshot?.overview?.totalVisits} زيارة`,
            metadata: {
                health_score: report?.health_score,
                total_visits: analyticsSnapshot?.overview?.totalVisits,
            },
        });

        return NextResponse.json({ success: true, message: "Weekly AI report sent" });
    } catch (error: any) {
        console.error("[AI Cron] Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
