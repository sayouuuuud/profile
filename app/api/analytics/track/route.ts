import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            path, referrer, visitor_id, device_type, user_agent,
            scroll_depth, time_on_page, session_id
        } = body;

        if (!path) {
            return NextResponse.json({ error: "Path is required" }, { status: 400 });
        }

        const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
        const country = request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry") || "Unknown";

        const finalVisitorId = visitor_id || crypto.createHash("sha256").update(`${ip}-${user_agent}-${new Date().toISOString().slice(0, 7)}`).digest("hex").substring(0, 16);
        const finalDeviceType = device_type || "desktop";
        const finalUserAgent = user_agent || request.headers.get("user-agent") || "unknown";

        const supabase = await createClient();

        const { error } = await supabase.from("analytics_events").insert({
            page_path: path,
            visitor_id: finalVisitorId,
            country,
            device_type: finalDeviceType,
            referrer: referrer || null,
            user_agent: finalUserAgent,
            event_type: 'page_view',
            scroll_depth: scroll_depth || 0,
            time_on_page: time_on_page || 0,
            session_id: session_id || null,
        });

        if (error) {
            console.error("Analytics tracking error:", error);
            return NextResponse.json({ error: "Failed to track" }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (err) {
        console.error("Analytics API unhandled error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
