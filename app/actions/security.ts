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
        });
    } catch (err) {
        console.error("Failed to log login event:", err);
    }

    // Send Telegram notification
    try {
        const { sendTelegramMessage } = await import("@/lib/telegram-bot");

        // Parse device info from user agent
        const device = userAgent.includes("Mobile") ? "📱 Mobile" : "💻 Desktop";
        const browser = extractBrowser(userAgent);

        if (status === "failure") {
            await sendTelegramMessage({
                text: `🚨 <b>Failed Login Attempt</b>\n\n` +
                    `<b>Email:</b> <code>${email}</code>\n` +
                    `<b>IP:</b> <code>${ip}</code>\n` +
                    `<b>Device:</b> ${device} · ${browser}\n` +
                    `<b>Error:</b> ${error || 'Unknown'}\n\n` +
                    `<i>${new Date().toLocaleString('en-US', { timeZone: 'Africa/Cairo' })}</i>`,
                parse_mode: "HTML",
            });
        } else {
            await sendTelegramMessage({
                text: `🔓 <b>Admin Login</b>\n\n` +
                    `<b>Email:</b> <code>${email}</code>\n` +
                    `<b>IP:</b> <code>${ip}</code>\n` +
                    `<b>Device:</b> ${device} · ${browser}\n\n` +
                    `<i>${new Date().toLocaleString('en-US', { timeZone: 'Africa/Cairo' })}</i>`,
                parse_mode: "HTML",
            });
        }
    } catch (notifyErr) {
        console.error("Failed to send login Telegram notification:", notifyErr);
    }
}

function extractBrowser(ua: string): string {
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Edg")) return "Edge";
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Safari")) return "Safari";
    if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
    return "Unknown";
}
