import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { path, referrer } = body;

        if (!path) {
            return NextResponse.json({ error: "Path is required" }, { status: 400 });
        }

        // Extract headers
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
        const userAgent = request.headers.get("user-agent") || "unknown";
        const country = request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry") || "Unknown";

        // Generate anonymous visitor ID (hash of IP + UA + Month) to somewhat anonymize but track unique monthly visitors
        const currentMonth = new Date().toISOString().slice(0, 7);
        const visitorId = crypto
            .createHash("sha256")
            .update(`${ip}-${userAgent}-${currentMonth}`)
            .digest("hex")
            .substring(0, 16);

        // Determine device type
        const isMobile = /mobile/i.test(userAgent);
        const isTablet = /tablet|ipad/i.test(userAgent);
        let deviceType = "desktop";
        if (isTablet) deviceType = "tablet";
        else if (isMobile) deviceType = "mobile";

        const supabase = await createClient();

        // Insert event
        const { error } = await supabase.from("analytics_events").insert({
            page_path: path,
            visitor_id: visitorId,
            country,
            device_type: deviceType,
            referrer: referrer || null,
            user_agent: userAgent
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
