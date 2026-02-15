import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)

        const logType = searchParams.get('type')
        const limit = parseInt(searchParams.get('limit') || '100')
        const offset = parseInt(searchParams.get('offset') || '0')

        let query = supabase
            .from('bandwidth_logs')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        if (logType) {
            query = query.eq('log_type', logType)
        }

        const { data: logs, count, error } = await query

        if (error) throw error

        return NextResponse.json({
            logs: logs || [],
            total: count || 0,
            limit,
            offset
        })

    } catch (error: any) {
        console.error('Error fetching bandwidth logs:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to fetch logs' },
            { status: 500 }
        )
    }
}
