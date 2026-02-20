-- ============================================================================
-- AI FEATURES EXTENDED SCHEMA
-- Extended database schema for AI-powered features
-- Features: AI Project Parser, Case Study Generator, Morning Brief Analytics
-- ============================================================================

-- ============================================================================
-- AI PROJECT PARSER TABLES
-- ============================================================================

-- Parsed Projects Storage
CREATE TABLE IF NOT EXISTS public.parsed_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  source_type VARCHAR(50) NOT NULL CHECK (source_type IN ('text', 'github', 'voice')),
  source_input TEXT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  key_features TEXT[] DEFAULT '{}',
  metrics JSONB,
  confidence_score DECIMAL(3, 2) DEFAULT 0,
  parsed_by VARCHAR(100) DEFAULT 'gemini-2.0',
  raw_analysis JSONB,
  is_published BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_parsed_projects_user_id ON public.parsed_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_parsed_projects_created_at ON public.parsed_projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_parsed_projects_source ON public.parsed_projects(source_type);

-- ============================================================================
-- CASE STUDY GENERATOR TABLES
-- ============================================================================

-- Projects (for case study generation)
CREATE TABLE IF NOT EXISTS public.case_study_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  github_url VARCHAR(255) UNIQUE,
  description TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  architecture TEXT,
  repository_structure JSONB,
  import_status VARCHAR(50) DEFAULT 'pending' CHECK (import_status IN ('pending', 'analyzing', 'analyzed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_case_study_projects_user_id ON public.case_study_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_case_study_projects_github_url ON public.case_study_projects(github_url);

-- GitHub Analysis Results
CREATE TABLE IF NOT EXISTS public.github_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.case_study_projects(id) ON DELETE CASCADE,
  repository_structure JSONB NOT NULL,
  tech_stack_analysis JSONB NOT NULL,
  identified_patterns TEXT[] DEFAULT '{}',
  potential_challenges TEXT[] DEFAULT '{}',
  strengths TEXT[] DEFAULT '{}',
  repo_stats JSONB,
  analyzed_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_github_analysis_project_id ON public.github_analysis(project_id);

-- Interview Questions for Case Study
CREATE TABLE IF NOT EXISTS public.case_study_interview_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES public.github_analysis(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.case_study_projects(id) ON DELETE CASCADE,
  question_order INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  question_context TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('architecture', 'performance', 'security', 'ux', 'business')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_interview_questions_analysis_id ON public.case_study_interview_questions(analysis_id);
CREATE INDEX IF NOT EXISTS idx_interview_questions_project_id ON public.case_study_interview_questions(project_id);

-- Interview Responses
CREATE TABLE IF NOT EXISTS public.case_study_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.case_study_projects(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.case_study_interview_questions(id) ON DELETE CASCADE,
  answer_text TEXT,
  answer_audio_url VARCHAR(255),
  response_type VARCHAR(20) NOT NULL CHECK (response_type IN ('text', 'voice')),
  is_primary BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_case_study_responses_project_id ON public.case_study_responses(project_id);
CREATE INDEX IF NOT EXISTS idx_case_study_responses_question_id ON public.case_study_responses(question_id);

-- Generated Case Studies (extends existing case_studies table)
CREATE TABLE IF NOT EXISTS public.case_study_generation_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_study_id UUID NOT NULL REFERENCES public.case_studies(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.case_study_projects(id) ON DELETE SET NULL,
  analysis_id UUID REFERENCES public.github_analysis(id) ON DELETE SET NULL,
  generation_status VARCHAR(50) DEFAULT 'draft' CHECK (generation_status IN ('draft', 'generated', 'published', 'archived')),
  github_repo_url VARCHAR(255),
  interview_count INTEGER DEFAULT 0,
  generation_completed_at TIMESTAMPTZ,
  generated_by VARCHAR(100) DEFAULT 'case-study-generator',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_case_study_metadata_case_study_id ON public.case_study_generation_metadata(case_study_id);
CREATE INDEX IF NOT EXISTS idx_case_study_metadata_project_id ON public.case_study_generation_metadata(project_id);

-- ============================================================================
-- MORNING BRIEF ANALYTICS TABLES
-- ============================================================================

-- Daily Analytics Snapshot
CREATE TABLE IF NOT EXISTS public.daily_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  total_visits INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5, 2) DEFAULT 0,
  top_traffic_source VARCHAR(255),
  bounce_rate DECIMAL(5, 2) DEFAULT 0,
  avg_session_duration INTEGER DEFAULT 0,
  source_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_daily_analytics_user_date ON public.daily_analytics(user_id, date DESC);

-- Analytics Insights (AI-generated)
CREATE TABLE IF NOT EXISTS public.analytics_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  insight_type VARCHAR(50) NOT NULL CHECK (insight_type IN ('trend', 'anomaly', 'opportunity', 'recommendation')),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  metric_value VARCHAR(100),
  metric_change DECIMAL(5, 2),
  metric_label VARCHAR(100),
  action_label VARCHAR(255),
  action_href VARCHAR(255),
  priority VARCHAR(20) CHECK (priority IN ('high', 'medium', 'low')),
  insight_category VARCHAR(100),
  generated_by VARCHAR(100) DEFAULT 'gemini-2.0',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_insights_user_date ON public.analytics_insights(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_insights_type ON public.analytics_insights(insight_type);

-- Daily Action Items (AI-recommended)
CREATE TABLE IF NOT EXISTS public.daily_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  brief_date DATE NOT NULL,
  action_title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  impact VARCHAR(255) NOT NULL,
  action_label VARCHAR(255) NOT NULL,
  action_href VARCHAR(255) NOT NULL,
  estimated_time_minutes INTEGER,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_daily_actions_user_date ON public.daily_actions(user_id, brief_date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_actions_priority ON public.daily_actions(priority);

-- Traffic Sources Breakdown
CREATE TABLE IF NOT EXISTS public.traffic_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  source_name VARCHAR(255) NOT NULL,
  source_type VARCHAR(50) CHECK (source_type IN ('organic', 'direct', 'referral', 'social', 'paid', 'other')),
  visits INTEGER DEFAULT 0,
  visitors INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  revenue DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date, source_name)
);

CREATE INDEX IF NOT EXISTS idx_traffic_sources_user_date ON public.traffic_sources(user_id, date DESC);

-- Page Performance Metrics
CREATE TABLE IF NOT EXISTS public.page_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  page_path VARCHAR(255) NOT NULL,
  page_title VARCHAR(255),
  visits INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  bounce_rate DECIMAL(5, 2) DEFAULT 0,
  avg_time_on_page DECIMAL(8, 2) DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date, page_path)
);

CREATE INDEX IF NOT EXISTS idx_page_performance_user_date ON public.page_performance(user_id, date DESC);

-- Lead Tracking
CREATE TABLE IF NOT EXISTS public.leads_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  company_name VARCHAR(255),
  contact_name VARCHAR(255),
  email VARCHAR(255),
  engagement_score INTEGER DEFAULT 0,
  last_visit TIMESTAMPTZ,
  time_on_site INTEGER DEFAULT 0,
  pages_visited TEXT[] DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'warm', 'contacted', 'converted')),
  follow_up_due_date DATE,
  notes TEXT,
  source_page VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads_tracking(status);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads_tracking(email);

-- Morning Brief History
CREATE TABLE IF NOT EXISTS public.morning_brief_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  brief_date DATE NOT NULL,
  brief_content JSONB NOT NULL,
  summary TEXT,
  insights_count INTEGER DEFAULT 0,
  actions_count INTEGER DEFAULT 0,
  sent_at TIMESTAMPTZ,
  telegram_message_id VARCHAR(255),
  telegram_sent BOOLEAN DEFAULT false,
  email_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, brief_date)
);

CREATE INDEX IF NOT EXISTS idx_morning_brief_user_date ON public.morning_brief_history(user_id, brief_date DESC);
CREATE INDEX IF NOT EXISTS idx_morning_brief_sent ON public.morning_brief_history(telegram_sent);

-- ============================================================================
-- NOTIFICATION & INTEGRATION TABLES
-- ============================================================================

-- User Preferences for AI Features
CREATE TABLE IF NOT EXISTS public.user_ai_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  ai_parser_enabled BOOLEAN DEFAULT true,
  case_study_notifications BOOLEAN DEFAULT true,
  morning_brief_enabled BOOLEAN DEFAULT true,
  morning_brief_time TIME DEFAULT '09:00',
  telegram_user_id VARCHAR(255),
  telegram_chat_id VARCHAR(255),
  email_notifications BOOLEAN DEFAULT true,
  preferred_language VARCHAR(50) DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_ai_preferences(user_id);

-- Feature Usage Analytics
CREATE TABLE IF NOT EXISTS public.feature_usage_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  feature_name VARCHAR(100) NOT NULL CHECK (feature_name IN ('ai_parser', 'scalability_simulator', 'case_study_generator', 'morning_brief')),
  action VARCHAR(100) NOT NULL,
  duration_seconds INTEGER,
  status VARCHAR(50) DEFAULT 'success' CHECK (status IN ('success', 'error', 'incomplete')),
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feature_usage_user_id ON public.feature_usage_log(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_usage_feature ON public.feature_usage_log(feature_name);
CREATE INDEX IF NOT EXISTS idx_feature_usage_created_at ON public.feature_usage_log(created_at DESC);

-- ============================================================================
-- HELPER FUNCTION: Update Updated Timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_parsed_projects_updated_at BEFORE UPDATE ON public.parsed_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_case_study_projects_updated_at BEFORE UPDATE ON public.case_study_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_case_study_metadata_updated_at BEFORE UPDATE ON public.case_study_generation_metadata
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_ai_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- VIEWS FOR ANALYTICS & REPORTING
-- ============================================================================

-- Latest Morning Brief View
CREATE OR REPLACE VIEW public.latest_morning_briefs AS
SELECT DISTINCT ON (user_id)
  user_id,
  brief_date,
  brief_content,
  insights_count,
  actions_count,
  created_at
FROM public.morning_brief_history
ORDER BY user_id, brief_date DESC;

-- User Feature Performance View
CREATE OR REPLACE VIEW public.user_feature_stats AS
SELECT
  user_id,
  feature_name,
  COUNT(*) as total_uses,
  COUNT(CASE WHEN status = 'success' THEN 1 END) as successful_uses,
  AVG(CASE WHEN duration_seconds > 0 THEN duration_seconds ELSE NULL END) as avg_duration,
  MAX(created_at) as last_used_at
FROM public.feature_usage_log
GROUP BY user_id, feature_name;

-- ============================================================================
-- NOTES:
-- - All timestamps use TIMESTAMPTZ for timezone safety
-- - Indexes created on frequently queried columns
-- - Foreign keys with ON DELETE CASCADE for data integrity
-- - UNIQUE constraints prevent duplicate entries
-- - Views provide analytics-ready data aggregation
-- ============================================================================
