-- Create analytics_events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  visitor_id TEXT, -- hashed IP or session ID
  country TEXT DEFAULT 'Unknown',
  device_type TEXT DEFAULT 'desktop', -- mobile, tablet, desktop
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow public insert (for tracking from client or via server-side proxy which might be anon)
CREATE POLICY "Allow public insert to analytics_events"
ON public.analytics_events
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow admins to read raw events
CREATE POLICY "Allow admins to read analytics_events"
ON public.analytics_events
FOR SELECT
TO authenticated
USING (true);

-- VIEW 1: Daily Stats (Views vs Visitors)
CREATE OR REPLACE VIEW public.analytics_daily_stats AS
SELECT
  to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as date,
  COUNT(*) as views_count,
  COUNT(DISTINCT visitor_id) as visitors_count
FROM public.analytics_events
GROUP BY 1
ORDER BY 1 DESC;

-- VIEW 2: Country Stats
CREATE OR REPLACE VIEW public.analytics_country_stats AS
SELECT
  country,
  COUNT(distinct visitor_id) as count
FROM public.analytics_events
WHERE country IS NOT NULL
GROUP BY country
ORDER BY count DESC;

-- VIEW 3: Device Stats
CREATE OR REPLACE VIEW public.analytics_device_stats AS
SELECT
  device_type,
  COUNT(distinct visitor_id) as count,
  ROUND(COUNT(distinct visitor_id) * 100.0 / (SELECT COUNT(distinct visitor_id) FROM public.analytics_events), 1) as percentage
FROM public.analytics_events
GROUP BY device_type
ORDER BY count DESC;

-- VIEW 4: Top Pages
CREATE OR REPLACE VIEW public.analytics_top_pages AS
SELECT
  page_path,
  COUNT(*) as views
FROM public.analytics_events
GROUP BY page_path
ORDER BY views DESC
LIMIT 50;

-- Grant access to views for authenticated users (admins) implies they can SELECT
-- Default is usually restricted, so we ensure authenticated role can read these views
GRANT SELECT ON public.analytics_daily_stats TO authenticated;
GRANT SELECT ON public.analytics_country_stats TO authenticated;
GRANT SELECT ON public.analytics_device_stats TO authenticated;
GRANT SELECT ON public.analytics_top_pages TO authenticated;
