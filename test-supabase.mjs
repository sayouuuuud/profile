import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

async function test() {
    const res = await fetch(`${url}/rest/v1/`, {
        headers: {
            Authorization: `Bearer ${key}`,
            apikey: key
        }
    })
    console.log(await res.json())
}

test()
