import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function setupStorage() {
  try {
    // Check if 'images' bucket exists
    const { data: buckets } = await supabase.storage.listBuckets()
    const imagesBucket = buckets?.find(b => b.name === 'images')

    if (!imagesBucket) {
      console.log('[v0] Creating images bucket...')
      const { data, error } = await supabase.storage.createBucket('images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
      })
      if (error) throw error
      console.log('[v0] Images bucket created successfully!')
    } else {
      console.log('[v0] Images bucket already exists')
    }

    console.log('[v0] Storage setup complete!')
  } catch (error) {
    console.error('[v0] Storage setup error:', error.message)
    process.exit(1)
  }
}

setupStorage()
