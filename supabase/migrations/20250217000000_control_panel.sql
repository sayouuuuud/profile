-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. System Config Table
CREATE TABLE IF NOT EXISTS public.system_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL CHECK (category IN ('ai', 'telegram', 'reports')),
    key TEXT NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by TEXT,
    UNIQUE(category, key)
);

-- 2. Usage Stats Table
CREATE TABLE IF NOT EXISTS public.usage_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    category TEXT NOT NULL CHECK (category IN ('ai', 'telegram', 'reports')),
    metric TEXT NOT NULL,
    value INTEGER NOT NULL DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Usage Stats
CREATE INDEX IF NOT EXISTS idx_usage_stats_date_category ON public.usage_stats(date, category);
CREATE INDEX IF NOT EXISTS idx_usage_stats_metric ON public.usage_stats(metric);

-- 3. Cost Tracking Table
CREATE TABLE IF NOT EXISTS public.cost_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    service TEXT NOT NULL CHECK (service IN ('gemini', 'telegram', 'supabase', 'vercel')),
    cost_usd DECIMAL(10, 4) NOT NULL DEFAULT 0,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Cost Tracking
CREATE INDEX IF NOT EXISTS idx_cost_tracking_date_service ON public.cost_tracking(date, service);

-- 4. Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    level TEXT NOT NULL CHECK (level IN ('info', 'warning', 'error', 'success')),
    category TEXT NOT NULL CHECK (category IN ('ai', 'telegram', 'reports', 'system', 'config')),
    action TEXT NOT NULL,
    message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    user_id TEXT
);

-- Indexes for Activity Logs
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON public.activity_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_level ON public.activity_logs(level);
CREATE INDEX IF NOT EXISTS idx_activity_logs_category ON public.activity_logs(category);

-- RLS Policies (Allow Admin Access)
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- For now, allow all authenticated users (assuming only admins have accounts)
CREATE POLICY "Allow full access to system_config" ON public.system_config FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow full access to usage_stats" ON public.usage_stats FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow full access to cost_tracking" ON public.cost_tracking FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow full access to activity_logs" ON public.activity_logs FOR ALL USING (auth.role() = 'authenticated');

-- Seed Initial Configuration
INSERT INTO public.system_config (category, key, value, description) VALUES
-- AI Configs
('ai', 'model', '"gemini-1.5-flash"', 'Gemini Model ID'),
('ai', 'temperature', '0.7', 'Creativity level (0.0 - 1.0)'),
('ai', 'max_tokens', '2048', 'Max output tokens'),
('ai', 'retry_attempts', '3', 'Number of retries on failure'),
('ai', 'timeout_seconds', '30', 'API timeout in seconds'),

-- Telegram Configs
('telegram', 'notifications_enabled', 'true', 'Master switch for notifications'),
('telegram', 'notification_types', '{"project_created": true, "lead_received": true, "report_generated": true, "error_occurred": true}', 'Enabled notification types'),
('telegram', 'quiet_hours_enabled', 'false', 'Enable quiet hours'),
('telegram', 'quiet_hours_start', '"22:00"', 'Quiet hours start time'),
('telegram', 'quiet_hours_end', '"08:00"', 'Quiet hours end time'),
('telegram', 'rate_limit_per_minute', '20', 'Max messages per minute'),
('telegram', 'rate_limit_per_hour', '100', 'Max messages per hour'),

-- Reports Configs
('reports', 'daily_enabled', 'true', 'Enable daily morning brief'),
('reports', 'daily_time', '"09:00"', 'Daily report time'),
('reports', 'daily_timezone', '"Cairo"', 'Timezone for reports'),
('reports', 'weekly_enabled', 'true', 'Enable weekly summary'),
('reports', 'weekly_day', '"Monday"', 'Day for weekly report'),
('reports', 'sections', '{"visits": true, "leads": true, "top_projects": true, "competitor_alerts": false, "cost_summary": true}', 'Enabled report sections'),
('reports', 'delivery_telegram', 'true', 'Send via Telegram'),
('reports', 'delivery_email', 'false', 'Send via Email')
ON CONFLICT (category, key) DO UPDATE SET value = EXCLUDED.value;
