import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = 'https://api.telegram.org';

export async function GET() {
    if (!TELEGRAM_BOT_TOKEN) {
        return NextResponse.json({
            online: false,
            message: 'Bot token not configured'
        });
    }

    try {
        // 1. Get Bot Info (getMe)
        const meRes = await fetch(`${TELEGRAM_API}/bot${TELEGRAM_BOT_TOKEN}/getMe`);
        const meData = await meRes.json();

        // 2. Get Webhook Info
        const webhookRes = await fetch(`${TELEGRAM_API}/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo`);
        const webhookData = await webhookRes.json();

        // 3. Get Stats from DB
        const supabase = await createClient();

        // Count total messages today
        const today = new Date().toISOString().split('T')[0];
        const { count: msgCount } = await supabase
            .from('usage_stats')
            .select('*', { count: 'exact', head: true })
            .eq('category', 'telegram')
            .eq('metric', 'messages_sent')
            .eq('date', today);

        // Count all distinct users (if feasible, otherwise mock)
        // For now, we don't have a users table, so we'll mock or query logs
        // Efficient query for unique users from logs (optional, might be heavy)
        // const { data: uniqueUsers } = await supabase.rpc('count_unique_telegram_users');

        return NextResponse.json({
            online: meData.ok,
            bot: meData.result,
            webhook: webhookData.result,
            stats: {
                messages_today: msgCount || 0,
                pending_updates: webhookData.result?.pending_update_count || 0
            }
        });

    } catch (error: any) {
        return NextResponse.json({
            online: false,
            error: error.message
        }, { status: 500 });
    }
}
