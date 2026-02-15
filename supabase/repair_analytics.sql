-- Simply add the column if it's missing
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS referrer TEXT;

-- Grant permissions explicitly
GRANT INSERT ON TABLE public.analytics_events TO anon;

-- Refresh schema cache (optional, sometimes needed)
NOTIFY pgrst, 'reload config';
