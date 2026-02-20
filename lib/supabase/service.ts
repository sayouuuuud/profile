import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl) {
        throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable.')
    }

    // In local dev, fall back to anon key if service role key not set
    const key = supabaseServiceKey || supabaseAnonKey
    if (!key) {
        throw new Error('Missing both SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
    }

    if (!supabaseServiceKey) {
        console.warn('[Service Client] SUPABASE_SERVICE_ROLE_KEY not set — using anon key (limited permissions). Add the service role key from Supabase Dashboard → Project Settings → API.')
    }

    return createSupabaseClient(supabaseUrl, key)
}
