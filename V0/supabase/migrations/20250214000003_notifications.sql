-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL, -- 'info', 'success', 'warning', 'error'
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Allow admins to read/update notifications
CREATE POLICY "Allow admins to access notifications"
ON public.notifications
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Function to create notification on new message
CREATE OR REPLACE FUNCTION public.handle_new_message()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (type, title, message)
  VALUES ('info', 'New Message Received', 'From: ' || NEW.name || ' - ' || NEW.subject);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new message
DROP TRIGGER IF EXISTS on_message_created ON public.messages;
CREATE TRIGGER on_message_created
AFTER INSERT ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.handle_new_message();

-- Function to create notification on failed login
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

-- Trigger for failed login
DROP TRIGGER IF EXISTS on_login_attempt ON public.login_events;
CREATE TRIGGER on_login_attempt
AFTER INSERT ON public.login_events
FOR EACH ROW EXECUTE FUNCTION public.handle_failed_login();
