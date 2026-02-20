import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendTelegramMessage } from '@/lib/telegram-bot';

export async function POST(req: Request) {
    try {
        const { target, chatId, message, parseMode = 'HTML' } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // 1. Identify Recipients
        let recipients: string[] = [];

        if (target === 'me') {
            // Send to Admin Chat ID from env
            const adminChatId = process.env.TELEGRAM_CHAT_ID;
            console.log("Broadcasting to Admin. Env ID:", adminChatId);

            if (adminChatId) {
                recipients.push(adminChatId);
            } else {
                return NextResponse.json({ error: 'Admin Chat ID not configured in .env' }, { status: 400 });
            }
        } else if (target === 'specific') {
            if (!chatId) {
                return NextResponse.json({ error: 'Chat ID is required for specific target' }, { status: 400 });
            }
            recipients.push(chatId);
        } else if (target === 'all') {
            // TODO: Fetch all users from DB
            // For now, return warning or send to admin only
            return NextResponse.json({ error: 'Broadcast to ALL not yet implemented (requires user table)' }, { status: 501 });
        }

        // 2. Send Messages
        const results = await Promise.allSettled(recipients.map(id =>
            sendTelegramMessage({
                chat_id: id,
                text: message,
                parse_mode: parseMode
            })
        ));

        // 3. Log Activity
        const successCount = results.filter(r => r.status === 'fulfilled').length;
        const failCount = results.filter(r => r.status === 'rejected').length;

        const supabase = await createClient();
        await supabase.from('activity_logs').insert({
            level: failCount > 0 ? 'warning' : 'success',
            category: 'telegram',
            action: 'broadcast_sent',
            message: `Sent broadcast to ${successCount} users. Failed: ${failCount}`,
            metadata: { target, recipients_count: recipients.length }
        });

        return NextResponse.json({
            success: true,
            sent: successCount,
            failed: failCount,
            debug_admin_id: process.env.TELEGRAM_CHAT_ID // Temporary debug
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
