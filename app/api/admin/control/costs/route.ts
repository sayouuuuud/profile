import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const supabase = await createClient()

    // Fetch AI Usage for cost calculation
    // Pricing (approximate for Gemini 1.5 Flash as per plan)
    const PRICING = {
        gemini_flash: { input: 0.000075 / 1000, output: 0.0003 / 1000 },
        gemini_pro: { input: 0.00125 / 1000, output: 0.005 / 1000 }
    }

    // Get current model from config to apply correct pricing
    const { data: config } = await supabase.from("system_config").select("value").eq("key", "model").single()
    const model = config?.value === "gemini-1.5-pro" ? "gemini_pro" : "gemini_flash"
    const rates = PRICING[model]

    // Get usage from last 30 days for projection
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)

    const { data: usage } = await supabase
        .from("usage_stats")
        .select("*")
        .eq("category", "ai")
        .gte("date", startDate.toISOString().split("T")[0])

    let totalInput = 0
    let totalOutput = 0

    usage?.forEach(row => {
        if (row.metric === "tokens_input") totalInput += row.value
        if (row.metric === "tokens_output") totalOutput += row.value
    })

    // Calculate costs
    const aiCost = (totalInput * rates.input) + (totalOutput * rates.output)

    // Projections
    const dailyAverage = aiCost / 30 // Simplified
    const projectedMonthly = dailyAverage * 30
    const projectedYearly = projectedMonthly * 12

    return NextResponse.json({
        total: aiCost,
        breakdown: {
            gemini: { cost: aiCost, tokens: totalInput + totalOutput, model: model },
            telegram: { cost: 0, message: "Free" },
            supabase: { cost: 0, message: "Free Tier" },
            vercel: { cost: 0, message: "Hobby Plan" }
        },
        projections: {
            monthly: projectedMonthly,
            yearly: projectedYearly
        }
    })
}
