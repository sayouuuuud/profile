import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const { type, data } = await req.json()
    const supabase = await createClient()

    try {
        let result

        switch (type) {
            case "ai_parser": {
                const startTime = Date.now()
                try {
                    const { parseProjectInput } = await import("@/lib/gemini")
                    const parsed = await parseProjectInput(data.text, "text")
                    const duration = Date.now() - startTime
                    result = {
                        success: true,
                        parsed,
                        duration,
                        tokens_estimated: Math.ceil(data.text.length / 4)
                    }
                } catch (error: any) {
                    result = {
                        success: false,
                        error: error.message,
                        duration: Date.now() - startTime
                    }
                }
                break
            }

            case "telegram_bot": {
                const startTime = Date.now()
                try {
                    const { sendTelegramMessage } = await import("@/lib/telegram-bot")
                    const message = data.message || "🧪 Test message from Mission Control"
                    const response = await sendTelegramMessage({
                        text: `${message}\n\n<i>Sent at ${new Date().toLocaleString()}</i>`,
                        parse_mode: "HTML"
                    })
                    const duration = Date.now() - startTime
                    result = {
                        success: !!response,
                        message: response ? "Test message sent successfully to Telegram!" : "Message was skipped (notifications might be disabled)",
                        duration,
                        simulated: false
                    }

                    // Log activity
                    await supabase.from("activity_logs").insert({
                        level: response ? "success" : "warning",
                        category: "telegram",
                        action: "test_message",
                        message: response ? "Test message sent successfully" : "Test message skipped (notifications disabled)"
                    })
                } catch (error: any) {
                    result = {
                        success: false,
                        error: error.message,
                        duration: Date.now() - startTime
                    }

                    await supabase.from("activity_logs").insert({
                        level: "error",
                        category: "telegram",
                        action: "test_message_failed",
                        message: error.message
                    })
                }
                break
            }

            case "report_generation": {
                const startTime = Date.now()
                try {
                    const { createClient: createServiceClient } = await import("@/lib/supabase/service")
                    const serviceSupabase = createServiceClient()

                    // Fetch real analytics data (last 24h)
                    const yesterday = new Date()
                    yesterday.setDate(yesterday.getDate() - 1)
                    const yesterdayStr = yesterday.toISOString()

                    const { count: visits } = await serviceSupabase
                        .from("analytics_events")
                        .select("id", { count: "exact", head: true })
                        .gte("created_at", yesterdayStr)

                    const { count: visitors } = await serviceSupabase
                        .from("analytics_events")
                        .select("visitor_id", { count: "exact", head: true })
                        .gte("created_at", yesterdayStr)

                    const analyticsData = {
                        visits: visits || 0,
                        visitsChange: 0,
                        visitors: visitors || 0,
                        conversionRate: "N/A",
                    }

                    // Generate AI insights
                    const { generateBriefInsights } = await import("@/lib/gemini")
                    const aiData = await generateBriefInsights(analyticsData, "Style: professional")

                    // Send to Telegram
                    const { sendMorningBrief } = await import("@/lib/telegram-bot")
                    const briefData = {
                        analytics: analyticsData,
                        insightCount: aiData.insights?.length || 0,
                        actionCount: aiData.action_items?.length || 0,
                        summary: aiData.summary,
                        insights: aiData.insights,
                    }
                    await sendMorningBrief(briefData)

                    const duration = Date.now() - startTime

                    // Log success
                    await serviceSupabase.from("usage_stats").insert({ category: "reports", metric: "generated", value: 1 })
                    await serviceSupabase.from("activity_logs").insert({
                        level: "success",
                        category: "reports",
                        action: "manual_brief",
                        message: `Morning brief generated and sent (${duration}ms)`
                    })

                    result = {
                        success: true,
                        report_type: "morning_brief",
                        message: "Morning brief generated and sent to Telegram!",
                        duration,
                        analytics: analyticsData,
                        insights_count: aiData.insights?.length || 0,
                        simulated: false
                    }
                } catch (error: any) {
                    result = {
                        success: false,
                        error: error.message,
                        duration: Date.now() - startTime
                    }

                    await supabase.from("activity_logs").insert({
                        level: "error",
                        category: "reports",
                        action: "manual_brief_failed",
                        message: error.message
                    })
                }
                break
            }

            case "health_check": {
                // Check DB
                const { error: dbError } = await supabase.from("system_config").select("id").limit(1)

                // Check Telegram
                let telegramOk = false
                try {
                    const botToken = process.env.TELEGRAM_BOT_TOKEN
                    const chatId = process.env.TELEGRAM_CHAT_ID
                    telegramOk = !!(botToken && chatId)

                    if (botToken) {
                        const res = await fetch(`https://api.telegram.org/bot${botToken}/getMe`)
                        telegramOk = res.ok
                    }
                } catch { telegramOk = false }

                // Check AI
                let aiOk = false
                try {
                    aiOk = !!process.env.GEMINI_API_KEY
                } catch { aiOk = false }

                result = {
                    database: { ok: !dbError, error: dbError?.message },
                    ai_service: { ok: aiOk, key_configured: !!process.env.GEMINI_API_KEY },
                    telegram_bot: { ok: telegramOk, token_configured: !!process.env.TELEGRAM_BOT_TOKEN, chat_configured: !!process.env.TELEGRAM_CHAT_ID }
                }
                break
            }

            default:
                throw new Error("Unknown test type")
        }

        return NextResponse.json({ success: true, result })

    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 })
    }
}
