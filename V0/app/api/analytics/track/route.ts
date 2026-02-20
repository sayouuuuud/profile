import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { path, referrer, visitor_id, device_type, user_agent } = body;

        if (!path) {
            return NextResponse.json({ error: "Path is required" }, { status: 400 });
        }

        // Fallback or validation
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
        const country = request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry") || "Unknown";

        // Use client provided data if available, otherwise fallback (though client should provide)
        const finalVisitorId = visitor_id || crypto.createHash("sha256").update(`${ip}-${user_agent}-${new Date().toISOString().slice(0, 7)}`).digest("hex").substring(0, 16);
        const finalDeviceType = device_type || "desktop";
        const finalUserAgent = user_agent || request.headers.get("user-agent") || "unknown";

        const supabase = await createClient();

        // Insert event
        const { error } = await supabase.from("analytics_events").insert({
            page_path: path,
            visitor_id: finalVisitorId,
            country,
            device_type: finalDeviceType,
            referrer: referrer || null,
            user_agent: finalUserAgent,
            event_type: 'page_view'
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
