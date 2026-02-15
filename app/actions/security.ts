"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export async function logLoginEvent(email: string, status: "success" | "failure", error?: string) {
    const supabase = await createClient();
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";

    try {
        await supabase.from("login_events").insert({
            email,
            status,
            ip_address: ip,
            user_agent: userAgent,
            // user_id is optional and might be hard to get during failure or if not yet authenticated in session
        });
    } catch (err) {
        console.error("Failed to log login event:", err);
    }
}
