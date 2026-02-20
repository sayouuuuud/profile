-- Grant usage on schema public
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

-- Grant access to all tables for anon (public) users
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;

-- Ensure future tables also get these permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO authenticated;
