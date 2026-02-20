-- Create login_events table
CREATE TABLE IF NOT EXISTS public.login_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  email TEXT,
  status TEXT NOT NULL, -- 'success', 'failure'
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.login_events ENABLE ROW LEVEL SECURITY;

-- Allow server-side inserts (service role) - no specific policy needed if using service role,
-- but if using server action with authenticated client, we might need insert policy.
-- Server actions usually run as the user or as generic server.
-- We'll allow authenticated users to view logs (for admin panel).

CREATE POLICY "Allow admins to read login_events"
ON public.login_events
FOR SELECT
TO authenticated
USING (true);

-- Allow public insert (for logging from server action running as anon)
CREATE POLICY "Allow public insert to login_events"
ON public.login_events
FOR INSERT
TO anon
WITH CHECK (true);
