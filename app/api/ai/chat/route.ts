import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ══════════════════════════════════════════════════════════
// AI Brain Chat — محادثة مباشرة مع الذكاء الاصطناعي
// الذكاء الاصطناعي يرد بالعربي ويعرف كل شيء عن الموقع
// ══════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
    try {
        const { message, history } = await request.json();
        if (!message) return NextResponse.json({ error: "Message required" }, { status: 400 });

        const { createClient } = await import("@/lib/supabase/service");
        const supabase = createClient();

        // ══════════════════════════════════
        // جمع بيانات الموقع الحالية (سياق للـ AI)
        // ══════════════════════════════════
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const today = new Date(); today.setHours(0, 0, 0, 0);

        const [
            { count: weekVisits },
            { count: todayVisits },
            { data: pagesRaw },
            { count: totalMessages },
            { data: lastReport },
            { data: recentMemories },
            { count: caseStudies },
        ] = await Promise.all([
            supabase.from("analytics_events").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
            supabase.from("analytics_events").select("id", { count: "exact", head: true }).gte("created_at", today.toISOString()),
            supabase.from("analytics_events").select("page_path, country, device_type").gte("created_at", weekAgo),
            supabase.from("messages").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
            supabase.from("ai_memory").select("content, data, created_at").eq("type", "weekly_report").order("created_at", { ascending: false }).limit(1).single(),
            supabase.from("ai_memory").select("type, title, content").order("created_at", { ascending: false }).limit(5),
            supabase.from("case_studies").select("id", { count: "exact", head: true }),
        ]);

        // تجميع إحصائيات الصفحات
        const pageCounts: Record<string, number> = {};
        const countryCounts: Record<string, number> = {};
        const deviceCounts: Record<string, number> = {};
        pagesRaw?.forEach((e) => {
            pageCounts[e.page_path] = (pageCounts[e.page_path] || 0) + 1;
            countryCounts[e.country || "Unknown"] = (countryCounts[e.country || "Unknown"] || 0) + 1;
            deviceCounts[e.device_type || "desktop"] = (deviceCounts[e.device_type || "desktop"] || 0) + 1;
        });
        const topPages = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const topCountries = Object.entries(countryCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);

        // آخر 5 دقائق — "نشط الآن"
        const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
        const { data: activeRaw } = await supabase.from("analytics_events").select("visitor_id").gte("created_at", fiveMinAgo);
        const activeNow = new Set(activeRaw?.map((v) => v.visitor_id)).size;

        // ══════════════════════════════════
        // بناء System Prompt
        // ══════════════════════════════════
        const systemPrompt = `أنت "AI Brain" — الذكاء الاصطناعي الذي يسكن في الموقع الشخصي لـ"سيد عبدالسلام" (مطور ومدير منتج تقني). أنت تعيش في هذا الموقع وترى كل ما يحدث فيه.

**بياناتك الحالية (محدّثة الآن):**

📊 الإحصائيات:
- زيارات هذا الأسبوع: ${weekVisits || 0}
- زيارات اليوم: ${todayVisits || 0}
- نشط الآن (آخر 5 دقائق): ${activeNow} زائر
- رسائل جديدة هذا الأسبوع: ${totalMessages || 0}
- عدد Case Studies: ${caseStudies || 0}

🏆 أكثر الصفحات زيارة (آخر 7 أيام):
${topPages.map(([p, c]) => `- ${p}: ${c} زيارة`).join("\n")}

🌍 أكثر الدول زيارة:
${topCountries.map(([c, n]) => `- ${c}: ${n} زيارة`).join("\n")}

📱 الأجهزة:
${Object.entries(deviceCounts).map(([d, n]) => `- ${d}: ${n}`).join("\n")}

🧠 آخر تقرير أسبوعي (${lastReport?.created_at ? new Date(lastReport.created_at).toLocaleDateString("ar-EG") : "لم يُنشأ بعد"}):
${lastReport?.content || "لا يوجد تقرير بعد — استخدم 'ابدأ تحليل الآن'"}

💭 آخر ملاحظاتي:
${recentMemories?.map((m) => `- ${m.title}: ${m.content?.substring(0, 100)}`).join("\n") || "لا توجد ملاحظات بعد"}

**قواعدك الصارمة:**
- تجاوب دائماً بالعربية الفصحى البسيطة
- اجعل إجاباتك موجزة وذكية — لا حشو
- لا تقترح أي إجراء تلقائي — أنت مراقب ومحلل فقط
- إذا سُئلت عن شيء لا تعرفه، قل ذلك بصدق
- استخدم الإيموجي بذكاء لتوضيح النقاط
- إذا لم تكن البيانات كافية، وضّح ذلك`;

        // ══════════════════════════════════
        // استدعاء Gemini Flash مع تاريخ المحادثة
        // ══════════════════════════════════
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: systemPrompt,
            generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 1024,
            },
        });

        // بناء تاريخ المحادثة
        const chat = model.startChat({
            history: (history || []).map((msg: { role: string; content: string }) => ({
                role: msg.role === "assistant" ? "model" : "user",
                parts: [{ text: msg.content }],
            })),
        });

        const result = await chat.sendMessage(message);
        const reply = result.response.text();

        return NextResponse.json({ reply });
    } catch (error: any) {
        console.error("[AI Brain Chat] Error:", error);
        return NextResponse.json(
            { error: error.message || "Chat failed" },
            { status: 500 }
        );
    }
}
