-- Enable RLS and grant permissions for all admin-managed tables

-- Helper function to enable RLS and add policies
CREATE OR REPLACE FUNCTION enable_admin_access(table_name text) RETURNS void AS $$
BEGIN
    -- Enable RLS
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);

    -- Drop existing policies to avoid conflicts
    EXECUTE format('DROP POLICY IF EXISTS "Public read access" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Admin full access" ON %I', table_name);

    -- Grant permissions to authenticated users
    EXECUTE format('GRANT ALL ON TABLE %I TO authenticated', table_name);
    EXECUTE format('GRANT ALL ON TABLE %I TO service_role', table_name);

    -- Create Read Policy (Public)
    EXECUTE format('CREATE POLICY "Public read access" ON %I FOR SELECT USING (true)', table_name);

    -- Create Write Policy (Authenticated Users)
    EXECUTE format('CREATE POLICY "Admin full access" ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true)', table_name);
END;
$$ LANGUAGE plpgsql;

-- Apply to all relevant tables
SELECT enable_admin_access('site_settings');
SELECT enable_admin_access('metrics');
SELECT enable_admin_access('executive_brief');
SELECT enable_admin_access('certificates');
SELECT enable_admin_access('education');
SELECT enable_admin_access('social_links');
SELECT enable_admin_access('datalinks');
SELECT enable_admin_access('skill_categories');
SELECT enable_admin_access('skills');
SELECT enable_admin_access('operations');
SELECT enable_admin_access('theme_settings');
-- Note: case_studies was already handled, but running it again is safe due to drop policy
SELECT enable_admin_access('case_studies'); 

-- Clean up helper function
DROP FUNCTION enable_admin_access(text);
