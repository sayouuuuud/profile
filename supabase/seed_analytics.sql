-- Clear existing analytics (optional, uncomment if desired)
-- TRUNCATE public.analytics_events;

INSERT INTO public.analytics_events (visitor_id, event_type, page_path, referrer, country, device_type, user_agent, timestamp)
VALUES
('v1', 'page_view', '/', 'google.com', 'EG', 'mobile', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)', now() - interval '10 minutes'),
('v2', 'page_view', '/admin', NULL, 'US', 'desktop', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', now() - interval '30 minutes'),
('v3', 'page_view', '/auth/login', NULL, 'SA', 'desktop', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', now() - interval '1 hour'),
('v1', 'page_view', '/case-studies', '/', 'EG', 'mobile', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)', now() - interval '5 minutes'),
('v4', 'page_view', '/', 'twitter.com', 'GB', 'tablet', 'Mozilla/5.0 (iPad; CPU OS 13_2 like Mac OS X)', now() - interval '2 hours'),
('v5', 'page_view', '/', NULL, 'EG', 'desktop', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', now() - interval '3 hours'),
('v6', 'page_view', '/admin', '/auth/login', 'US', 'desktop', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', now() - interval '4 hours'),
('v2', 'page_view', '/admin/messages', '/admin', 'US', 'desktop', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', now() - interval '25 minutes'),
('v7', 'page_view', '/', 'linkedin.com', 'AE', 'mobile', 'Mozilla/5.0 (Android 10; Mobile; rv:68.0)', now() - interval '5 hours'),
('v8', 'page_view', '/contact', '/', 'CA', 'desktop', 'Mozilla/5.0 (X11; Linux x86_64)', now() - interval '6 hours'),
('v1', 'page_view', '/about', '/', 'EG', 'mobile', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)', now() - interval '2 minutes'),
('v9', 'page_view', '/', 'google.com', 'EG', 'desktop', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', now() - interval '1 day'),
('v10', 'page_view', '/', NULL, 'US', 'mobile', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)', now() - interval '1 day 2 hours'),
('v11', 'page_view', '/case-studies', 'google.com', 'DE', 'desktop', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', now() - interval '1 day 5 hours'),
('v12', 'page_view', '/admin', NULL, 'EG', 'desktop', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', now() - interval '1 day 10 hours');
