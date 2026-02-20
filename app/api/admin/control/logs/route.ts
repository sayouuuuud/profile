import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const supabase = await createClient()
    const { searchParams } = new URL(req.url)
    const level = searchParams.get("level")
    const category = searchParams.get("category")
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")

    let query = supabase
        .from("activity_logs")
        .select("*", { count: "exact" })
        .order("timestamp", { ascending: false })
        .range(offset, offset + limit - 1)

    if (level && level !== "all") query = query.eq("level", level)
    if (category && category !== "all") query = query.eq("category", category)

    const { data, count, error } = await query

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ logs: data, total: count })
}
