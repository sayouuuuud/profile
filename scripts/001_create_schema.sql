-- ============================================
-- PORTFOLIO DATABASE SCHEMA
-- Complete schema for Sayed Elshazly Portfolio
-- ============================================

-- Site Settings (hero, meta, theme)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_title TEXT NOT NULL DEFAULT 'Architect Command Center: Sayed Elshazly',
  site_description TEXT,
  hero_name TEXT NOT NULL DEFAULT 'SAYED ELSHAZLY',
  hero_subtitle TEXT DEFAULT '// The Wartime Architect',
  hero_description TEXT,
  hero_image_url TEXT,
  hero_role TEXT DEFAULT 'ARCHITECT',
  hero_class TEXT DEFAULT 'Strategic Executive',
  hero_status TEXT DEFAULT 'OPERATIONAL',
  hero_location TEXT DEFAULT 'CAIRO, EG // REMOTE',
  hero_timezone TEXT DEFAULT 'UTC+3',
  contact_email TEXT,
  contact_phone TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Metrics (landing page stat cards)
CREATE TABLE IF NOT EXISTS public.metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  value TEXT NOT NULL,
  suffix TEXT,
  icon TEXT,
  description TEXT,
  chart_type TEXT DEFAULT 'bar',
  chart_data JSONB,
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Executive Brief
CREATE TABLE IF NOT EXISTS public.executive_brief (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  philosophy TEXT DEFAULT 'Ship to learn. Optimize to scale.',
  operating_model TEXT DEFAULT 'ZERO-SUM EXECUTION',
  velocity_factor TEXT DEFAULT 'HIGH-FREQUENCY',
  summary TEXT,
  experience_highlights JSONB,
  tags JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Skill Categories
CREATE TABLE IF NOT EXISTS public.skill_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  proficiency INT DEFAULT 0,
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Skills (belongs to a category)
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.skill_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level INT DEFAULT 0,
  icon TEXT,
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Operations / Career Timeline
CREATE TABLE IF NOT EXISTS public.operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT,
  location TEXT,
  start_date TEXT,
  end_date TEXT,
  description TEXT,
  achievements JSONB,
  tags JSONB,
  status TEXT DEFAULT 'COMPLETED',
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Certificates
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT,
  issue_date TEXT,
  credential_id TEXT,
  credential_url TEXT,
  image_url TEXT,
  category TEXT,
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Education
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  degree TEXT,
  field_of_study TEXT,
  start_year TEXT,
  end_year TEXT,
  grade TEXT,
  description TEXT,
  achievements JSONB,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Arsenal / Tools
CREATE TABLE IF NOT EXISTS public.arsenal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  icon_url TEXT,
  proficiency INT DEFAULT 0,
  description TEXT,
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Case Studies
CREATE TABLE IF NOT EXISTS public.case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  client TEXT,
  category TEXT,
  status TEXT DEFAULT 'COMPLETED',
  date TEXT,
  duration TEXT,
  team_size TEXT,
  thumbnail_url TEXT,
  cover_image_url TEXT,
  summary TEXT,
  description TEXT,
  challenge TEXT,
  solution TEXT,
  impact TEXT,
  tags JSONB,
  metrics JSONB,
  tech_stack JSONB,
  architecture_nodes JSONB,
  code_snippets JSONB,
  gallery_images JSONB,
  is_featured BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Contact Messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  is_starred BOOLEAN DEFAULT false,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Social Links
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  is_visible BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Theme Settings
CREATE TABLE IF NOT EXISTS public.theme_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_color TEXT DEFAULT '#10b981',
  accent_color TEXT DEFAULT '#34d399',
  gold_color TEXT DEFAULT '#d4af37',
  background_color TEXT DEFAULT '#050505',
  surface_color TEXT DEFAULT '#0a0a0a',
  border_color TEXT DEFAULT '#1f2937',
  font_display TEXT DEFAULT 'Space Grotesk',
  font_serif TEXT DEFAULT 'Cinzel',
  dark_mode BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Datalinks (footer/social/external links config)
CREATE TABLE IF NOT EXISTS public.datalinks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL,
  label TEXT NOT NULL,
  url TEXT,
  icon TEXT,
  description TEXT,
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Activity Log (admin dashboard)
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Landing Page Sections (dynamic section content)
CREATE TABLE IF NOT EXISTS public.landing_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  title TEXT,
  subtitle TEXT,
  content JSONB,
  is_visible BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.executive_brief ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arsenal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.datalinks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_sections ENABLE ROW LEVEL SECURITY;

-- Public read policies (for public pages)
CREATE POLICY "public_read_site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "public_read_metrics" ON public.metrics FOR SELECT USING (true);
CREATE POLICY "public_read_executive_brief" ON public.executive_brief FOR SELECT USING (true);
CREATE POLICY "public_read_skill_categories" ON public.skill_categories FOR SELECT USING (true);
CREATE POLICY "public_read_skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "public_read_operations" ON public.operations FOR SELECT USING (true);
CREATE POLICY "public_read_certificates" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "public_read_education" ON public.education FOR SELECT USING (true);
CREATE POLICY "public_read_arsenal" ON public.arsenal FOR SELECT USING (true);
CREATE POLICY "public_read_case_studies" ON public.case_studies FOR SELECT USING (true);
CREATE POLICY "public_read_social_links" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "public_read_theme_settings" ON public.theme_settings FOR SELECT USING (true);
CREATE POLICY "public_read_datalinks" ON public.datalinks FOR SELECT USING (true);
CREATE POLICY "public_read_landing_sections" ON public.landing_sections FOR SELECT USING (true);

-- Public insert for messages (contact form)
CREATE POLICY "public_insert_messages" ON public.messages FOR INSERT WITH CHECK (true);

-- Authenticated admin write policies
CREATE POLICY "admin_all_site_settings" ON public.site_settings FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "admin_all_metrics" ON public.metrics FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "admin_all_executive_brief" ON public.executive_brief FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "admin_all_skill_categories" ON public.skill_categories FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "admin_all_skills" ON public.skills FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "admin_all_operations" ON public.operations FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "admin_all_certificates" ON public.certificates FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "admin_all_education" ON public.education FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "admin_all_arsenal" ON public.arsenal FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "admin_all_case_studies" ON public.case_studies FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "admin_all_messages" ON public.messages FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "admin_all_social_links" ON public.social_links FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "admin_all_theme_settings" ON public.theme_settings FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "admin_all_datalinks" ON public.datalinks FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "admin_all_activity_log" ON public.activity_log FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "admin_all_landing_sections" ON public.landing_sections FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
