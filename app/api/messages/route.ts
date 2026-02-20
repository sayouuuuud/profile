import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { error } = await supabase.from("messages").insert({
      name: name.trim(),
      email: email.trim(),
      subject: subject?.trim() || null,
      message: message.trim(),
      status: "unread",
    });

    if (error) {
      console.error("Failed to insert message:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 500 }
      );
    }

    // Send Telegram notification
    try {
      const { sendTelegramMessage } = await import("@/lib/telegram-bot");
      const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || '').replace('localhost', '127.0.0.1');
      await sendTelegramMessage({
        text: `📩 <b>New Message!</b>\n\n` +
          `<b>From:</b> ${name.trim()}\n` +
          `<b>Email:</b> <code>${email.trim()}</code>\n` +
          `${subject ? `<b>Subject:</b> ${subject.trim()}\n` : ''}` +
          `\n<b>Message:</b>\n<i>${message.trim().substring(0, 500)}</i>\n\n` +
          `<i>${new Date().toLocaleString('en-US', { timeZone: 'Africa/Cairo' })}</i>`,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              { text: '📬 View Messages', url: `${siteUrl}/admin/messages` },
            ],
          ],
        },
      });
    } catch (notifyErr) {
      console.error("Failed to send message Telegram notification:", notifyErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Messages API unhandled error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
