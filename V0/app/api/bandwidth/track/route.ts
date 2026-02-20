import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { log_type, resource_type, resource_id, bandwidth_consumed, ip_address, user_agent, metadata } = body;

        const supabase = await createClient();

        const { error } = await supabase.from('bandwidth_logs').insert({
            log_type,
            resource_type,
            resource_id,
            bandwidth_consumed,
            ip_address,
            user_agent,
            metadata
        });

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error logging bandwidth:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
