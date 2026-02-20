import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const supabase = await createClient()
    const { searchParams } = new URL(req.url)
    const range = searchParams.get("range") || "7d"
    const format = searchParams.get("format") || "json"

    // Calculate start date based on range
    const endDate = new Date()
    const startDate = new Date()
    if (range === "30d") startDate.setDate(endDate.getDate() - 30)
    else if (range === "90d") startDate.setDate(endDate.getDate() - 90)
    else startDate.setDate(endDate.getDate() - 7) // Default 7d

    const { data, error } = await supabase
        .from("usage_stats")
        .select("*")
        .gte("date", startDate.toISOString().split("T")[0])
        .lte("date", endDate.toISOString().split("T")[0])

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Aggegration Logic
    const stats = {
        ai: {
            total_tokens: 0,
            input_tokens: 0,
            output_tokens: 0,
            requests_success: 0,
            requests_failed: 0,
            daily: {} as any
        },
        telegram: {
            sent: 0,
            received: 0,
            daily: {} as any
        },
        reports: {
            generated: 0
        }
    }

    data.forEach(row => {
        const date = row.date

        // AI Stats
        if (row.category === "ai") {
            if (row.metric === "tokens_input") {
                stats.ai.input_tokens += row.value
                stats.ai.total_tokens += row.value
            }
            if (row.metric === "tokens_output") {
                stats.ai.output_tokens += row.value
                stats.ai.total_tokens += row.value
            }
            if (row.metric === "requests_success") stats.ai.requests_success += row.value
            if (row.metric === "requests_failed") stats.ai.requests_failed += row.value

            // Daily agg for tokens
            if (!stats.ai.daily[date]) stats.ai.daily[date] = { input: 0, output: 0 }
            if (row.metric === "tokens_input") stats.ai.daily[date].input += row.value
            if (row.metric === "tokens_output") stats.ai.daily[date].output += row.value
        }

        // Telegram Stats
        if (row.category === "telegram") {
            if (row.metric === "messages_sent") stats.telegram.sent += row.value
            if (row.metric === "messages_received") stats.telegram.received += row.value

            if (!stats.telegram.daily[date]) stats.telegram.daily[date] = { sent: 0, received: 0 }
            if (row.metric === "messages_sent") stats.telegram.daily[date].sent += row.value
            if (row.metric === "messages_received") stats.telegram.daily[date].received += row.value
        }

        // Reports Stats
        if (row.category === "reports") {
            stats.reports.generated += row.value
        }
    })

    // Format daily arrays for charts
    const formatDaily = (dailyMap: any) => Object.entries(dailyMap).map(([date, val]: any) => ({ date, ...val })).sort((a: any, b: any) => a.date.localeCompare(b.date))

    // Create combined data for CSV export
    const combinedData: any[] = []
    const allDates = new Set<string>()

    // Collect all dates from all categories
    Object.entries(stats.ai.daily).forEach(([date]: [string, any]) => allDates.add(date))
    Object.entries(stats.telegram.daily).forEach(([date]: [string, any]) => allDates.add(date))

    // Sort dates
    const sortedDates = Array.from(allDates).sort()

    // Build combined data
    sortedDates.forEach(date => {
        const aiData = stats.ai.daily[date] || { input: 0, output: 0 }
        const telegramData = stats.telegram.daily[date] || { sent: 0, received: 0 }

        combinedData.push({
            date,
            ai_tokens: (aiData.input || 0) + (aiData.output || 0),
            ai_requests: 0, // Would need separate tracking
            telegram_messages: (telegramData.sent || 0) + (telegramData.received || 0),
            reports: 0 // Would need separate tracking
        })
    })

    const responseData = {
        summary: {
            ai_tokens: stats.ai.total_tokens,
            ai_requests: stats.ai.requests_success + stats.ai.requests_failed,
            telegram_messages: stats.telegram.sent + stats.telegram.received,
            reports_generated: stats.reports.generated
        },
        charts: {
            ai: formatDaily(stats.ai.daily),
            telegram: formatDaily(stats.telegram.daily)
        },
        combined: combinedData
    }

    // Handle CSV export
    if (format === "csv") {
        const headers = ["Date", "AI Tokens", "AI Requests", "Telegram Messages", "Reports"]
        const csvRows = [
            headers.join(","),
            ...combinedData.map(row =>
                [row.date, row.ai_tokens, row.ai_requests, row.telegram_messages, row.reports].join(",")
            )
        ]

        const csvContent = csvRows.join("\n")

        return new NextResponse(csvContent, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="usage-stats-${range}.csv"`
            }
        })
    }

    return NextResponse.json(responseData)
}
