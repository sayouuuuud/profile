-- Enable RLS on messages table if not already enabled
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow public (anonymous) users to insert messages
-- This is required for the contact form to work without authentication
CREATE POLICY "Allow public to insert messages"
ON public.messages
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow authenticated users (admin) to view messages
CREATE POLICY "Allow admins to view messages"
ON public.messages
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users (admin) to delete messages
CREATE POLICY "Allow admins to delete messages"
ON public.messages
FOR DELETE
TO authenticated
USING (true);

-- Allow authenticated users (admin) to update messages (e.g. mark as read)
CREATE POLICY "Allow admins to update messages"
ON public.messages
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
