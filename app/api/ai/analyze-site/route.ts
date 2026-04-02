import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ══════════════════════════════════════════════════════════
// محرك التفكير — يجمع بيانات الموقع ويولد ملاحظات بالعربي
// ══════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
    try {
        const { createClient } = await import("@/lib/supabase/service");
        const supabase = createClient();

        // نحدد نطاق الوقت (آخر 7 أيام)
        const weekEnd = new Date();
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);
        const weekStartISO = weekStart.toISOString();

        // ══════════════════════════════════════
        // 1. جمع البيانات الخام من analytics_events
        // ══════════════════════════════════════

        // مجموع الزيارات
        const { count: totalVisits } = await supabase
            .from("analytics_events")
            .select("id", { count: "exact", head: true })
            .gte("created_at", weekStartISO);

        // الزوار الفريدون
        const { data: visitorsRaw } = await supabase
            .from("analytics_events")
            .select("visitor_id")
            .gte("created_at", weekStartISO);
        const uniqueVisitors = new Set(visitorsRaw?.map((v) => v.visitor_id)).size;

        // الصفحات الأكثر زيارة
        const { data: pagesRaw } = await supabase
            .from("analytics_events")
            .select("page_path, scroll_depth, time_on_page")
            .gte("created_at", weekStartISO);

        const pageStats: Record<string, { count: number; avgScroll: number; avgTime: number }> = {};
        pagesRaw?.forEach((e) => {
            if (!pageStats[e.page_path]) {
                pageStats[e.page_path] = { count: 0, avgScroll: 0, avgTime: 0 };
            }
            pageStats[e.page_path].count++;
            pageStats[e.page_path].avgScroll += e.scroll_depth || 0;
            pageStats[e.page_path].avgTime += e.time_on_page || 0;
        });

        // احسب المتوسطات
        const topPages = Object.entries(pageStats)
            .map(([path, stats]) => ({
                path,
                visits: stats.count,
                avgScrollDepth: Math.round(stats.avgScroll / stats.count),
                avgTimeSeconds: Math.round(stats.avgTime / stats.count),
            }))
            .sort((a, b) => b.visits - a.visits)
            .slice(0, 10);

        // الدول
        const { data: countriesRaw } = await supabase
            .from("analytics_events")
            .select("country")
            .gte("created_at", weekStartISO)
            .not("country", "eq", "Unknown");

        const countryStats: Record<string, number> = {};
        countriesRaw?.forEach((e) => {
            countryStats[e.country] = (countryStats[e.country] || 0) + 1;
        });
        const topCountries = Object.entries(countryStats)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([country, count]) => ({ country, count }));

        // الأجهزة
        const { data: devicesRaw } = await supabase
            .from("analytics_events")
            .select("device_type")
            .gte("created_at", weekStartISO);
        const deviceStats: Record<string, number> = {};
        devicesRaw?.forEach((e) => {
            deviceStats[e.device_type || "unknown"] = (deviceStats[e.device_type || "unknown"] || 0) + 1;
        });

        // أوقات الذروة (ساعات)
        const { data: timeRaw } = await supabase
            .from("analytics_events")
            .select("created_at")
            .gte("created_at", weekStartISO);
        const hourStats: Record<number, number> = {};
        timeRaw?.forEach((e) => {
            const hour = new Date(e.created_at).getHours();
            hourStats[hour] = (hourStats[hour] || 0) + 1;
        });
        const peakHour = Object.entries(hourStats).sort((a, b) => b[1] - a[1])[0];

        // الرسائل الجديدة
        const { count: newMessages } = await supabase
            .from("messages")
            .select("id", { count: "exact", head: true })
            .gte("created_at", weekStartISO);

        // ══════════════════════════════════════
        // 2. تجميع البيانات لإرسالها للذكاء الاصطناعي
        // ══════════════════════════════════════
        const analyticsSnapshot = {
            period: {
                from: weekStart.toLocaleDateString("ar-EG"),
                to: weekEnd.toLocaleDateString("ar-EG"),
            },
            overview: {
                totalVisits: totalVisits || 0,
                uniqueVisitors,
                newMessages: newMessages || 0,
            },
            topPages,
            topCountries,
            devices: deviceStats,
            peakHour: peakHour ? `الساعة ${peakHour[0]} (${peakHour[1]} زيارة)` : "غير محدد",
        };

        // ══════════════════════════════════════
        // 3. إرسال البيانات للذكاء الاصطناعي
        // ══════════════════════════════════════
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                temperature: 0.7,
                responseMimeType: "application/json",
            },
        });

        const aiPrompt = `
أنت مساعد ذكاء اصطناعي متخصص في تحليل سلوك زوار المواقع. أنت تسكن في الموقع الشخصي لـ "سيد عبدالسلام" — مطور ومدير منتج تقني.

مهمتك: تحليل بيانات الأسبوع الماضي وكتابة تقرير ذكي يشعر كأنك شاهد ما جرى بنفسك.

البيانات:
${JSON.stringify(analyticsSnapshot, null, 2)}

أنتج JSON بهذا الشكل:
{
  "title": "عنوان التقرير الأسبوعي",
  "executive_summary": "ملخص تنفيذي بأسلوب محلل ذكي — 2-3 جمل، بالعربي، تشعر أنك عشت الأسبوع دا",
  "observations": [
    "ملاحظة ذكية عن الصفحة الأكثر زيارة — لماذا يربطها المستخدمون؟",
    "ملاحظة عن أنماط الوقت — متى يكون المستخدم أكثر اهتماماً؟",
    "ملاحظة عن الجغرافيا — من أين يأتي الاهتمام؟",
    "ملاحظة عن سلوك التمرير — ما الذي يقرؤه المستخدم بالكامل؟",
    "ملاحظة عامة عن صحة الموقع"
  ],
  "interests_detected": ["اهتمام 1", "اهتمام 2", "اهتمام 3"],
  "recommended_actions": [
    "توصية عملية للمسؤول (بدون أي قرار — فقط اقتراح للمراجعة)",
    "توصية ثانية"
  ],
  "health_score": 85,
  "health_note": "تعليق على صحة الموقع هذا الأسبوع"
}

قواعد صارمة:
- كل شيء بالعربي الفصحى البسيطة
- لا تخترع أرقاماً — استخدم فقط ما في البيانات
- الملاحظات تكون ذكية وتحليلية — مش مجرد تكرار للأرقام  
- التوصيات للمراجعة فقط — لا تقترح أي إجراء تلقائي
`;

        const result = await model.generateContent(aiPrompt);
        const aiResponse = JSON.parse(result.response.text());

        // ══════════════════════════════════════
        // 4. حفظ التقرير في ai_memory
        // ══════════════════════════════════════
        const { data: savedReport, error: saveError } = await supabase
            .from("ai_memory")
            .insert({
                type: "weekly_report",
                title: aiResponse.title || "التقرير الأسبوعي",
                content: aiResponse.executive_summary,
                week_start: weekStart.toISOString().split("T")[0],
                week_end: weekEnd.toISOString().split("T")[0],
                data: {
                    observations: aiResponse.observations,
                    interests_detected: aiResponse.interests_detected,
                    recommended_actions: aiResponse.recommended_actions,
                    health_score: aiResponse.health_score,
                    health_note: aiResponse.health_note,
                    raw_analytics: analyticsSnapshot,
                },
            })
            .select()
            .single();

        if (saveError) throw saveError;

        // حفظ الملاحظات الفردية أيضاً
        const observations = aiResponse.observations || [];
        if (observations.length > 0) {
            await supabase.from("ai_memory").insert(
                observations.map((obs: string, i: number) => ({
                    type: "observation",
                    title: `ملاحظة ${i + 1} — الأسبوع ${weekStart.toLocaleDateString("ar-EG")}`,
                    content: obs,
                    week_start: weekStart.toISOString().split("T")[0],
                    week_end: weekEnd.toISOString().split("T")[0],
                    data: { source: "weekly_analysis" },
                }))
            );
        }

        return NextResponse.json({
            success: true,
            report: aiResponse,
            reportId: savedReport.id,
            analyticsSnapshot,
        });
    } catch (error: any) {
        console.error("[AI Brain] Analysis error:", error);
        return NextResponse.json(
            { error: error.message || "Analysis failed" },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({ message: "AI Brain analysis engine — POST to trigger analysis" });
}
