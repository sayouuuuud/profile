-- 1. Contact Form Fix
-- Drop policy if exists to avoid conflict
DROP POLICY IF EXISTS "Allow public to insert messages" ON public.messages;
DROP POLICY IF EXISTS "Allow admins to read messages" ON public.messages;
DROP POLICY IF EXISTS "Allow admins to update messages" ON public.messages;
DROP POLICY IF EXISTS "Allow admins to delete messages" ON public.messages;

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Explicit Grants
GRANT INSERT ON TABLE public.messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON TABLE public.messages TO authenticated;

-- Allow public (anonymous) users to insert messages
CREATE POLICY "Allow public to insert messages"
ON public.messages
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow admins to Select
CREATE POLICY "Allow admins to read messages"
ON public.messages
FOR SELECT
TO authenticated
USING (true);

-- Allow admins to Update (mark as read)
CREATE POLICY "Allow admins to update messages"
ON public.messages
FOR UPDATE
TO authenticated
USING (true);

-- Allow admins to Delete
CREATE POLICY "Allow admins to delete messages"
ON public.messages
FOR DELETE
TO authenticated
USING (true);


-- 2. Analytics Suite
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'page_view', 'click', 'scroll'
  page_path TEXT NOT NULL,
  referrer TEXT,
  country TEXT,
  device_type TEXT,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- Ensure columns exist (For existing tables)
DO $$
BEGIN
    ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS referrer TEXT;
    ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS country TEXT;
    ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS device_type TEXT;
    ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS visitor_id TEXT;
END $$;

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Explicit Grants
GRANT INSERT ON TABLE public.analytics_events TO anon;
GRANT SELECT ON TABLE public.analytics_events TO authenticated;

DROP POLICY IF EXISTS "Allow public insert to analytics" ON public.analytics_events;
CREATE POLICY "Allow public insert to analytics"
ON public.analytics_events
FOR INSERT
TO anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admins to read analytics" ON public.analytics_events;
CREATE POLICY "Allow admins to read analytics"
ON public.analytics_events
FOR SELECT
TO authenticated
USING (true);

-- Views (FORCE replace to ensure ownership/permissions)
CREATE OR REPLACE VIEW public.analytics_daily_stats AS
SELECT
  date_trunc('day', timestamp) AS date,
  COUNT(*) AS views_count,
  COUNT(DISTINCT visitor_id) AS visitors_count
FROM public.analytics_events
GROUP BY 1
ORDER BY 1 DESC;

CREATE OR REPLACE VIEW public.analytics_top_pages AS
SELECT
  page_path,
  COUNT(*) AS views
FROM public.analytics_events
GROUP BY 1
ORDER BY 2 DESC;

CREATE OR REPLACE VIEW public.analytics_country_stats AS
SELECT
  COALESCE(country, 'Unknown') AS country,
  COUNT(*) AS count
FROM public.analytics_events
GROUP BY 1
ORDER BY 2 DESC;

CREATE OR REPLACE VIEW public.analytics_device_stats AS
SELECT
  COALESCE(device_type, 'Unknown') AS device_type,
  COUNT(*) AS count,
  (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM public.analytics_events))::numeric(5,2) AS percentage
FROM public.analytics_events
GROUP BY 1
ORDER BY 2 DESC;


-- 3. Login Monitoring
CREATE TABLE IF NOT EXISTS public.login_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  email TEXT,
  status TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure columns exist (For existing tables)
DO $$
BEGIN
    ALTER TABLE public.login_events ADD COLUMN IF NOT EXISTS email TEXT;
    ALTER TABLE public.login_events ADD COLUMN IF NOT EXISTS status TEXT;
    ALTER TABLE public.login_events ADD COLUMN IF NOT EXISTS ip_address TEXT;
    ALTER TABLE public.login_events ADD COLUMN IF NOT EXISTS user_agent TEXT;
END $$;

ALTER TABLE public.login_events ENABLE ROW LEVEL SECURITY;

-- Explicit Grants
GRANT INSERT ON TABLE public.login_events TO anon; -- Needed for server action failure logging
GRANT SELECT ON TABLE public.login_events TO authenticated;

DROP POLICY IF EXISTS "Allow admins to read login_events" ON public.login_events;
CREATE POLICY "Allow admins to read login_events"
ON public.login_events
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Allow public insert to login_events" ON public.login_events;
CREATE POLICY "Allow public insert to login_events"
ON public.login_events
FOR INSERT
TO anon
WITH CHECK (true);


-- 4. Notification System
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.notifications TO authenticated;

DROP POLICY IF EXISTS "Allow admins to access notifications" ON public.notifications;
CREATE POLICY "Allow admins to access notifications"
ON public.notifications
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.handle_new_message()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (type, title, message)
  VALUES ('info', 'New Message Received', 'From: ' || NEW.name || ' - ' || NEW.subject);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_message_created ON public.messages;
CREATE TRIGGER on_message_created
AFTER INSERT ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.handle_new_message();

CREATE OR REPLACE FUNCTION public.handle_failed_login()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'failure' THEN
    INSERT INTO public.notifications (type, title, message)
    VALUES ('error', 'Security Alert: Failed Login', 'Attempt for ' || NEW.email || ' from ' || NEW.ip_address);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_login_attempt ON public.login_events;
CREATE TRIGGER on_login_attempt
AFTER INSERT ON public.login_events
FOR EACH ROW EXECUTE FUNCTION public.handle_failed_login();
