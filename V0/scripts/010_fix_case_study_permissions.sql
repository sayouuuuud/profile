-- Enable RLS on the table
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;

-- Grant access to authenticated users
GRANT ALL ON TABLE public.case_studies TO authenticated;
GRANT ALL ON TABLE public.case_studies TO service_role;

-- Policy for Authenticated Users (Full Access)
DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.case_studies;
CREATE POLICY "Enable all for authenticated users" 
ON public.case_studies 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Policy for Public (Read Only)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.case_studies;
CREATE POLICY "Enable read access for all users" 
ON public.case_studies 
FOR SELECT 
TO public 
USING (true);

-- Also ensure sequences are accessible if any
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
