import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = 'https://api.telegram.org';

export async function POST(req: Request) {
    if (!TELEGRAM_BOT_TOKEN) return NextResponse.json({ error: 'Bot token missing' }, { status: 400 });

    try {
        const { url } = await req.json();

        if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

        const res = await fetch(`${TELEGRAM_API}/bot${TELEGRAM_BOT_TOKEN}/setWebhook?url=${url}`);
        const data = await res.json();

        if (!data.ok) throw new Error(data.description || 'Failed to set webhook');

        // Log
        const supabase = await createClient();
        await supabase.from('activity_logs').insert({
            level: 'success', category: 'telegram', action: 'webhook_set', message: `Webhook set to ${url}`
        });

        return NextResponse.json(data);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE() {
    if (!TELEGRAM_BOT_TOKEN) return NextResponse.json({ error: 'Bot token missing' }, { status: 400 });

    try {
        const res = await fetch(`${TELEGRAM_API}/bot${TELEGRAM_BOT_TOKEN}/deleteWebhook`);
        const data = await res.json();

        if (!data.ok) throw new Error(data.description || 'Failed to delete webhook');

        // Log
        const supabase = await createClient();
        await supabase.from('activity_logs').insert({
            level: 'warning', category: 'telegram', action: 'webhook_deleted', message: 'Webhook deleted (switched to polling)'
        });

        return NextResponse.json(data);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
