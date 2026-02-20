import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
    const supabase = await createClient()

    const { data, error } = await supabase.from("system_config").select("*")

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Group by category
    const config = data.reduce((acc: any, item: any) => {
        if (!acc[item.category]) {
            acc[item.category] = {}
        }
        acc[item.category][item.key] = item.value
        return acc
    }, {})

    return NextResponse.json(config)
}

export async function POST(req: Request) {
    const supabase = await createClient()
    const updates = await req.json()

    // Updates structure: { "ai": { "temperature": 0.8 }, "telegram": { ... } }

    const upsertData: any[] = []

    for (const category in updates) {
        for (const key in updates[category]) {
            upsertData.push({
                category,
                key,
                value: updates[category][key],
                updated_at: new Date().toISOString()
            })
        }
    }

    const { error } = await supabase.from("system_config").upsert(upsertData, { onConflict: "category,key" })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log activity
    await supabase.from("activity_logs").insert({
        level: "info",
        category: "config",
        action: "config_updated",
        message: "System configuration updated",
        metadata: updates
    })

    return NextResponse.json({ success: true })
}
